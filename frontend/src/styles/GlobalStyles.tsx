import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';

// Globala stilar
const GlobalStyles = createGlobalStyle`
  * {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box; 
    font-family: Arial, sans-serif;
      }

  body {
    background-color:rgb(245, 245, 245);
    color: #333;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
   }

  h1 {
  text-align: center;
  font-size: 26px;
  margin: 10px;
  }

  h2 {
  text-align: center;
  font-size: 20px;
  }

  p {
  margin: 5px 12px; 
   text-align: center;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

// AppContainer för att wrappa hela applikationen
export const AppContainer = styled.div`
  min-height: 100vh;
  min-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
    background-color: rgb(222, 217, 243);
`;

export default GlobalStyles;
