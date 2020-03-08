import React, { useEffect, useState } from 'react'
import { Button, Table, Tag } from 'antd'
import styled from 'styled-components'
import PropTypes from 'prop-types' // eslint-disable import/no-extraneous-dependencies
import { withRouter } from 'react-router-dom'
import { list } from '../scripts/api' // eslint-disable

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
  const { history, projectName } = props
  const deployClick = () => {
    history.push('./Deploy', {
      projectName,
    })
  }
  return (
    <span>
      <Button onClick={deployClick}>发布</Button>
    </span>
  )
}

action.propTypes = {
  history: PropTypes.object.isRequired,
  projectName: PropTypes.string.isRequired,
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
    render: withRouter(action),
  },
]

const ListCss = styled.div`
  flex: 1;
  padding: 16px;
`
function List() {
  const [data, setData] = useState([])
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

export default List
