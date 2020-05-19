import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import DefaultTemplate from '../../layout/DefaultTemplate'
import { inject, observer } from 'mobx-react'
// import { ProjectWraper, IntroWrapper } from './style'
// import LoadingSpinner from '../../elements/LoadingSpinner'

const HomePage = ({ usersStore, commonStore, history }) => {

  useEffect(() => {
    commonStore.setCurrentPage('home')
  }, [])

  const checkAppLoading = () => {
    return !!(
      commonStore.isLoading ||
      usersStore.isLoading
    )
  }

  return (
    <DefaultTemplate>
      <Helmet>
        <title>Home | xD Twin Viewer</title>
      </Helmet>
      <div>
        hello
      </div>
    </DefaultTemplate>
  )
}

export default inject('commonStore')(observer(HomePage))
