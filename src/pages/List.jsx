import React, { useEffect, useState } from 'react'
import { Button, Table, Tag } from 'antd'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { list } from '../scripts/api'

let history = { push() {} }
const status = tags => (
  <span>
    {tags.map((tag) => {
      let color = tag.length > 5 ? 'geekblue' : 'green'
      if (tag === 'loser') {
        color = 'volcano'
      }
      return (
        <Tag color={color} key={tag}>
          {tag.toUpperCase()}
        </Tag>
      )
    })}
  </span>
)

const action = (props) => {
  const deployClick = () => {
    history.push('./Deploy', {
      ...props,
    })
  }
  return (
    <span>
      <Button onClick={deployClick}>发布</Button>
    </span>
  )
}

const columns = [
  {
    title: '项目名称',
    dataIndex: 'projectName',
    key: 'projectName',
  },
  {
    title: '发布人',
    dataIndex: 'name',
    key: 'name',
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
    render: status,
  },
  {
    title: '操作',
    key: 'action',
    render: action,
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
