const { exec } = require('child_process')

exports.exec = function e(cmd, options = {}) {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (err, stdout) => {
      if (err) {
        const r = { cmd, p: options.cwd || './', err: err.message }
        reject(r)
      }
      resolve(stdout)
    })
  })
}

exports.emptyArrRes = {
  code: 0,
  data: [],
}
