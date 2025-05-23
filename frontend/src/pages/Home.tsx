import styled from 'styled-components';
import React from 'react';
import CalendarView from '../components/Calendar';


function Home() {
  return (
    <Container>
      <h1>Välkommen till Vardagspusslet</h1>
      <p>Planera familjens vardag tillsammans.</p>
      <CalendarView />
    </Container>
  );
}

export default Home;

// sTYLING
const Container = styled.div`
  padding: 2rem;
`;