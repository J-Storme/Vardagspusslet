import styled from 'styled-components';
import { useState, useEffect } from 'react';
import CalendarView from '../components/Calendar';
import Events from '../components/Events';
import { useLogin } from '../context/LoginContext';
import { useNavigate } from 'react-router-dom';
import { Event, FamilyMember } from '../types';

function Home() {
  const { token, userId } = useLogin();
  const navigate = useNavigate(); // För att kunna navigera till annan sida

  const [events, setEvents] = useState<Event[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  useEffect(() => {
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    async function fetchData() {
      try {
        const response = await fetch('/api/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Något gick fel vid hämtning av data');
        }

        const data: Event[] = await response.json();
        console.log('Events från API:', data);

        setEvents(data);

        const allMembers = data
          .flatMap((event) => event.family_members ?? [])
          .filter((member): member is FamilyMember => !!member);

        const uniqueMembers = Array.from(
          new Map(allMembers.map((m) => [m.id, m])).values(),
        );

        setFamilyMembers(uniqueMembers);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [token, userId, navigate]);

  if (!token || !userId) {
    return <div>Du måste vara inloggad för att se events.</div>;
  }

  return (
    <EventsContainer>
      <h1>Välkommen till Vardagspusslet!</h1>
      <p>Planera familjens vardag tillsammans.</p>
      <CalendarView events={events} familyMembers={familyMembers} />
      <Events
        token={token}
        userId={userId}
        events={events}
        setEvents={setEvents}
      />
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
