import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Drawer, Button, Select, Icon, Tooltip } from 'antd'
import CityDemoPanel from './CityDemoPanel'
import GpsArPanel from './GpsArPanel'
// import { toJS } from 'mobx'
import {
  HomeOutlined  
} from '@ant-design/icons'

const { Option } = Select

const MainDrawer = ({ commonStore, history }) => {

  function handleChange(value) {
    commonStore.setCurrentMainDrawerPanel(value)
  }

  const DrawerHeader = () => {
    return (
      <div className="ant-drawer-title">
        <Tooltip title={'Home'}>
          <Button
            type="primary"
            icon={<HomeOutlined/>}
            size={commonStore.buttonSize}
            onClick={() => {
              commonStore.setShowMainDrawer(false)
              history.push('/')
            }}
          />
        </Tooltip>
        {/* <Tooltip title={'Portal ideas'}>
          <Button
            icon="bulb"
            size={commonStore.buttonSize}
            style={{
              marginLeft: 10,
              backgroundColor: '#faad14',
              color: 'white',
              border: '1px solid transparent',
            }}
            onClick={() => {
              window.open('https://openbimtool.ideas.aha.io/', '_blank')
              window.focus()
            }}
          />
        </Tooltip> */}
        <Select
          size={commonStore.buttonSize}
          defaultValue={commonStore.currentMainDrawerPanel}
          style={{ marginLeft: 10, width: 180 }}
          onChange={handleChange}>
          <Option value="cityDemo">City Demo</Option>
          <Option value="gpsDemo">Mobile GPS/AR Demo</Option>
          <Option value="toolDemo">Other Tools</Option>
        </Select>
      </div>
    )
  }

  const onClickLink = () => {
    commonStore.setShowMainDrawer(false)
  }

  const SelectedPanel = ({ currentPanel }) => {
    switch (currentPanel) {
      case 'cityDemo':
        return <CityDemoPanel/>
      case 'gpsDemo':
        return <GpsArPanel/>
      default:
        return ''
    }
  }

  return (
    <React.Fragment>
      <Drawer
        id="mainDrawer"
        title={<DrawerHeader/>}
        placement="left"
        closable={true}
        onClose={onClickLink}
        visible={commonStore.showMainDrawer}
        width={361}>
          abc
        {/* <SelectedPanel currentPanel={commonStore.currentMainDrawerPanel}/> */}
      </Drawer>
    </React.Fragment>
  )
}

export default withRouter(inject('commonStore')(observer(MainDrawer)))
