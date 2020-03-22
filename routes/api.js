const path = require('path')
const express = require('express')
const WebSocket = require('ws')
const { repositories } = require('../config')
const { emptyArrRes, updateRepoStatus, wsSend } = require('./../service/util')
const repoOperation = require('../service/repositoriesOperation')
const { wsRouter } = require('../src/common/util')
const router = express.Router()

const wss = new WebSocket.Server({ port: 9001 })

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message)
  })

  wsSend(ws, wsRouter.open, repoOperation.progressMap())
})

router.get('/list', function(req, res, next) {
  res.json({
    code: 0,
      data: Object.values(repositories),
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
  const { query: { key, br, commit, deployer } } = req
  const start = Date.now()
  const repository = repositories[key]
  const p = path.resolve(__dirname, repository.path)
  if (key) {
    repoOperation.deploy({
      key,
      br,
      commit,
      deployer,
      p,
      start,
    })
      .then((data) => {
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            wsSend(client, wsRouter.deployResult, {
              key,
              ...data,
            })
          }
        })
      })
  }
  updateRepoStatus(repository, { status: 1 })
  return res.json({
    code: 0,
    data: {
      status: 1,
      start,
      deployTime: repository.deployTime,
    },
  })
})

router.get('/installDependencies', function(req, res, next) {
  const { query: { key, br } } = req
  const start = Date.now()
  const repository = repositories[key]
  const p = path.resolve(__dirname, repository.path)
  if (key) {
    repoOperation.installDependencies(key, br, p, start)
      .then((data) => {
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            wsSend(client, wsRouter.deployResult, {
              key,
              ...data,
            })
          }
        })
      })
  }
  updateRepoStatus(repository, { status: 4 })
  return res.json({
    code: 0,
    data: {
      status: 4,
    },
  })
})

router.get('/getProgress', function(req, res, next) {
  res.json({
    code: 0,
    data: Object.values(repositories)
      .map((repository) => ({
        [repository.key]: repository.progress,
      }))
      .reduce((a, b) => ({
        ...a,
        ...b,
      }), {}),
  })
})

router.get('/statusData', function(req, res, next) {
  res.json({
    code: 0,
    data: repositories,
  })
})

module.exports = router
