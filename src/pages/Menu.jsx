import React, { useEffect, useState } from 'react'
import { Button, Menu } from 'antd'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { getUser } from '../common/util'

const { Item } = Menu

const MenuStyle = styled(Menu)`
    width: 256px;
    height: 100%;
`

function Menus(props) {
  const [current, setCurrent] = useState('list')
  const [user, setUser] = useState('')

  useEffect(() => {
    setUser(getUser())
  }, [])

  const handleClick = (e) => {
    const { history } = props
    setCurrent(e.key)
    history.push(e.key)
  }

  return (
    <MenuStyle
      onClick={handleClick}
      selectedKeys={[current]}
      mode='inline'
    >
      <Item disabled>
        用户：{user || (
        <Button type='link' onClick={() => setUser(getUser())}>刷新</Button>
      )}
      </Item>
      <Item key='list'>
        可发布项目
      </Item>
      <Item key='query'>
        发布任务查询
      </Item>
    </MenuStyle>
  )
}

Menus.propTypes = {
  history: PropTypes.object.isRequired,
}

export default withRouter(Menus)
