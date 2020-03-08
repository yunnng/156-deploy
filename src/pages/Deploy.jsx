import React, { useEffect, useState } from 'react'
import {
  Button, Form, Input, Select,
} from 'antd'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import PropTypes from 'prop-types'
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
  const { location: { state: { key, projectName } = {} } } = history
  const [branchList, setBranchList] = useState([])
  const [branch, setBranch] = useState('')
  useEffect(() => {
    if (!key || !projectName) return history.push('/list')
    return getBranchList(key)
      .then((res) => {
        setBranchList(res)
        const master = 'refs/remotes/origin/master'
        if (res.includes(master)) {
          setBranch(master)
        }
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
          showSearch
          placeholder='选择发布分支'
          optionFilterProp='children'
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
