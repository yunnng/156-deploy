const os = require('os')
const path = require('path')
const { exec } = require('child_process')
const express = require('express')
const config = require('../config')
const repoOperation = require('../service/repositoriesOperation')
const userInfo = os.userInfo()
const router = express.Router()

function e(cmd, options) {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (err, stdout) => {
      if (err) {
        const r = { cmd, p: options.cwd, err: err.message }
        reject(r)
      }
      resolve(stdout)
    })
  })
}

let uid, gid

uid = userInfo.uid
gid = userInfo.gid

// e('id')
//   .then(str => {
//     const arr = str.match(/uid=(\d+).*? gid=(\d+)/)
//     if (arr) {
//       [, uid, gid] = arr
//     }
//   })

router.get('/list', function(req, res, next) {
  res.json(config.repositoriesPath)
})

router.get('/branchList', async function(req, res, next) {
  const { query: { key } } = req
  if (key) return res.json(await repoOperation.branchList(key))
  return res.json([])
})

router.get('/commitList', async function(req, res, next) {
  const { query: { key, branch } } = req
  if (key) {
    const b = branch.split('/').pop()
    const item = config.repositoriesPath.find(_ => _.key === key)
    const p = path.resolve(__dirname, item.path)
    e('git checkout .', { cwd: p })
      .then(() => e(`git pull ${b} origin/${b}`, {
        cwd: p,
        uid,
        gid,
      }))
      .then(() => repoOperation.commitList(key, branch))
      .then((res) => res.json(res))
      .catch((msg) => {
        res.json({
          code: -1,
          msg,
        })
      })
    return
  }
  return res.json([])
})

router.get('/pull', function(req, res, next) {
  const { query: { key, branch } } = req
  const b = branch.split('/').pop()
  const item = config.repositoriesPath.find(_ => _.key === key)
  const p = path.resolve(__dirname, item.path)
  if (item) {
    e('git checkout .', { cwd: p })
      .then(() => e(`git pull ${b} origin/${b}`, { cwd: p }))
      .then(() => e(`git checkout ${b}`, { cwd: p }))
      .then(() => e(`git pull ${b} origin/${b}`, { cwd: p }))
      .then(() => res.json({
        code: 0,
        msg: 'success',
      }))
      .catch((msg) => {
        res.json({
          code: -1,
          msg,
        })
      })
    return
  }
  res.json({
    code: -1,
    msg: `path err.(${p})`,
  })
})

module.exports = router
