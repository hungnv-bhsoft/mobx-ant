import React, { Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Tooltip, Icon } from 'antd'
import { withRouter } from 'react-router-dom'
import { ToolbarLeftContainer, ToolbarLeftItem } from './CustomStyled'
import MediaQuery from 'react-responsive'
// SVG
import SVGIcon from '../../../elements/SVGIcon'
import { ReactComponent as PinIcon } from '../../../../assets/svgs/pin.svg'
import { ReactComponent as RulerIcon } from '../../../../assets/svgs/ruler.svg'

const ToolbarLeft = props => {
  const { commonStore, demoStore, currentPage, history, match } = props

  const gpsModeIcons = {
    none: { icon: 'compass', title: 'Click to active gps mode' },
    fix: { icon: 'environment', title: 'Move by orentation' },
    free: { icon: 'shake', title: 'GPS and free camera' },
    first_person: { icon: 'compass', title: 'Click to active gps mode' },
  }
  const firstPersonModeIcons = {
    none: { icon: 'eye', title: 'First person view', icon: 'eye' },
    cesium: { icon: 'eye', title: 'First person view cesium sky', icon: 'eye' },
    white: { icon: 'eye', title: 'First person view white sky', icon: 'cloud' },
    camera: {
      icon: 'eye',
      title: 'First person view camera sky',
      icon: 'camera',
    },
  }
  const viewByPage = () => {
    const defaultButton = <Fragment />
    switch (currentPage) {
      case 'projectDetail':
        return (
          <Fragment>
            <ToolbarLeftItem activated={false}>
              <Tooltip placement={'right'} title={'Project info'}>
                <Button
                  onClick={() => alert('test')}
                  icon={'info-circle'}
                  size={commonStore.buttonSize}
                />
              </Tooltip>
            </ToolbarLeftItem>
          </Fragment>
        )
      default:
        break
    }
  }

  return (
    <Fragment>
      <ToolbarLeftContainer>
        {currentPage ? viewByPage() : ''}
      </ToolbarLeftContainer>
    </Fragment>
  )
}

export default withRouter(
  inject('commonStore', 'demoStore')(observer(ToolbarLeft))
)
