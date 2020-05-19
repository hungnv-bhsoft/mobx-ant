import { observable, action, decorate } from 'mobx'

class CommonStore {
  // token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYTI5NWE5ZTE3NjIyMmQwY2UxN2IyYyIsImlhdCI6MTU3MzYzMzk2MiwiZXhwIjoxNTc2MjI1OTYyfQ.7EE-EsBPasCMO--xSOugZts3o2eoencz176KsDzYbDc'
  isLoading = false
  isSidebarCollapse = false

  appTheme = {
    name: 'default',
    solidColor: '#F26524',
    solidLightColor: '#ecf9f6',
    gradientColor: 'linear-gradient(167.51deg, #2ECF94 24.37%, #3DBEA3 78.07%)',
    shadowColor: '0 2px 10px rgba(46,207,148,0.6)',
  }

  showMainDrawer = false
  currentPage = ''
  currentMainDrawerPanel = 'cityDemo'
  buttonSize = 'large'


  setLoadingProgress = state => {
    this.isLoading = state
  }

  setCurrentMainDrawerPanel(currentPanel) {
    this.currentMainDrawerPanel = currentPanel
  }

  setShowMainDrawer(isShow) {
    this.showMainDrawer = isShow
  }

  setCurrentPage(pageName) {
    this.currentPage = pageName
  }

  setLoadingProgress = state => {
    this.isLoading = state
  }

  setTheme(color) {
    switch (color) {
      case 'red':
        this.appTheme.name = 'red'
        this.appTheme.solidColor = 'rgb(244, 67, 54)'
        this.appTheme.solidLightColor = 'rgb(254, 237, 235)'
        this.appTheme.gradientColor =
          'linear-gradient(108.84deg, #F77062 0%, #FE5196 100%)'
        this.appTheme.shadowColor = '0 2px 10px rgba(254, 81, 150, 0.5)'
        break
      default:
        this.appTheme.name = 'green'
        this.appTheme.solidColor = '#222'
        this.appTheme.solidLightColor = '#fff'
        this.appTheme.gradientColor =
          'linear-gradient(167.51deg, #fff 24.37%, #fff 78.07%)'
        this.appTheme.shadowColor = '0 2px 10px rgba(46,207,148,0.6)'
        break
    }
  }
}

decorate(CommonStore, {
  showMainDrawer: observable,
  setShowMainDrawer: action,

  currentPage: observable,
  setCurrentPage: action,

  currentMainDrawerPanel: observable,
  setCurrentMainDrawerPanel: action,

  isLoading: observable,
  setLoadingProgress: action,

  appTheme: observable,
  setTheme: action,
})

export default new CommonStore()
