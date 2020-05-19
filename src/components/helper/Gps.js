import React, { useEffect, useState, useRef } from 'react'
import { inject, observer } from 'mobx-react'
import { FULLTILT } from 'fulltilt-ng'
import {
  AbsoluteOrientationSensor,
  RelativeOrientationSensor
} from 'motion-sensors-polyfill';
import {
  Cartesian3,
  VerticalOrigin,
  PinBuilder,
  Color,
  Matrix4, Cartesian2,
  HeadingPitchRoll, CesiumTerrainProvider, Cartographic, Ellipsoid, Quaternion, createWorldTerrain,
  Math as CesiumMath,
  HeadingPitchRange, defined, sampleTerrainMostDetailed
} from 'cesium'
import { Entity } from 'resium'
import { createImageFileFromBase64 } from '../helper/CesiumUtils'
import { ProjectRequest } from '../../requests'
import { toJS } from 'mobx'

const Gps = props => {
  const {
    projectStore,
    capturesStore,
    viewer,
    webcamRef,
    projectid
  } = props

const [freezeCamera, setFreezeCamera] = useState(false)

  function getViewer() {
    return viewer.current.cesiumElement;
  }
  const [markerPos, setMarkerPos] = useState(null)
  const pinBuilder = new PinBuilder()
  const greenPin = {
    image: pinBuilder.fromColor(Color.GREEN, 32).toDataURL(),
    verticalOrigin: VerticalOrigin.BOTTOM,
  }

  let viewQuaternion, viewMatrix, viewEuler

  const pinRef = useRef(null)

  function getOrientation() {
    if (projectStore.obtDeviceSensor.start && !projectStore.obtDeviceSensor.activated) {
      projectStore.obtDeviceSensor.start()
    }
  }
  function getHeadingPitchRoll() {

    var b = projectStore.obtDeviceSensor.quaternion;
    if (b) {
      var q = new Quaternion(b[0], b[1], b[2], b[3]);
      return HeadingPitchRoll.fromQuaternion(q)
    }

  }

  //R.1: Converting window.obtDeviceOrientation angles to a Rotation Matrix representation

  //R.2: Fixing our rotation matrix frame relative to the current screen orientation

  //R.3: Fix our rotation matrix frame relative to our application’s world orientation (rotation around x-axis)

  //R.4: Computing our final rotation matrix representation

  //Returns a 3 x 3 rotation matrix as an array

  function cameraLookingAt() {
    if (!viewer.current.cesiumElement) return
    var camera = getViewer().camera;
    var canvas = getViewer().scene.canvas;
    var ray = camera.getPickRay(new Cartesian2(
      Math.round(canvas.clientWidth / 2),
      Math.round(canvas.clientHeight / 2)
    ));

    var position = getViewer().scene.globe.pick(ray, getViewer().scene);
    if (defined(position)) {
      var cartographic = Ellipsoid.WGS84.cartesianToCartographic(position);
      var height = cartographic.height;
      var range = Cartesian3.distance(position, camera.position);
      return {
        latitude: cartographic.latitude,
        longitude: cartographic.longitude,
        height: height,
        range: range
      }
      alert('Lat/Lon: [' +
        CesiumMath.toDegrees(cartographic.latitude).toFixed(2) + ',' +
        CesiumMath.toDegrees(cartographic.longitude).toFixed(2) + ']' +
        ' height: ' + height.toFixed(2) +
        ' range: ' + range.toFixed(2)
      );
    } else {
      console.log('Looking at space?');
    }
  }

  function updateGPSPosition(position) {
    var firstGPSTime = true;
    var firstCompassTime = false;

    // position.coords.longitude = parseFloat(position.coords.longitude)
    // position.coords.latitude = parseFloat(position.coords.latitude)
    // if (projectStore.obtDeviceSensor && projectStore.obtDeviceSensor.activated && projectStore.currentGpsState) {
    //   if (!projectStore.currentGpsState.firstCompassTime) {
    //     projectStore.setCurrentGpsState({ firstCompassTime: true });
    //     firstCompassTime = true
    //   }
    //   else {
    //     //projectStore.setCurrentGpsState({ firstCompassTime: false });
    //     firstCompassTime = false
    //   }

    // }

    if (projectStore.currentGPS.coords) {
      firstGPSTime = false
    }
    if (!position) {
      position = projectStore.currentGPS
    }
    else {
      projectStore.setCurrentGPS(position)
    }

    var pos = Cartesian3.fromDegrees(
      position.coords.longitude,
      position.coords.latitude
    )
    // var currentCameraLookAt = cameraLookingAt();
    var clamp = false
    //var f = getViewer().scene.clampToHeight(Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude, position.coords.altitude || 0), [], 0.1, new Cartesian3())
    obtSampleTerrain(position.coords.latitude, position.coords.longitude).then(function (f) {
      if (!viewer.current.cesiumElement) return
      if (f) { clamp = true }
      else {
        f = pos
      }
      var g = Cartographic.fromCartesian(f || pos, Ellipsoid.WGS84, new Cartographic())
      if (getViewer().camera) {
        if (projectStore.gpsMode === 'fix') {
          var hpr = getHeadingPitchRoll()
          if (!hpr) { return }
          let distance = Cartesian3.distance(getViewer().camera._positionWC, f)          
          getViewer().camera.lookAt(f, new HeadingPitchRange(hpr.heading, getViewer().camera.pitch, distance));
          getViewer().camera.lookAtTransform(Matrix4.IDENTITY);
          projectStore.setObtGPSOrientation({
            heading: hpr.heading,
            pitch: getViewer().camera.pitch,
            distance: distance,
            position: f
          })
        } else if (projectStore.gpsMode === 'first_person') {
          //var hpr = new HeadingPitchRoll(0, 0, 0);
          var hpr = getHeadingPitchRoll()
          if (!hpr) { return }
          //HeadingPitchRoll.fromQuaternion(viewQuaternion, hpr)
          getViewer().camera.setView({
            orientation: {
              heading: hpr.heading,
              pitch: hpr.roll - Math.PI / 2,
              roll: -hpr.pitch
            },
            destination: Cartesian3.fromDegrees(
              position.coords.longitude,
              position.coords.latitude,
              clamp && g.height > 0 ? g.height + 1 : 2
            ),
          })
        } else {
          let distance = Cartesian3.distance(getViewer().camera._positionWC, f)
          if (distance > 1500 && firstGPSTime) {
            getViewer().camera.setView({
              destination: Cartesian3.fromDegrees(
                position.coords.longitude,
                position.coords.latitude,
                clamp && g.height > 0 ? g.height + 100 : 100
              ),
            });

          } else {            
            getViewer().camera.lookAt(f, new HeadingPitchRange(getViewer().camera.heading, getViewer().camera.pitch, distance));
            getViewer().camera.lookAtTransform(Matrix4.IDENTITY);
          }
        }
      }
      setMarkerPos(
        f
      )
    })

  }

  const obtSampleTerrain = async (lat, lon) => {

    if (false && projectStore.WorldTerrain && projectStore.WorldTerrain.ready) {
      var positions = [
        Cartographic.fromDegrees(lon, lat),
      ];
      var updatedPositions = await sampleTerrainMostDetailed(projectStore.WorldTerrain, positions);
      if (!updatedPositions.length) {
        var f = getViewer().scene.clampToHeight(Cartesian3.fromDegrees(lon, lat), [], 0.1, new Cartesian3())
        return f
      }
      if (updatedPositions[0].height < 0) {
        updatedPositions[0].height = 0;
      }
      return Cartographic.toCartesian(updatedPositions[0], Ellipsoid.WGS84, new Cartesian3());
    }
    else {
      var f = getViewer().scene.clampToHeight(Cartesian3.fromDegrees(lon, lat), [], 0.1, new Cartesian3())
      return f
    }
  }
  function setBackgroundColor() {
    if (projectStore.gpsMode === 'first_person') {

      if (projectStore.skyColor === 'cesium' || projectStore.skyColor === 'none') {
        getViewer().scene.backgroundColor = new Color(0, 0, 0, 1)
      }
      if (projectStore.skyColor === 'white') {
        getViewer().scene.backgroundColor = Color.WHITE
      }
      if (projectStore.skyColor === 'camera') {
        getViewer().scene.backgroundColor = Color.TRANSPARENT
      }
    }
  }
  useEffect(() => {
    setBackgroundColor()
    return () => {
    }
  }, [projectStore.skyColor])

  useEffect(() => {
    getViewer().scene.screenSpaceCameraController.enableInputs = projectStore.gpsMode !== 'first_person';
    setBackgroundColor();
    if (projectStore.gpsMode !== 'none') {

      if (projectStore.gpsMode === 'fix' || projectStore.gpsMode === 'first_person') {
        getOrientation()
      }
      else {
        if (
          projectStore.obtDeviceSensor &&
          projectStore.obtDeviceSensor.stop
        )
          projectStore.obtDeviceSensor.stop()
      }
      // geoFindMe(true)
    } else {
      projectStore.setCurrentGPS({});
      if (projectStore.obtGPSOrientation.position && !freezeCamera) {
       if (projectStore.obtGPSOrientation.distance) getViewer().camera.lookAt(projectStore.obtGPSOrientation.position, new HeadingPitchRange(projectStore.obtGPSOrientation.heading, projectStore.obtGPSOrientation.pitch, projectStore.obtGPSOrientation.distance));
        getViewer().camera.lookAtTransform(Matrix4.IDENTITY);
      }
      projectStore.setObtGPSOrientation({});
      if (
        projectStore.obtDeviceSensor &&
        projectStore.obtDeviceSensor.stop
      )
        projectStore.obtDeviceSensor.stop()
    }
    return () => {
      if (
        projectStore.obtDeviceSensor &&
        projectStore.obtDeviceSensor.stop
      )
        projectStore.obtDeviceSensor.stop()
    }
  }, [projectStore.gpsMode])

  async function createMotionTracking() {
    if (!projectStore.obtDeviceSensor || !projectStore.obtDeviceSensor.activated || !projectStore.obtDeviceSensor.start) {
      try {
        var sensor = new AbsoluteOrientationSensor({
          frequency: 60,
          referenceFrame: "screen"
        });
        var firstTime = true;
        sensor.addEventListener("reading", function (a) {
          var a = new Quaternion(a[0], a[1], a[2], a[3])
          if (freezeCamera) return
          //var hpr = HeadingPitchRoll.fromQuaternion(a)
          //updateGPSPosition()
          firstTime = false
          var position = projectStore.currentGPS
          if (position.coords) {
            var pos = Cartesian3.fromDegrees(
              position.coords.longitude,
              position.coords.latitude
            )
            var clamp = false
            obtSampleTerrain(position.coords.latitude, position.coords.longitude).then(function (f) {

              if (f) { clamp = true }
              var g = Cartographic.fromCartesian(f || pos, Ellipsoid.WGS84, new Cartographic())
              //HeadingPitchRoll.fromQuaternion(viewQuaternion, hpr)
              var hpr = getHeadingPitchRoll()
              if (projectStore.gpsMode === 'first_person') {
                if (hpr)
                  projectStore.setObtGPSOrientation({
                    heading: hpr.heading,
                    pitch: getViewer().camera.pitch,
                    // distance: distance,
                    position: f
                  })
                var viewOptions = {}
                if (hpr)
                viewOptions.orientation = {
                  heading: hpr.heading,
                  pitch: hpr.roll - Math.PI / 2,
                  roll: -hpr.pitch
                }
                if (position && position.coords)
                  viewOptions.destination = Cartesian3.fromDegrees(
                    position.coords.longitude,
                    position.coords.latitude,
                    clamp && g.height > 0 ? g.height + 1 : 2
                  )
                getViewer().camera.setView(viewOptions)

              }
              else {
                if (hpr && f) {
                  let distance = Cartesian3.distance(getViewer().camera._positionWC, f)
                  getViewer().camera.lookAt(f, new HeadingPitchRange(hpr.heading, getViewer().camera.pitch, distance));
                  getViewer().camera.lookAtTransform(Matrix4.IDENTITY);
                  projectStore.setObtGPSOrientation({
                    heading: hpr.heading,
                    pitch: getViewer().camera.pitch,
                    distance: distance,
                    position: f
                  })
                }
              }
            })
          }
        })
        //sensor.start();
        projectStore.setObtDeviceSensor(sensor)
        if (projectStore.gpsMode === 'fix' || projectStore.gpsMode === 'first_person') {
          getOrientation()
        }
        //   await FULLTILT.getDeviceOrientation({
        //     type: 'world',
        //   })
        // )
      } catch (d) {
        if ("SecurityError" === d.name)
          console.log("Sensor construction was blocked by a feature policy.");
        else if ("ReferenceError" === d.name)
          console.log("Sensor is not supported by the User Agent.");
        else
          throw d;
      }
    }
  }

  function stopWatch() {
    navigator.geolocation.clearWatch(projectStore.geoWatch);
    projectStore.setGeoWatch(undefined)
  }

  function positionError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.error("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.error("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.error("An unknown error occurred.");
        break;
    }

  }
  function startWatch() {
    if ("geolocation" in navigator && "watchPosition" in navigator.geolocation) {
      if (projectStore.geoWatch && !isNaN(projectStore.geoWatch)) {
        navigator.geolocation.clearWatch(projectStore.geoWatch)
      }
      var geoWatch = navigator.geolocation.watchPosition(updateGPSPosition,
        positionError, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      });
      projectStore.setGeoWatch(geoWatch)
    }
  }

  useEffect(() => {
    if (!getViewer().scene) return
    //geoFindMe(true)
    createMotionTracking()
    startWatch()
    if (!projectStore.WorldTerrain) {
      // projectStore.setWorldTerrain(createWorldTerrain());
    }

    // viewer.scene.skyBox.destroy()
    // viewer.scene.skyBox = undefined
    // viewer.scene.sun.destroy()
    // viewer.scene.sun = undefined
    // viewer.scene.moon.destroy()
    // viewer.scene.moon = undefined
    // viewer.scene.skyAtmosphere.destroy()
    // viewer.scene.skyAtmosphere = undefined
    // console.log('cesiumWidget', viewer.cesiumWidget)


    var gl = getViewer().cesiumWidget.canvas.getContext('webgl')

    // console.log('gl', gl)
    // gl.clearColor(0, 0, 0, 0)
    // gl.clear(gl.COLOR_BUFFER_BIT)
    //gl.alpha = true
    // viewer.cesiumWidget.canvas.style.display = "none"
    // viewer.scene.fxaa = false

    // viewer.cesiumWidget.contextOptions = {
    //   webgl: gl,
    // }
    // viewer.scene.contextOptions = {
    //   webgl: { alpha: true },
    // }

    // viewer.contextOptions = {
    //   webgl: { alpha: true },
    // }
    return () => {
      stopWatch();
      if (
        projectStore.obtDeviceSensor &&
        projectStore.obtDeviceSensor.stop
      )
        projectStore.obtDeviceSensor.stop()
    }
  }, [])


  const getImageFromCanvas = async (filename) => {
    if (viewer.current !== null) {
      const canvas = viewer.current.cesiumElement.canvas
      const base64Image = canvas.toDataURL('image/jpeg', 0.5) // 1.0 fullQuality, 0.5 mediumQuality , 0.1 lowQuality 
      const imageFile = await createImageFileFromBase64(base64Image, filename, false)
      const formData = new FormData()
      formData.append('files', imageFile)
      return ProjectRequest.uploadModel(formData)
    }
    return Promise.reject()
  }

  const takePhotoFromDevice = async (filename) => {
    if (webcamRef.current !== null) {
      viewer.current.cesiumElement.render()
      const imageSrc = webcamRef.current.getScreenshot();
      const imageFile = await createImageFileFromBase64(imageSrc, filename, false)
      const formData = new FormData()
      formData.append('files', imageFile)
      return ProjectRequest.uploadModel(formData)
    }
    return Promise.reject()
  }

  const getCameraDataAR = async (camData) => {
    if (viewer.current != null) {
      /** capture render model*/
      const temp1 = projectStore.visibleTilesets
      //hide tileset model has isrender = false show on tileset isrender=true for capture
      let temp = toJS(projectStore.modelList).filter(function (obj) {
        return obj.isRender;
      }).map(function (obj) { return obj.id; });
      projectStore.setVisibleTilesets(temp)

      let modelrenderdata = {}
      let canvas = viewer.current.cesiumElement.canvas
      modelrenderdata.CanvasSize = {
        width: canvas.width,
        height: canvas.height,
      }
      modelrenderdata.CesiumCameraData = camData
      capturesStore.setCameraData(camData)

      const files = await getImageFromCanvas(`ModelImage${new Date().getTime() / 1000}.jpeg`)
      const file = files.data[0]
      let _modelrender = {
        imageModelRender: file,
        modelRenderInfo: modelrenderdata
      }
      projectStore.setVisibleTilesets(temp1)
      capturesStore.setCameraData(false)
      return _modelrender
    }
    return false
  }

  const getDevicePhoto = async () => {
    if (viewer.current != null) {
      let _deviceinfo = {}

      let _headingpitroll = getHeadingPitchRoll()
      var position = projectStore.currentGPS
      let _pos = new Cartesian3.fromDegrees(0, 0)

      if (position) {
        _pos = Cartesian3.fromDegrees(
          position.coords.longitude,
          position.coords.latitude
        )
      }
      _deviceinfo.position = _pos
      _deviceinfo = Object.assign(_headingpitroll, _deviceinfo)

      let camera = viewer.current.cesiumElement.camera
      let camData = {}
      camData.duration = 0
      camData.position = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      }
      camData.direction = {
        x: camera.direction.x,
        y: camera.direction.y,
        z: camera.direction.z,
      }
      camData.up = {
        x: camera.up.x,
        y: camera.up.y,
        z: camera.up.z,
      }      
      let _device = {}
      _device.devicecapture = {
        deviceInfo: _deviceinfo
      }
      if (
        projectStore.obtDeviceSensor &&
        projectStore.obtDeviceSensor.stop
      )
        projectStore.obtDeviceSensor.stop()

      const files = await takePhotoFromDevice(`photoDevice${new Date().getTime() / 1000}.jpeg`)
      const file = files.data[0]
      _device.devicecapture.photoDevice = file
      _device.camData = camData
      
      return _device
    }
    return false
  }

  useEffect(() => {
    const SendARCaptureData = async () => {
      if (projectStore.isSendARInfo) {
        projectStore.setLoadingProgress(true)
        getViewer().scene.backgroundColor = Color.WHITE
        setFreezeCamera(true)
        stopWatch()
        let devicephoto = await getDevicePhoto()
        let capturemodelrender = await getCameraDataAR(devicephoto.camData)
        getViewer().scene.backgroundColor = Color.TRANSPARENT
        startWatch()
        setFreezeCamera(false)
        let newCapture = {
          name: 'AR Capture',
          project: projectid,
        }
        let params = Object.assign(newCapture, capturemodelrender, devicephoto.devicecapture)
        await projectStore.sendARInfo(params)
        projectStore.setSendARInfo(false)
        getOrientation()
        projectStore.setLoadingProgress(false)
      }
    }
    SendARCaptureData()
  }, [projectStore.isSendARInfo])

  return (
    <>
      <Entity
        position={markerPos}
        billboard={greenPin}
        show={projectStore.gpsMode !== 'none'}
        ref={pinRef}
      />
    </>
  )
}
export default inject('projectStore', 'capturesStore')(observer(Gps))
