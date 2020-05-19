import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { Helmet } from 'react-helmet'
import DefaultTemplate from '../../layout/DefaultTemplate'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import './style.less'
// import { assetUrl, corsproxy } from '../../../config'
import { notification, Button, InputNumber, Icon } from 'antd'
// import uuid from 'uuid'
// import Gps from '../../helper/Gps'
// import { createImageFileFromBase64 } from '../../helper/CesiumUtils'
import Webcam from 'react-webcam'
import { Viewer, Cesium3DTileset, SkyAtmosphere, SkyBox } from 'resium'
import { Matrix4, Cartesian3, Color, Math as CesiumMath } from 'cesium'

const DemoPage = props => {
  const { commonStore, demoStore, gpsStore } = props

  const viewerRef = useRef(null)
  const [tileViews, setTileViews] = useState([])

  const onTileLoad = tile => {}

  useEffect(() => {
    window.scrollTo(0, 0)
    commonStore.setCurrentPage('demo')
    return () => {}
  }, [])

  const defaultContextOption = useMemo(() => {
    var context = {
      webgl: {
        alpha: true,
      },
    }
    return context
  }, [])

  useEffect(() => {
    if (!demoStore.cameraData) return
    if (!viewerRef.current) return
    if (!viewerRef.current.cesiumElement) return
    let cam = demoStore.cameraData
    let flyOption = {
      duration: cam.duration !== 'undefined' ? cam.duration : 1,
    }
    if (cam.position) {
      let destination = new Cartesian3(
        cam.position.x,
        cam.position.y,
        cam.position.z
      )
      flyOption.destination = destination
    }

    if (cam.direction) {
      let direction = new Cartesian3(
        cam.direction.x,
        cam.direction.y,
        cam.direction.z
      )
      let up = new Cartesian3(cam.up.x, cam.up.y, cam.up.z)
      flyOption.orientation = {
        direction,
        up
      }
    }
    viewerRef.current.cesiumElement.camera.flyTo(flyOption)
    demoStore.setCameraData(false)
  }, [demoStore.cameraData])

  return (
    <DefaultTemplate>
      <Helmet title="XD POC Demo" />
      <React.Fragment>
        <Viewer
          full
          timeline={false}
          homeButton={false}
          navigationInstructionsInitiallyVisible={false}
          navigationHelpButton={false}
          selectionIndicator={false}
          infoBox={false}
          contextOptions={defaultContextOption}
          // terrainProvider={terrainProvider}
          // style={{ height: 'calc(100vh)' }}
          ref={viewerRef}>
          <SkyBox
            show={
              gpsStore.gpsMode.indexOf('first_person') === -1 ||
              gpsStore.skyColor === 'cesium'
            }
          />
          <SkyAtmosphere
            show={
              gpsStore.gpsMode.indexOf('first_person') === -1 ||
              gpsStore.skyColor === 'cesium'
            }
          />
          {tileViews.map(tile => tile)}
        </Viewer>
      </React.Fragment>
    </DefaultTemplate>
  )
}

export default inject(
  'commonStore',
  'demoStore',
  'gpsStore'
)(observer(DemoPage))
