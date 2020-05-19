import styled from 'styled-components'

export const ProjectWraper = styled.div`
  background: #FFFFFF;
  padding: 15px;
  margin-top: 55px;
  height: calc(100vh - 60px);
`
export const IntroWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
  padding-top: 60px;
  @media screen and (max-width: 1000px) {
    padding-top: 30px;
  }
  > div {
    width: 48%;
    @media screen and (max-width: 1000px) {
      width: 100%;
      margin-bottom: 30px;
    }
  }
`