const git = require('nodegit')
const config = require('../config')
const { exec } = require('./../service/util')

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
          walker.pushHead()
          const commits = await walker.getCommitsUntil(() => true)
          return commits.map((commit) => {
            const data = commit.date()
            const d = data.toLocaleDateString()
            const h = data.getHours()
            const m = data.getMinutes()
            return `${commit.sha().substr(0, 8)} [${d} ${h}:${m}] ${commit.author().name()} - ${commit.message().trim().substr(0, 100)}`
          })
            .filter((_, i) => i < 50)
        }, () => [])
    }
    return []
  },
  pull(branch, options) {
    return exec(`git pull origin/${branch} ${branch}`, options)
  },
  checkoutPull(branch, options) {
    return this.pull(branch, options)
      .then(() => exec(`git checkout ${branch}`, options))
      .then(() => this.pull(branch, options))
  },
}
