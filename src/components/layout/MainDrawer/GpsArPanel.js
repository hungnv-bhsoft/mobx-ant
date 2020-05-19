import React from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import { Card, Divider } from 'antd'
import { DemoCard } from "./CustomStyled";
const { Meta } = Card


const GpsArPanel = ({ commonStore,history }) => {
    return (
        <>
            <DemoCard
                id="gps"
                hoverable
                cover={<img alt="GPS Tracking" src="/gps-tracking.jpg" />}
                onClick={() => {
                    commonStore.setShowMainDrawer(false)
                    var win = window.open('https://obt.bhsoft.yeu3d.com/gps', '_blank');
                    win.focus();
                    // history.push('/gps')
                }}
            >
                <Meta
                    title="Cesium & GPS Tracking"
                    description="https://www.xd-visuals.fi/"
                />
            </DemoCard>
            <Divider />
            <DemoCard
                id="webar"
                hoverable
                cover={<img alt="Helsinki Demo" src="/webar.jpg" />}
                onClick={() => {
                    commonStore.setShowMainDrawer(false)
                    history.push('/projects')
                }}
            >
                <Meta
                    title="WebAR Demo"
                    description="https://www.xd-visuals.fi/"
                />
            </DemoCard>
        </>
    )

}

export default withRouter(inject('commonStore')(observer(GpsArPanel)))