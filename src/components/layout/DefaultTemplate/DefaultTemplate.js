import React from 'react'
import { inject, observer } from 'mobx-react'
import { Layout } from 'antd'
import './PageTemplate.css'

import ToolbarLeft from '../Toolbar/ToolbarLeft'
import ToolbarTop from '../Toolbar/ToolbarTop'
import ToolbarBottom from '../Toolbar/ToolbarBottom'
import DrawerCityDemo from '../MainDrawer'
import LoadingSpinner from '../../elements/LoadingSpinner'

const { Content } = Layout

const DefaultTemplate = ({ commonStore, demoStore, children }) => {

  const checkLoading = () =>
    !!(
      demoStore.isLoading || commonStore.isLoading
    )

  return (
    <Layout>
      <Layout style={{
        background: '#eee',
        padding: 0,
      }}>
        <ToolbarTop currentPage={commonStore.currentPage}/>
        <ToolbarLeft currentPage={commonStore.currentPage}/>
        <ToolbarBottom currentPage={commonStore.currentPage}/>
        <DrawerCityDemo/>
        <Content>{children}</Content>
      </Layout>
      {
        checkLoading()
          ? <LoadingSpinner type={'page'} theme={commonStore.appTheme}/>
          : null
      }
    </Layout>
  )
}

export default inject('commonStore', 'demoStore')(observer(DefaultTemplate))