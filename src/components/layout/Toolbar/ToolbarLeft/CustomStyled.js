import styled from 'styled-components'

export const ToolbarLeftContainer = styled.div`
  display: block;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 5px 10px 10px;
  z-index: 999;
  background: none;
`

export const ToolbarLeftItem = styled.div`
  width: 35px;
  height: 35px;
  margin-bottom: 5px;
  color: ${props => props.activated ? '#ff8d4f' : '#191919'} !important;
  transition: ease .3s;
  path {
    fill: ${props => props.activated ? '#ff8d4f' : '#191919'} !important;
    transition: ease .3s;
  }
  // &:hover {
  //   color: #ff8d4f !important;
  //   path {
  //     fill: #ff8d4f !important;
  //   }
  // }
  .ant-btn {
    width: 35px !important;
    height: 35px !important;
    margin-bottom: 5px;
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