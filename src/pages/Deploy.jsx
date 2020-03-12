import React, { useEffect, useState } from 'react'
import {
  Button, Form, Input, Select, Progress,
} from 'antd'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  getBranchList, getCommitList, deploy, getProgress,
} from '../scripts/api'

const { Option } = Select

const FormStyle = styled(Form)`
  max-width: 800px;
  margin: 60px 100px;
  width: 100%;
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
  const [branch, setBranch] = useState('')
  const [commit, setCommit] = useState('')
  const [branchList, setBranchList] = useState([])
  const [commitList, setCommitList] = useState([])
  const [progress, setProgress] = useState(100)
  useEffect(() => {
    if (!key || !projectName) history.push('/list')
    const timer = setInterval(() => {
      getProgress()
        .then((data) => {
          console.log(data)
          setProgress(data[key])
        })
    }, 1000)
    getBranchList(key)
      .then(async(res) => {
        setBranchList(res)
        const master = 'origin/master'
        if (res.includes(master)) {
          setBranch(master)
        }
        return master || ''
      })
    return () => {
      console.log(123)
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    if (branch) {
      getCommitList(key, branch)
        .then((data) => {
          setCommitList(data)
          if (data.length) {
            setCommit(data[0].hash)
          } else {
            setCommit('')
          }
        })
    }
  }, [branch])

  const branchSelect = (v) => {
    setCommit('')
    setCommitList([])
    setBranch(v)
  }

  const commitSelect = (v) => {
    setCommit(v)
  }

  const formatBr = br => br.replace('origin/', '')

  const deployBtnClick = () => {
    setProgress(1)
    deploy(key, formatBr(branch))
      .then((a) => {
        console.log(a)
      })
  }

  const formatCommitList = (_) => {
    const date = new Date(_.date)
    const d = date.toLocaleDateString()
    const h = date.getHours()
    const m = date.getMinutes()
    return `${_.hash.substr(0, 8)} [${d} ${h}:${m}] ${_.author_name} - ${_.message.trim().substr(0, 100)}`
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
            <Option key={_} value={_}>{formatBr(_)}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name='commit'
        label='版本选取'
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          showSearch
          placeholder='选择发布版本'
          optionFilterProp='children'
          onChange={commitSelect}
          value={commit}
          allowClear
        >
          {commitList.map(_ => (
            <Option key={_.hash} value={_.hash}>{formatCommitList(_)}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item {...tailLayout}>
        {(progress === 0 || progress === 100) ? (
          <Button type='primary' htmlType='submit' onClick={deployBtnClick} disabled={!commit}>
            发布
          </Button>
        ) : (
          <Progress type='circle' percent={progress} width={80} />
        )}
      </Form.Item>
    </FormStyle>
  )
}

Deploy.propTypes = {
  history: PropTypes.object.isRequired,
}

export default withRouter(Deploy)
