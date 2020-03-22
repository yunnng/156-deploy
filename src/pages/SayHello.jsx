import React, { useEffect, useState } from 'react'
import { Input, Modal } from 'antd'
import { UserOutlined } from '@ant-design/icons' // eslint-disable import/no-extraneous-dependencies

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
  return (
    <>
      {!deployer && (
        <Modal
          title='用户名'
          visible={!deployer}
          onOk={ok}
        >
          <Input
            size='large'
            prefix={<UserOutlined />}
            onChange={change}
          />
        </Modal>
      )}
    </>
  )
}

export default SayHello
