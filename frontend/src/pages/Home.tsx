import styled from 'styled-components';
import React from 'react';
import CalendarView from '../components/Calendar';
import Events from '../components/Events';
import { useLogin } from '../context/LoginContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function Home() {
  const { token, userId } = useLogin();
  const navigate = useNavigate(); // För att kunna navigera till annan sida

  useEffect(() => {
    if (!token || !userId) {
      navigate('/login');
    }
  }, [token, userId, navigate]);

  if (!token || !userId) {
    return <div>Du måste vara inloggad för att se events.</div>;
  }


  return (
    <EventsContainer>
      <h1>Välkommen till Vardagspusslet</h1>
      <p>Planera familjens vardag tillsammans.</p>
      <CalendarView />
      <Events token={token} userId={userId} />
    </EventsContainer>
  );
}


export default Home;

// sTYLING
const EventsContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 700px;
  margin: 0 auto;
  padding: 1rem;
`;