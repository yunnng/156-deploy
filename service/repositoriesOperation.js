const git = require('simple-git/promise')
const { repositories } = require('../config')
const { canDeploy, exec, updateRepoStatus } = require('./../service/util')

Object.values(repositories).forEach(async(r) => {
  const repository = r
  const { path } = repository
  const absolutePath = require('path').resolve(__dirname, path)
  // -1：初始状态 0:发布成功 1：发布中 2：发布失败 3：需要安装依赖 4：安装依赖中 5：安装依赖完成（仅前端使用）6：安装依赖失败（仅前端使用）
  repository.status = -1
  repository.repo = await git(absolutePath)
})

module.exports = {
  branchList(key) {
    const { repo } = repositories[key]
    if (repo) {
      return repo.fetch({ '--prune': true })
        .then(() => repo.branch({ '-r': true }))
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
    if (repo && canDeploy(status)) {
      // this.progressing(repositories[key])
      repository.status = 1
      repository.startTime = s
      return repo.checkout('.')
        .then(() => repo.pull())
        .then(() => repo.checkout(br))
        .then(() => repo.pull())
        .then(() => this.build(p))
        .then(() => exec(`pm2 restart ${key}`))
        .then(async(msg) => {
          updateRepoStatus(repository, { status: 0 })
          return {
            status: 0,
            msg,
          }
        })
        .catch(async(d) => {
          const { err, message } = d
          updateRepoStatus(repository, { status: 2 })
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
  async installDependencies(key, br, p, s) {
    const repository = repositories[key]
    const { repo } = repository
    if (repo) {
      // this.progressing(repositories[key])
      repository.status = 4
      repository.startTime = s
      return exec('npm i', { cwd: p })
        .then(() => repo.checkout('.'))
        .then(async(msg) => {
          updateRepoStatus(repository, { status: 5 })
          return {
            status: 5,
            msg,
          }
        })
        .catch(async(d) => {
          const { err, message } = d
          updateRepoStatus(repository, { status: 6 })
          return {
            status: 6,
            msg: err || message,
          }
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
   * @returns {{app_h5: {status: 0}, ...}}
   */
  progressMap() {
    return Object.values(repositories)
      .map(({
        key, deployTime, startTime, status,
      }) => ({
        [key]: {
          startTime,
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
