// const chalk = require('chalk')
const path = require('path')

const relativePath = '../'
const absolutePath = p => path.resolve(__dirname, relativePath, p)
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
  'activity-admin': {
    key: 'activity-admin',
    name: 'activity-admin',
    path: absolutePath('activity-admin'),
    deployTime: 300 * 1000,
    cmdList: ['npm run build:test'],
  },
  pc1: {
    key: 'pc1',
    name: 'pc1',
    path: absolutePath('pc1'),
    deployTime: 300 * 1000,
    cmdList: ['npm run build', 'pm2 restart pc1'],
  },
  pc2: {
    key: 'pc2',
    name: 'pc2',
    path: absolutePath('pc2'),
    deployTime: 300 * 1000,
    cmdList: ['npm run build', 'pm2 restart pc2'],
  },
  pc3: {
    key: 'pc3',
    name: 'pc3',
    path: absolutePath('pc3'),
    deployTime: 300 * 1000,
    cmdList: ['npm run build', 'pm2 restart pc3'],
  },
  app_h5: {
    key: 'app_h5',
    name: 'app_h5',
    path: absolutePath('app_h5'),
    deployTime: 300 * 1000,
    cmdList: ['gulp', 'npm run build', 'pm2 restart app_h5'],
  },
  app_h5_2: {
    key: 'app_h5_2',
    name: 'app_h5_2',
    path: absolutePath('app_h5_2'),
    deployTime: 300 * 1000,
    cmdList: ['gulp', 'npm run build', 'pm2 restart app_h5_2'],
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
