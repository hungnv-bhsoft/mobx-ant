import React, { Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Tooltip, Popover } from 'antd'
import { withRouter } from 'react-router-dom'
import { ToolbarBottomContainer, ToolbarBottomItem } from './CustomStyled'
// import MediaQuery from 'react-responsive'
// SVG
const ToolbarBottom = props => {
  const { commonStore, demoStore, currentPage } = props

  const viewByPage = () => {
    switch (currentPage) {
      case 'projectDetail':
      case 'projectShare':
        return (
          <Fragment>
            <>
              <ToolbarBottomItem activated={false}>
                <Tooltip placement={'top'} title={'Test'}>
                  <Button
                    onClick={() => alert('test')}
                    icon="camera"
                    size={commonStore.buttonSize}
                  />
                </Tooltip>
              </ToolbarBottomItem>
            </>
          </Fragment>
        )
      default:
        break
    }
  }

  return (
    <Fragment>
      <ToolbarBottomContainer>
        {currentPage ? viewByPage() : ''}
      </ToolbarBottomContainer>
    </Fragment>
  )
}

export default withRouter(
  inject('commonStore', 'demoStore')(observer(ToolbarBottom))
)
