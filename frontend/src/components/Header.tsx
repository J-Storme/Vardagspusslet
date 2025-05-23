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
      {isLoggedIn && <WelcomeText>Inloggad som {userName}!</WelcomeText>}
    </HeaderContainer>
  );
}

export default Header;

export const HeaderContainer = styled.header`
  width: 100%;
  max-width: 700px;
  text-align: center;
  margin-bottom: 20px;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0;
  padding: 14px 0px;
  background-color: rgb(233, 231, 248);
  img {
    height: 60px;
  }
`;

const WelcomeText = styled.p`
  font-size: 18px;
  margin: 0;
`;