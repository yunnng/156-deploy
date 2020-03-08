// import git from 'nodegit'
const git = require('nodegit')
const config = require('../config')

let repo
config.repositoriesPath.forEach(async ({ path }) => {
  const pathToRepo = require('path').resolve(path)
  repo = await git.Repository.open(pathToRepo)
})

module.exports = {
  branchList() {
    return repo.getReferenceNames(3)
      .then(async(data) => {
        // 去重
        const m = new Map()
        return data.filter(_ => !m.has(_) && m.set(_, 1))
          .filter(_ => !(/^refs\/heads*/.test(_))) // 过滤非远程分支
      })
  },
}
