import styled from 'styled-components'

export const ActionRow = styled.div`
  margin-top: 15px;
`

export const UploadWrapper = styled.div`
  max-height: 500px;
`

export const TilesetItemAction = styled.div`
  float: right;
  .anticon {
    margin-left: 5px;
  }
`
export const StepContainer = styled.div`
  margin-top: 20px;
`

export const EditPosLeftPanel = styled.div`
  display: ${props => (props.visible ? 'block' : 'none')};
  position: absolute;
  left: 0;
  top: 0;
  padding: 8px;
  z-index: 999;
  width: 361px;
  height: 100%;
  background: white;
`
export const LocationPanelHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
`
