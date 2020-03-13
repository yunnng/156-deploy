const git = require('simple-git/promise')
const { repositories } = require('../config')
const { exec } = require('./../service/util')

Object.values(repositories).forEach(async(r) => {
  const repository = r
  const { path } = repository
  const absolutePath = require('path').resolve(__dirname, path)
  repository.progress = 100
  repository.repo = await git(absolutePath)
})

module.exports = {
  branchList(key) {
    const { repo } = repositories[key]
    if (repo) {
      return repo.branch({ '-r': true })
        .then(async data => data.all)
    }
    return []
  },
  commitList(key, branch = 'origin/master') {
    const { repo } = repositories[key]
    if (repo) {
      return repo.log({ '-30': true, [branch]: true })
        .then(({ all = [] }) => all)
    }
    return []
  },
  async deploy(key, br, p) {
    const repository = repositories[key]
    const { repo, progress } = repository
    if (repo && (progress === 0 || progress === 100)) {
      const start = Date.now()
      this.progressing(repositories[key])
      return repo.checkout('.')
        .then(() => this.build(p))
        .then(() => {
          clearInterval(repository.timer)
          repository.progress = 100
        })
        .catch((msg) => {
          console.log('====================\n', msg)
          clearInterval(repository.timer)
          repository.progress = 0
        })
        .finally(() => {
          repository.deployTime = Date.now() - start
        })
    }
    return []
  },
  build(p) {
    return exec('npm run build', { cwd: p })
    // .then(() => exec('pm2 restart app_h5'))
  },
  progressing(r) {
    const repository = r
    const preTime = repository.deployTime / 100
    repository.progress = 1
    repository.timer = setInterval(() => {
      const p = repository.progress
      if (p < 99) {
        repository.progress += 1
      } else clearInterval(repository.timer)
    }, preTime)
  },
  progressMap() {
    return Object.values(repositories)
      .map(({ key, progress, deployTime }) => ({
        [key]: {
          progress,
          deployTime,
        },
      }))
      .reduce((a, b) => ({
        ...a,
        ...b,
      }), {})
  },
}
