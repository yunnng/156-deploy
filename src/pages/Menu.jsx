import React, { useState } from 'react'
import { Menu } from 'antd'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types' // eslint-disable import/no-extraneous-dependencies
import styled from 'styled-components'

const { Item } = Menu

const MenuStyle = styled(Menu)`
    width: 256px;
    height: 100%;
`

function Menus(props) {
  const [current, setCurrent] = useState('list')

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
