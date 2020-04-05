const { exec } = require('child_process')

const utils = {
  emptyArrRes: {
    code: 0,
    data: [],
  },
  canDeploy: s => [-1, 0, 2, 5].includes(s),
  exec(cmd, options = {}) {
    return new Promise((resolve, reject) => {
      exec(cmd, options, (err, stdout, stderr) => {
        const commonStd = {
          cmd,
          p: options.cwd || './',
        }
        if (err) {
          const r = { ...commonStd, stderr }
          reject(r)
          return
        }
        resolve({
          ...commonStd,
          stdout,
        })
      })
    })
  },
  wsSend(ws, path, d) {
    ws.send(JSON.stringify({
      path,
      d,
    }))
  },
  updateRepoStatus(repo, p) {
    const r = repo
    Object.keys(p).forEach((k) => {
      // eslint-disable-next-line no-prototype-builtins
      if (r.hasOwnProperty(k)) r[k] = p[k]
    })
    return r
  },
  async promiseStack(stack, p, resData = '') {
    const list = JSON.parse(JSON.stringify(stack))
    const s = list.shift()
    if (process.env.NODE_ENV === 'development' && /^pm2.+/.test(s)) {
      if (list.length) {
        return utils.promiseStack(list, p, resData)
      }
      return resData
    }
    return utils.exec(s, { cwd: p })
      .then(async(res) => {
        if (list.length) {
          return utils.promiseStack(list, p, res)
        }
        return res
      })
  },
}
module.exports = utils
