const git = require('nodegit')
const config = require('../config')

const repos = {}
config.repositoriesPath.forEach(async({ key, path }) => {
  const pathToRepo = require('path').resolve(__dirname, path)
  repos[key] = await git.Repository.open(pathToRepo)
})

module.exports = {
  branchList(key) {
    const repo = repos[key]
    if (repo) {
      return repo.getReferenceNames(3)
        .then(async(data) => {
          // 去重
          const m = new Map()
          return data.filter(_ => !m.has(_) && m.set(_, 1))
            .filter(_ => !(/^refs\/heads*/.test(_))) // 过滤非远程分支
        })
    }
    return []
  },
  commitList(key, branch) {
    const repo = repos[key]
    if (repo) {
      return repo.getBranch(branch)
        .then(reference => repo.checkoutRef(reference))
        .then(async() => {
          const walker = git.Revwalk.create(repo)
          // 通过pushGlob来获取所有分支的提交记录
          walker.pushGlob('c60fe13ad')
          const commits = await walker.getCommitsUntil((commit) => {
            console.log(`${commit.sha().substr(0, 8)} ${commit.author().name()} - ${commit.message().trim().substr(0, 100)}`)
            return true
          })
          console.log(commits)
          return commits.map((commit) => {
            const data = commit.date()
            const d = data.toLocaleDateString()
            const h = data.getHours()
            const m = data.getMinutes()
            return `${commit.sha().substr(0, 8)} [${d} ${h}:${m}] ${commit.author().name()} - ${commit.message().trim().substr(0, 100)}`
          })
            .filter((_, i) => i < 50)
        }, () => [])
        .then((a) => {
          console.log(a)
        }, (a) => {
          console.log(a)
        })
    }
    return []
  },
}
