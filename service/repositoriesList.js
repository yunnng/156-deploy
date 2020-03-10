// import git from 'nodegit'
const git = require('nodegit')
const config = require('../config')

const { Branch, Reference, CheckoutOptions } = git

// const getMostRecentCommit = (repository) => repository.getBranchCommit('act-v2.5-collocation-list')
const getMostRecentCommit = (repository) => repository.getBranchCommit('master')

const getCommitMessage = (commit) => commit.message()

config.repositoriesPath.forEach(async({ path }) => {
  const pathToRepo = require('path').resolve(__dirname, path)
  const repo = await git.Repository.open(pathToRepo)
  // console.log(repo)

  // branch list
  // repo.getReferenceNames(3)
  //   .then((list) => {
  //     console.log(list)
  //     return list
  //   })

  // checkout branch
  // repo.getBranch('refs/remotes/origin/act-flash-sale')
  //   .then((reference) => {
  //     // checkout branch
  //     const options = new CheckoutOptions()
  //     return repo.checkoutRef(reference)
  //     // return repo.checkoutBranch('act-flash-sale', options) // 仅本地已存在的分支
  //   })

  // repo.getBranchCommit('master')
  //   .then((commit) => {
  //     // for (let a in commit) {
  //     //   if (typeof commit[a] === 'function')
  //     //   console.log(commit[a]())
  //     // }
  //     console.log(`${commit.sha().substr(0, 8)} [${commit.date().toLocaleString()}] ${commit.author().name()} - ${commit.message().trim()}`)
  //   })

  // commit list
  // const walker = git.Revwalk.create(repo)
  // // 通过pushGlob来获取所有分支的提交记录
  // walker.pushGlob('*')
  // // 获取符合日期的commits
  // const commits = await walker.getCommitsUntil(() => true)
  // commits.forEach(commit => console.log(`${commit.sha().substr(0, 8)} [${commit.date().toLocaleString()}] ${commit.author().name()} - ${commit.message().trim()}`))


  repo.fetchAll({
    callbacks(url, userName) {
      return git.Cred.sshKeyFromAgent(userName)
    },
    pruneAfter: true,
  }, (a) => {
    console.log(a)
    return a
  }).then(() => repo.mergeBranches('master', 'refs/remotes/origin/master'))
    .then(() => {}, (a) => {
      console.log(a)
    })
  // repo.getBranch('refs/remotes/origin/master')
  //   .then((ref) => {
  //     Branch.name(ref).then((string) => {
  //       // Use string
  //       console.log(string)
  //       return repo.fetch(string)
  //     })
  //       .then((a) => {
  //         console.log(a)
  //       }, (b) => {
  //         console.log(b)
  //       })
  //   })
  // repo.mergeBranches('master', 'origin/master') // 仅本地已存在的分支
  // repo.getBranch('refs/remotes/origin/master')
  //   .then((ref) => {
  //     for (var a in ref.repo) {
  //       console.log(a)
  //     }
  //     // console.log(ref.isBranch())
  //     return repo.fetch(ref)
  //   }).then((msg) => {
  //   console.log(msg)
  // }, (msg) => {
  //   console.log(msg)
  // })
  // console.log(commits)
  // repo.then(getMostRecentCommit(repo))
  //   .then(getCommitMessage)
  //   .then((message) => {
  //     console.log(message)
  //   })
})
