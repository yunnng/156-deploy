
module.exports = {
  wsRouter: {
    open: '/open',
    deployResult: '/deploy/result',
  },
  getUser() {
    const { deployer = '' } = localStorage
    return deployer
  },
}
