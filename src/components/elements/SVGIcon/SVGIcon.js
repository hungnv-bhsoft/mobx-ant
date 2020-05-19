import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const IconWrapper = styled.div`
  display: inline-block;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  svg {
    width: 100%;
    height: 100%;
    path {
      fill: ${props => props.color ? props.color : 'black'};
    }
  }
`

const SVGIcon = props => {

  const {
    content, width, height, color,
  } = props

  return (
    <IconWrapper
      width={width} height={height}
      color={color}>
      {content}
    </IconWrapper>
  )

}

SVGIcon.propTypes = {
  content: PropTypes.node.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  color: PropTypes.string,
}

export default SVGIcon