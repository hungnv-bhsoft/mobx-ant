import React from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import { Card, Divider } from 'antd'
import { DemoCard } from './CustomStyled'
const { Meta } = Card

const CityDemoPanel = ({ commonStore, history }) => {
  return (
    <>
      <DemoCard
        id="demo2"
        hoverable
        cover={<img alt="Helsinki Demo" src="/helsinki.jpg" />}
        onClick={() => {
          commonStore.setShowMainDrawer(false)
          history.push('/helsinki')
        }}>
        <Meta title="Helsinki Demo" description="https://www.xd-visuals.fi/" />
      </DemoCard>
      <Divider />
      <DemoCard
        id="demo1"
        hoverable
        cover={<img alt="Tampere Demo" src="/tempere.jpg" />}
        onClick={() => {
          commonStore.setShowMainDrawer(false)
          history.push('/tampere')
        }}>
        <Meta title="Tampere Demo" description="https://www.xd-visuals.fi/" />
      </DemoCard>
    </>
  )
}

export default withRouter(inject('commonStore')(observer(CityDemoPanel)))
