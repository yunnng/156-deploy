import axios from 'axios'

export async function list() {
  return axios.get('./api/list')
    .then(({ data = [] }) => (data || []).map((item) => {
      const temp = item
      temp.projectName = item.name
      delete temp.name
      return {
        ...temp,
        status: [],
      }
    }))
}

export async function getBranchList(key) {
  return axios.get('./api/branchList', {
    params: {
      key,
    },
  })
    .then(({ data = [] }) => data)
}
