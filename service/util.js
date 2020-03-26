const { exec } = require('child_process')

const utils = {
  emptyArrRes: {
    code: 0,
    data: [],
  },
  canDeploy: s => [-1, 0, 2].includes(s),
  exec(cmd, options = {}) {
    return new Promise((resolve, reject) => {
      exec(cmd, options, (err, stdout, stderr) => {
        if (err) {
          const r = { cmd, p: options.cwd || './', err: stderr }
          reject(r)
          return
        }
        resolve(stdout)
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
  async promiseStack(stack, p) {
    const list = JSON.parse(JSON.stringify(stack))
    const s = list.shift()
    return utils.exec(s, { cwd: p })
      .then(async(res) => {
        if (list.length) {
          return utils.promiseStack(list, p)
        }
        return res
      })
      .catch(e => e)
  },
}
module.exports = utils
