import { observable, action, decorate, toJS } from 'mobx'

class DemoStore {
  isLoading = false
  cameraData = false

  setLoadingProgress = state => {
    this.isLoading = state
  }

  setCameraData = camData => {
    this.cameraData = camData
  }
}

decorate(DemoStore, {
  isLoading: observable,
  setLoadingProgress: action,

  cameraData: observable,
  setCameraData: action,
})

export default new DemoStore()
