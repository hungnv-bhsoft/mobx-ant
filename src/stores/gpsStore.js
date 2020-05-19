import { observable, action, decorate, toJS } from 'mobx'
// Request
// import { ProjectRequest } from '../requests'
// import { cesiumToken } from '../config'
// import axios from 'axios'

class GpsStore {
  isLoading = false
  obtDeviceSensor = {}
  showProjectInfoDrawer = false
  gpsMode = 'none' // gps mode : none, fix, free
  skyColor = 'none' // default, white, camera
  viewMode = 'Default mode' // default mode, measure point, measure distance
  geoWatch = {}
  obtGPSOrientation = {}
  currentGPS = {}
  WorldTerrain = undefined

  setSendARInfo = p => {
    this.isSendARInfo = p
  }

  setSkyColor = ort => {
    this.skyColor = ort
  }
  setObtDeviceSensor = ort => {
    this.obtDeviceSensor = ort
  }
  setWorldTerrain = ort => {
    this.WorldTerrain = ort
  }
  setGeoWatch = ort => {
    this.geoWatch = ort
  }

  setCurrentGPS = ort => {
    this.currentGPS = ort
  }
  setObtGPSOrientation = ort => {
    this.obtGPSOrientation = ort
  }
  setGpsMode = mode => {
    this.gpsMode = mode
  }
  setViewMode = mode => {
    this.viewMode = mode
  }

  setLoadingProgress = state => {
    this.isLoading = state
  }
}

decorate(GpsStore, {
  // Observables
  isLoading: observable,
  viewMode: observable,
  setViewMode: action,
  gpsMode: observable,
  setGpsMode: action,
  geoWatch: observable,
  setGeoWatch: action,
  obtDeviceSensor: observable,
  obtGPSOrientation: observable,
  setObtGPSOrientation: action,
  setObtDeviceSensor: action,
  setWorldTerrain: action,
  WorldTerrain: observable,
  setCurrentGPS: action,
  currentGPS: observable,
  skyColor: observable,
  setSkyColor: action,
  isSendARInfo: observable,
  setSendARInfo: action,
})

export default new GpsStore()
