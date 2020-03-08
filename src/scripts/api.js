import axios from 'axios'

export async function list() {
  return axios.get('./api/list')
    .then(({ data = [] }) => (data || []).map((item, index) => {
      const temp = item
      temp.projectName = item.name
      delete temp.name
      return {
        ...temp,
        key: index,
        status: [],
      }
    }))
}

export async function getBranchList() {
  return axios.get('./api/branchList')
    .then(({ data = [] }) => data)
}
