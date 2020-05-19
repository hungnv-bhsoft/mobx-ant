import styled from 'styled-components'

export const ToolbarTopContainer = styled.div`
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  padding: 10px;
  z-index: 999;
`
export const ToolbarTopItem = styled.div`
  height: 35px;
  margin-right: 5px;
  float: left;
  .ant-btn-icon-only.ant-btn-lg {
    width: 35px;
    height: 35px;
  }
  .ant-btn {
    height: 35px;
  }
`