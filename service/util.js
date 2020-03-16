const { exec } = require('child_process')

module.exports = {
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
}
