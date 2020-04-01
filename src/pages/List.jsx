import React, { useEffect, useState } from 'react'
import { Button, Table, Tag } from 'antd'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { list } from '../scripts/api'

let history = { push() {} }

const statusList = {
  '-1': { color: '', name: '尚未发布' }, // default
  0: { color: 'green', name: '发布成功' }, // success
  1: { color: '#2db7f5', name: '发布中' },
  2: { color: 'red', name: '发布失败' },
  3: { color: 'orange', name: '需要安装依赖' },
  4: { color: '#2db7f5', name: '安装依赖中' },
  5: { color: 'green', name: '安装依赖完成', desc: '仅前端使用' },
  6: { color: 'volcano', name: '安装依赖失败', desc: '仅前端使用' }, // error
}

const columns = [
  {
    title: '项目名称',
    dataIndex: 'projectName',
    key: 'projectName',
  },
  {
    title: '发布人',
    dataIndex: 'deployer',
    key: 'deployer',
  },
  {
    title: '发布版本',
    dataIndex: 'version',
    key: 'version',
  },
  {
    title: '发布说明',
    key: 'desc',
    dataIndex: 'desc',
  },
  {
    title: '发布状态',
    key: 'status',
    dataIndex: 'status',
    render: status => (
      <Tag color={statusList[status].color}>{statusList[status].name}</Tag>
    ),
  },
  {
    title: '操作',
    key: 'action',
    render: (props) => {
      const deployClick = () => {
        history.push('./Deploy', {
          ...props,
        })
      }
      return (
        <Button type='link' onClick={deployClick}>发布</Button>
      )
    },
  },
]

const ListCss = styled.div`
  flex: 1;
  padding: 16px;
`
function List(props) {
  const [data, setData] = useState([])
  const { history: h } = props
  history = h
  useEffect(() => {
    list()
      .then((res) => {
        setData(res)
      })
  }, [])
  return (
    <ListCss>
      <Table columns={columns} dataSource={data} />
    </ListCss>
  )
}

List.propTypes = {
  history: PropTypes.object.isRequired,
}

export default withRouter(List)
