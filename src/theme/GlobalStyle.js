import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
    }
    button {
        outline: none;
        cursor: pointer;
    }
    *,
    *::before,
    *::after {
        box-sizing: inherit;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    html {
        font-size: 62.5%;  /* 1rem = 10px */
        box-sizing: border-box;
    }
`;