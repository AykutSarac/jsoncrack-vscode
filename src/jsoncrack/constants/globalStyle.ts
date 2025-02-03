import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html, body {
    overscroll-behavior: none;
    -webkit-font-smoothing: subpixel-antialiased !important;
    margin: 0;
    padding: 0;
    height: 100vh;
  }

  *,
  *::before,
  *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      scroll-behavior: smooth !important;
      -webkit-tap-highlight-color: transparent;
      -webkit-font-smoothing: never;
  }

  code {
    background-color: unset;
  }

  .hide {
    display: none;
  }

  svg {
    vertical-align: text-top;
  }

  a {
    color: unset;
    text-decoration: none;
  }

  button {
    border: none;
    outline: none;
    background: transparent;
    width: fit-content;
    margin: 0;
    padding: 0;
    cursor: pointer;
  }
`;

export default GlobalStyle;
