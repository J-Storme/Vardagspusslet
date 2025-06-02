import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../context/LoginContext';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useLogin();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Vänligen fyll i alla fält.');
      return;
    }

    try {
      // Först registrera användaren
      const response = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      // Logga svaret för att kontrollera vad servern returnerar
      const data = await response.json();
      console.log('Response text:', data);

      if (!response.ok) {
        setError(data.error || 'Kunde inte registrera användare');
        return;
      }

      // Efter lyckad registrering, spara token och användaruppgifter
      localStorage.setItem('token', data.token); // Använd token som returnerades vid registreringen
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', name);
      localStorage.setItem('userId', data.id.toString());

      // Logga in användaren direkt
      login(data.token, data.email, data.name, data.id);
      navigate('/'); // Navigera till home efter inloggning

    } catch (error) {
      // console.error('Fel vid registrering:', error);
      // setError('Något gick fel vid registrering');
    }
  };

  return (
    <>
      <h2>Registrera ett konto för hushållet</h2>
      <RegisterContainer>
        <LabelRow>
          <label htmlFor="name">Hushållets namn:</label>
          <input
            type="text"
            placeholder="Hushållets namn"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </LabelRow>

        <LabelRow>
          <label htmlFor="email">E-post:</label>
          <input
            type="email"
            placeholder="E-post"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </LabelRow>

        <LabelRow>
          <label htmlFor="password">Lösenord:</label>
          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </LabelRow>
        {error && <p>{error}</p>}
        <Button onClick={handleRegister}>Registrera</Button>
      </RegisterContainer>
    </>
  );
}

export default Register;

// Styling
const RegisterContainer = styled.div`
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  label {
    font-weight: bold;
    width: 100px; 
  }

  input {
    flex: 1;
    padding: 8px;
    font-size: 16px;
  }
`;

const Button = styled.button`
  display: inline-block;
  background-color:rgb(117, 119, 212);
  color: white;
  font-weight: bold;
  padding: 0.75rem 1.25rem;
  border: none;
  margin-left: 7rem;
  margin-right: 0px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color:rgb(138, 212, 142);
  }
`;


