const git = require('simple-git/promise')
const config = require('../config')

const repos = {}
config.repositories.forEach(async({ key, path }) => {
  const pathToRepo = require('path').resolve(__dirname, path)
  repos[key] = await git(pathToRepo)
  repos[key].branch()
    .then(res => {
      console.log(res)
    })
})
