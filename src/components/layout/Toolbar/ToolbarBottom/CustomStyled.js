import styled from 'styled-components'

export const ToolbarBottomContainer = styled.div`
  display: block;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 0px 0px 10px 0px;
  z-index: 999;
  background: none;
`

export const ToolbarBottomItem = styled.div`
  width: 35px;
  height: 35px;
  margin-right: 5px;
  float:left;
  color: ${props => props.activated ? '#ff8d4f' : '#191919'} !important;
  transition: ease .3s;
  path {
    fill: ${props => props.activated ? '#ff8d4f' : '#191919'} !important;
    transition: ease .3s;
  }
  .ant-btn {
    width: 35px !important;
    height: 35px !important;
    margin-right: 5px;
    @media screen and (max-width: 768px) {
      width: 30px;
      height: 30px;
    }
    > div {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
`