import React, { useEffect, useState } from 'react'
import {
  Button, Col, Form, Input, Progress, Row, Select,
} from 'antd'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  getBranchList, getCommitList, deploy,
} from '../scripts/api'
import { wsRouter } from '../common/util'

const { Option } = Select

const FormStyle = styled(Form)`
  max-width: 800px;
  margin: 60px 100px;
  width: 100%;
  
  .stdout {
    padding: 30px;
    border-radius: 4px;
    border: 1px solid #dedede;
    background-color: #f8f8f8;
  }
`

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
}
let progressTimer = null
const statusMap = {
  0: 'active',
  1: 'success',
  2: 'exception',
}
function Deploy(props) {
  const { history } = props
  const { location: { state: { key, projectName } = {} } } = history
  const [branch, setBranch] = useState('')
  const [commit, setCommit] = useState('')
  const [branchList, setBranchList] = useState([])
  const [commitList, setCommitList] = useState([])
  const [status, setStatus] = useState(-1)
  const [progress, setProgress] = useState(100)
  const [stdout, setStdout] = useState('')
  const [deployTime, setDeployTime] = useState(300 * 1000)

  const wsInit = () => {
    const ws = new WebSocket('ws:localhost:9001')
    ws.onopen = () => {
      console.log('open')
    }
    ws.onmessage = ({ data = '' }) => {
      const { path, d } = JSON.parse(data)
      if (path === wsRouter.open) {
        setStatus(d[key].status)
        setDeployTime(d[key].deployTime)
      } else if (path === wsRouter.deployResult) {
        if (d.key === key) {
          setStatus(d.status)
          setStdout(d.msg)
          clearTimeout(progressTimer)
        }
      }
    }
  }
  useEffect(() => {
    if (!key || !projectName) history.push('/list')
    wsInit()
    const timer = setInterval(() => {
      // getProgress()
      //   .then((data) => {
      //     console.log(data)
      //     setProgress(data[key])
      //   })
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

  const progressing = (time, p) => {
    const fps = 60 // 更新率
    const times = time / fps
    const preProgress = 100 / times
    const timer = setTimeout(() => {
      if (p < 99) {
        const nextP = p + preProgress
        console.log(nextP, +(nextP).toFixed(1))
        setProgress(+(nextP).toFixed(1))
        progressTimer = progressing(time - 100, nextP)
      } else clearInterval(timer)
    }, fps)
    return timer
  }

  const deployBtnClick = () => {
    deploy(key, formatBr(branch))
      .then(({ start, deployTime: d, status: s }) => {
        setStatus(s)
        setProgress(0)
        const timer = progressing(deployTime, 0)
        const leftTime = d - Date.now() + start
        clearTimeout(timer)
        progressing(leftTime, Math.round(1 - leftTime / deployTime))
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
        <Row>
          <Col span={6}>
            <Button
              type='primary'
              htmlType='submit'
              onClick={deployBtnClick}
              disabled={!commit}
              loading={!status}
            >{status ? '发布' : '发布中'}
            </Button>
          </Col>
          <Col span={18} style={{ textAlign: 'right' }}>
            {Boolean(statusMap[status]) && (
              <Progress percent={progress} status={statusMap[status]} width={80} />
            )}
          </Col>
        </Row>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 4 }}>
        {/* eslint-disable react/no-danger */}
        {stdout && (
          <div className='stdout' dangerouslySetInnerHTML={{ __html: stdout }} />
        )}
        {/* eslint-enable react/no-danger */}
      </Form.Item>
    </FormStyle>
  )
}

Deploy.propTypes = {
  history: PropTypes.object.isRequired,
}

export default withRouter(Deploy)
