import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: block;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 45px;
`

const Container = ({ children }) => {
  return (
    <Wrapper>
      {children}
    </Wrapper>
  )
}

export default Container