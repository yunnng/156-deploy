import React, { useEffect, useState } from 'react'
import {
  Button, Col, Form, Input, Row, Select, Typography,
} from 'antd'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import PropTypes from 'prop-types'
// eslint-disable
import {
  getBranchList, getCommitList, deploy, installDep,
} from '../scripts/api'
// eslint-enable
import { wsRouter, getUser } from '../common/util'

const { Option } = Select
const { Title } = Typography

const FormStyle = styled(Form)`
  max-width: 700px;
  margin: 60px 100px;
  width: 100%;
  
  .progress-item {
    > span {
      min-width: 110px;
      display: inline-block;
      
      &.progress {
        text-align: left;
      }
    }
  }
  .stdout {
    padding: 30px;
    height: 600px;
    border-radius: 4px;
    border: 1px solid #dedede;
    background-color: #f8f8f8;
    overflow-y: auto;
  }
`

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}
const tailLayout = {
  wrapperCol: { offset: 3 },
}
let progressTimer = null
function Deploy(props) {
  const { history } = props
  const { location: { state: { key, projectName } = {} } } = history
  const [deployer, setDeployer] = useState('')
  const [branch, setBranch] = useState('')
  const [commit, setCommit] = useState('')
  const [branchList, setBranchList] = useState([])
  const [commitList, setCommitList] = useState([])
  const [status, setStatus] = useState(-1)
  const [spentTime, setSpentTime] = useState(0)
  const [progress, setProgress] = useState(100)
  const [stdout, setStdout] = useState('')
  const [deployTime, setDeployTime] = useState(300 * 1000)

  /**
   * @time 剩余时间（毫秒）
   * @p 当前进度（小于1）
   * @spend 已用时间
   */
  const progressing = (time, p, spent = 0, dTime = deployTime) => {
    const fps = 60 // 更新率 ms
    const timer = setTimeout(() => {
      setSpentTime(spent + fps)
      const nextP = (spent + fps) / dTime
      if (nextP < 1) {
        setProgress(+(nextP * 100).toFixed(1)) // 转百分制
        progressTimer = progressing(time - fps, nextP, spent + fps)
      } else clearInterval(timer)
    }, fps)
    return timer
  }

  const wsInit = () => {
    const ws = new WebSocket(`ws:${window.location.hostname}:9001`)
    ws.onmessage = ({ data = '' }) => {
      const { path, d } = JSON.parse(data)
      if (path === wsRouter.open) {
        setStatus(d[key].status)
        setDeployTime(d[key].deployTime)
        if (d[key].status === 1) {
          const now = Date.now()
          const { startTime, deployTime: dTime } = d[key]
          const leftTime = dTime - now + startTime
          progressing(leftTime, Math.round(1 - leftTime / dTime), now - startTime,
            d[key].deployTime)
        }
      } else if (path === wsRouter.deployResult) {
        if (d.key === key) {
          setStatus(d.status)
          setStdout(d.msg || '')
          clearTimeout(progressTimer)
          if (d.status === 0) {
            setProgress(100)
          }
        }
      }
    }
  }
  useEffect(() => {
    const d = getUser()
    setDeployer(d)
    if (!d || !key || !projectName) history.push('/list')
    setDeployer(getUser())
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
    deploy({
      key,
      br: formatBr(branch),
      commit,
      deployer,
    })
      .then(({ start, deployTime: d, status: s }) => {
        setStatus(s)
        setProgress(0)
        // const timer = progressing(deployTime, 0)
        const leftTime = d - Date.now() + start
        // clearTimeout(timer)
        progressing(leftTime, Math.round(1 - leftTime / deployTime))
      })
  }

  const depBtnClick = () => {
    installDep(key)
      .then(({ status: s }) => {
        setStatus(s)
      })
  }

  const formatCommitList = (_) => {
    const date = new Date(_.date)
    const d = date.toLocaleDateString()
    const h = date.getHours()
    const m = date.getMinutes()
    return `${_.hash.substr(0, 8)} [${d} ${h}:${m}] ${_.author_name} - ${_.message.trim().substr(0, 100)}`
  }

  const formatTime = (millisecond) => {
    const f = n => (n > 9 ? n : `0${n}`)
    const m = Math.floor(millisecond / 1000 / 60)
    const s = Math.round(millisecond / 1000 - m * 60)
    return `${f(m)}:${f(s)}`
  }

  const installDepStatus = s => [3, 4].includes(s)

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
          <Col span={5}>
            <Button
              type='primary'
              htmlType='submit'
              onClick={deployBtnClick}
              disabled={!commit || installDepStatus(status)}
              loading={status === 1}
            >发布
            </Button>
          </Col>
          <Col className='progress-item' span={15}>
            {[0, 1, 2].includes(status) && (
              <>
                <span className='progress'>进度：{progress}%</span>
                <span className='spent-time'>已用时：{formatTime(spentTime)}</span>
                <span className='expected-time'>预计用时：{formatTime(deployTime)}</span>
              </>
            )}
          </Col>
          {stdout.includes('Cannot find module') && (
            <Col span={4} style={{ textAlign: 'right' }}>
              <Button
                onClick={depBtnClick}
                loading={status === 4}
              >安装依赖
              </Button>
            </Col>
          )}
        </Row>
      </Form.Item>
      {status === 0 && (
        <Form.Item wrapperCol={{ offset: 1 }}>
          <Title level={3}>发布成功</Title>
        </Form.Item>
      )}
      <Form.Item wrapperCol={{ offset: 1 }}>
        {/* eslint-disable react/no-danger */}
        {stdout && (
          <pre className='stdout' dangerouslySetInnerHTML={{ __html: stdout }} />
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
