// const chalk = require('chalk')

const repositories = {
  // '156-deploy': {
  //   key: '156-deploy', // 两个key需完全一致
  //   name: '156-deploy',
  //   path: '../../156-deploy',
  //   deployTime: 300 * 1000,
  // },
  // app_h5: {
  //   key: 'app_h5',
  //   name: 'app_h5',
  //   path: '../../app_h5',
  //   deployTime: 300 * 1000,
  // },
  pc1: {
    key: 'pc1',
    name: 'pc1',
    path: 'pc1',
    deployTime: 300 * 1000,
  },
  // 'pc-2': {
  //   key: 'pc-2',
  //   name: 'pc-2',
  //   path: '../../pc-2',
  //   deployTime: 300 * 1000,
  // },
  app_h5: {
    key: 'app_h5',
    name: 'app_h5',
    path: 'app_h5',
    deployTime: 300 * 1000,
  },
  app_h5_2: {
    key: 'app_h5_2',
    name: 'app_h5_2',
    path: 'app_h5_2',
    deployTime: 300 * 1000,
  },
}
// const m = new Map()
// const keyRepeat = repositories.some((_) => {
//   const { key } = _
//   if (m.has(key)) {
//     return true
//   }
//   m.set(key, 1)
//   return false
// })
// if (keyRepeat) {
//   console.log(chalk.red('repo key cat\'t repeat.'))
//   process.exit(1)
// }

module.exports = {
  repositories,
}
