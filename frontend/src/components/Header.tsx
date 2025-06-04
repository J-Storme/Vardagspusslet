import styled from 'styled-components';
import { useLogin } from '../context/LoginContext';
import { Link } from 'react-router-dom';

function Header() {
  const { isLoggedIn, userName } = useLogin();

  return (
    <HeaderContainer>
      <LogoContainer><h1>Vardagspusslet</h1>
        <img src="/logo.png" alt="logo" />
      </LogoContainer>
      {isLoggedIn && <WelcomeText>Hushåll {userName}!</WelcomeText>}
    </HeaderContainer>
  );
}

export default Header;

export const HeaderContainer = styled.header`
  width: 100%;
  max-width: 700px;
  text-align: center;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 24px 0;  

  h1 {font-size: 36px;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;  
  gap: 2px;
  margin: 0;

  h1 {
  font-size: 36px;
  font-family: 'Indie Flower', Arial, sans-serif;
  }
  
  img {
    height: 60px;
  }
`;

const WelcomeText = styled.p`
  position: absolute;
  right: 10px;
  top: 50%;
  font-family: 'Indie Flower', Arial, sans-serif;
  transform: translateY(-50%);  
`;