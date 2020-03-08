import React, { useEffect, useState } from 'react'
import {
  Button, Form, Input, Select,
} from 'antd'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import PropTypes from 'prop-types' // eslint-disable import/no-extraneous-dependencies
import { getBranchList } from '../scripts/api'

const { Option } = Select

const FormStyle = styled(Form)`
  width: 600px;
  margin: 60px 100px;
`

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}
function Deploy(props) {
  const { history } = props
  const { location: { state: { projectName } = {} } } = history
  const [branchList, setBranchList] = useState([])
  const [branch, setBranch] = useState('')
  useEffect(() => {
    if (!projectName) history.push('/list')
    getBranchList()
      .then((res) => {
        setBranchList(res)
      })
  }, [])
  const branchSelect = (v) => {
    setBranch(v)
  }

  return (
    <FormStyle {...layout} name='control-hooks'>
      <Form.Item
        name='ProjectName'
        label='项目名称'
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input disabled value={projectName} />
      </Form.Item>
      <Form.Item
        name='branch'
        label='分支选取'
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder='选择发布分支'
          onChange={branchSelect}
          value={branch}
          allowClear
        >
          {branchList.map(_ => (
            <Option key={_} value={_}>{_.replace('refs/remotes/origin/', '')}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type='primary' htmlType='submit'>
          发布
        </Button>
      </Form.Item>
    </FormStyle>
  )
}

Deploy.propTypes = {
  history: PropTypes.object.isRequired,
}

export default withRouter(Deploy)
