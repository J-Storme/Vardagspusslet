import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';

// Globala stilar
const GlobalStyles = createGlobalStyle`

  * {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box; 
    font-family: 'Roboto', Arial, sans-serif;
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
  font-family: 'Indie Flower', Arial, sans-serif;
  }

  h2 {
  text-align: center;
  font-size: 20px;
  font-family: 'Montserrat', Arial, sans-serif;
  }

  p {
  margin: 5px 12px; 
  text-align: center;
  font-family: 'Montserrat', Arial, sans-serif;
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
  /*background-color: rgb(139, 203, 255);*/
  background: linear-gradient(
    135deg,
    rgb(210, 212, 253),
    rgb(166, 167, 218),
    rgb(90, 92, 160)
  );
`;

export default GlobalStyles;
