import React, { useEffect, useState } from 'react'
import { Input, Modal } from 'antd'
import { UserOutlined } from '@ant-design/icons'

function SayHello() {
  const [name, setName] = useState('')
  const [deployer, setDeployer] = useState('')

  useEffect(() => {
    const { deployer: d } = localStorage
    if (d) {
      setDeployer(d)
    }
  }, [])

  const change = ({ target: { value } }) => {
    setName(value)
  }

  const ok = () => {
    if (name) {
      setDeployer(name)
      localStorage.deployer = name
    }
  }

  const handleEnter = ({ keyCode }) => {
    if (keyCode === 13) {
      ok()
    }
  }
  return (
    <>
      {!deployer && (
        <Modal
          title='用户名'
          visible={!deployer}
          onOk={ok}
        >
          <Input
            autoFocus
            size='large'
            prefix={<UserOutlined />}
            onChange={change}
            onKeyUp={handleEnter}
          />
        </Modal>
      )}
    </>
  )
}

export default SayHello
