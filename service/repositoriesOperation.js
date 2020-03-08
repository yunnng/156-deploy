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
}
