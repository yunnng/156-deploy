const git = require('simple-git/promise')
const { repositories } = require('../config')
const { exec } = require('./../service/util')

Object.values(repositories).forEach(async(r) => {
  const repository = r
  const { path } = repository
  const absolutePath = require('path').resolve(__dirname, path)
  repository.status = -1 // 0:发布中 1：发布成功 2：发布失败
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
  async deploy(key, br, p, s) {
    const repository = repositories[key]
    const { repo, status } = repository
    if (repo && status) {
      // this.progressing(repositories[key])
      repositories[key].startTime = s
      return repo.checkout('.')
        .then(() => repo.pull())
        .then(() => repo.checkout(br))
        .then(() => repo.pull())
        .then(() => this.build(p))
        .then(async(msg) => {
          clearInterval(repository.timer)
          return {
            status: 1,
            msg,
          }
        })
        .catch(async(d) => {
          const { err, message } = d
          // console.log('====================\n', msg.err)
          clearInterval(repository.timer)
          return {
            status: 2,
            msg: err || message,
          }
        })
        .finally(() => {
          repository.deployTime = Date.now() - s
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
  /**
   * 返回所有仓库状态对象
   * @returns {{app_h5: {status: 1}, ...}}
   */
  progressMap() {
    return Object.values(repositories)
      .map(({ key, deployTime, status }) => ({
        [key]: {
          deployTime,
          status,
        },
      }))
      .reduce((a, b) => ({
        ...a,
        ...b,
      }), {})
  },
}
