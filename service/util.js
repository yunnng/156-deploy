const { exec } = require('child_process')

module.exports = {
  emptyArrRes: {
    code: 0,
    data: [],
  },
  exec(cmd, options = {}) {
    return new Promise((resolve, reject) => {
      exec(cmd, options, (err, stdout) => {
        if (err) {
          const r = { cmd, p: options.cwd || './', err: err.message }
          reject(r)
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
}
