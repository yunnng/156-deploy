const chalk = require('chalk')

const repositoriesPath = [
  {
    key: '156-deploy',
    name: '156-deploy',
    path: '../../156/156-deploy',
  },
  {
    key: 'app_h5',
    name: 'app_h5',
    path: '../../156/app_h5',
  },
]
const m = new Map()
const keyRepeat = repositoriesPath.some((_) => {
  const { key } = _
  if (m.has(key)) {
    return true
  }
  m.set(key, 1)
  return false
})
if (keyRepeat) {
  console.log(chalk.red('repo key cat\'t repeat.'))
  process.exit(1)
}

module.exports = {
  repositoriesPath,
}
