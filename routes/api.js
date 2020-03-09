const express = require('express')
const config = require('../config')
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
  if (key) return res.json(await repoOperation.commitList(key, branch))
  return res.json([])
})

module.exports = router
