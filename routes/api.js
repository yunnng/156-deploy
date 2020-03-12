const path = require('path')
const express = require('express')
const config = require('../config')
const { emptyArrRes } = require('./../service/util')
const repoOperation = require('../service/repositoriesOperation')
const router = express.Router()


router.get('/list', function(req, res, next) {
  res.json({
    code: 0,
    data: Object.values(config.repositories),
  })
})

router.get('/branchList', async function(req, res, next) {
  const { query: { key } } = req
  if (key) return res.json(await repoOperation.branchList(key))
  return res.json([])
})

router.get('/commitList', async function(req, res, next) {
  const { query: { key, branch } } = req
  if (key) {
    repoOperation.commitList(key, branch)
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

router.get('/deploy', function(req, res, next) {
  const { query: { key, br } } = req
  if (key) {
    const p = path.resolve(__dirname, config.repositories[key].path)
    repoOperation.deploy(key, br, p)
  }
  return res.json(emptyArrRes)
})

router.get('/getProgress', function(req, res, next) {
  res.json({
    code: 0,
    data: Object.values(config.repositories)
      .map((repo) => ({
        [repo.key]: repo.progress,
      }))
      .reduce((a, b) => ({
        ...a,
        ...b,
      }), {}),
  })
})

module.exports = router
