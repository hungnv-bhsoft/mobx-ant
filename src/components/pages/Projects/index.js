import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import ProjectStore from '../../../stores/ProjectStore';

import List from '../../antdComponent/List';
import theme from '../../../theme';
import AntModal from '../../antdComponent/AntModal';
import DefaultTemplate from '../../layout/DefaultTemplate';
//antd



//styled-components
const Header = styled.header`
    width: 100%;
    padding: 10px 20px;
    background-color : ${ ({ theme }) => theme.colors.primary };
`;

export default () => {
    return (
        <>
        <ProjectStore>
        <ThemeProvider theme={theme}>
        <Header>
            <AntModal />
        </Header>
        <List />
        </ThemeProvider>
        </ProjectStore>
        </>

    );
};