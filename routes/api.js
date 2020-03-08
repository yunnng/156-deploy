const express = require('express')
const config = require('../config')
const repoOperation = require('../service/repositoriesOperation')
const router = express.Router()

router.get('/list', function(req, res, next) {
  res.json(config.repositoriesPath)
})

router.get('/branchList', async function(req, res, next) {
  await res.json(await repoOperation.branchList())
})

module.exports = router
