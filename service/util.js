const { exec } = require('child_process')

module.exports = {
  emptyArrRes: {
    code: 0,
    data: [],
  },
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
}
