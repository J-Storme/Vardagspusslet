import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../context/LoginContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useLogin();

  const handleLogin = async () => {
    if (!email && !password) {
      setError('Vänligen fyll i både e-post och lösenord.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Inloggning misslyckades');
        return;
      }

      // spara token, email, namn och adress
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userName', data.name || '');
      localStorage.setItem('userId', data.id.toString());

      // Logg ain och skicka vidare till sidan Home
      login(data.token, data.email, data.name, data.id);
      navigate('/');
    } catch (error) {
      console.error('Inloggningsfel:', error);
      setError('Något gick fel vid inloggning');
    }
  };

  // Navigera till registreringssidan
  const handleRegisterRedirect = () => {
    navigate('/register');
  };


  return (
    <LoginContainer>
      <h2>Logga in</h2>
      <input
        type="email"
        placeholder="E-post"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        placeholder="Lösenord"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {error && <p>{error}</p>}
      <button onClick={handleLogin}>Logga in</button>
      <div>
        <p>Har du inget konto?</p>
        <button onClick={handleRegisterRedirect}>Registrera dig</button>
      </div>
    </LoginContainer>
  );
}

const LoginContainer = styled.div`
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;

  div {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  button {
    cursor: pointer;
  }
`;

export default Login;
