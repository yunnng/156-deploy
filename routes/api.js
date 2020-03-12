const path = require('path')
const express = require('express')
const config = require('../config')
const { exec, emptyArrRes } = require('./../service/util')
const repoOperation = require('../service/repositoriesOperation')
const router = express.Router()


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
    exec('git checkout .', { cwd: p })
      .then(() => repoOperation.checkoutPull(b, { cwd: p }))
      .then(() => repoOperation.commitList(key, branch))
      .then((data) => res.json({
        code: 0,
        data,
      }))
      .catch((msg) => {
        res.json({
          code: 500,
          msg,
          data: [],
        })
      })
    return
  }
  return res.json(emptyArrRes)
})

router.get('/pull', function(req, res, next) {
  const { query: { key, branch } } = req
  const b = branch.split('/').pop()
  const item = config.repositoriesPath.find(_ => _.key === key)
  const p = path.resolve(__dirname, item.path)
  if (item) {
    exec('git checkout .', { cwd: p })
      .then(() => repoOperation.checkoutPull(b, { cwd: p }))
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
