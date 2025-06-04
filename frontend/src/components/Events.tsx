import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Event } from '../types';

interface FamilyMember {
  id: number;
  name: string;
  role: string;
  profile_image: string;
}

type Props = {
  userId: number;
  token: string;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
};


//function Events({ userId, token }: Props) {
function Events({ userId, token, events, setEvents }: Props) {
  // state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedFamilyMembers, setSelectedFamilyMembers] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false); // Lägg till event-form visas ej från början
  //const [events, setEvents] = useState<Event[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  //const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Hämta events och familjemedlemmar när komponenten laddas
  useEffect(() => {
    fetchEvents();
    fetchFamilyMembers();
  }, []);

  async function fetchFamilyMembers() {
    try {
      //const token = localStorage.getItem('token');
      const res = await fetch('/api/family-members', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFamilyMembers(data);
    } catch (error) {
      console.error('Kunde inte hämta familjemedlemmar', error);
    }
  }

  function toggleFamilyMember(id: number) {
    if (selectedFamilyMembers.includes(id)) {
      setSelectedFamilyMembers(selectedFamilyMembers.filter((fm) => fm !== id));
    } else {
      setSelectedFamilyMembers([...selectedFamilyMembers, id]);
    }
  }

  async function fetchEvents() {
    if (!token) {
      setErrorMessage('Ingen token hittades, du är inte inloggad');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log('Events från backend:', data);

      /*if (Array.isArray(data)) {
        setEvents(data);*/
      if (Array.isArray(data)) {

        const mappedEvents = data.map((ev: any) => ({
          id: ev.id,
          title: ev.title,
          description: ev.description,
          event_date: ev.event_date,
          start_time: ev.start_time,
          end_time: ev.end_time,
          family_member_ids: ev.family_member_ids,
          user_id: ev.user_id
        }));
        setEvents(mappedEvents);


      } else {
        console.error('Fel format från backend. Förväntade en array, fick:', data);
        setEvents([]); // Fallback
      }

    } catch (error) {
      console.error('Kunde inte hämta events', error);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage('');

    if (selectedFamilyMembers.length === 0) {
      setErrorMessage('Minst en familjemedlem måste väljas.');
      return;
    }

    // Lägger till :00 innan det skickas till backend eftersom TIME i postgre vill ha sekunder
    const startTimePlusZeros = startTime.length === 5 ? startTime + ':00' : startTime;
    const endTimePlusZeros = endTime.length === 5 ? endTime + ':00' : endTime;

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          event_date: eventDate,
          start_time: startTimePlusZeros,
          end_time: endTimePlusZeros,
          user_id: userId,
          family_member_ids: selectedFamilyMembers,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErrorMessage(errorData.error || 'Något gick fel');
        return;
      }

      await fetchEvents();

      // Töm formuläret
      setTitle('');
      setDescription('');
      setEventDate('');
      setSelectedFamilyMembers([]);
      setIsAddingEvent(false); // Stänger formuläret för att skapa event

    } catch (error) {
      setErrorMessage('Fel vid skapande av event');
      console.error(error);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Är du säker på att du vill ta bort eventet?')) return;

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setEvents(events.filter((ev) => ev.id !== id));
      } else {
        alert('Kunde inte ta bort eventet');
      }
    } catch (error) {
      alert('Fel vid borttagning');
      console.error(error);
    }
  }

  return (
    <EventsFormContainer>
      <Title>Mina Events</Title>
      <FormContainer>
        {!isAddingEvent && (
          <SubmitButton onClick={ /*För att öppna formuläret */() => setIsAddingEvent(true)}>
            Lägg till nytt event
          </SubmitButton>
        )}

        {isAddingEvent && (
          <StyledForm onSubmit={handleSubmit}>
            <FormGroup>
              <label>Titel:</label>
              <input
                type="text"
                value={title}
                onChange={function (event) { setTitle(event.target.value); }}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Beskrivning:</label>
              <textarea
                value={description}
                onChange={function (event) { setDescription(event.target.value); }}
              />
            </FormGroup>

            <FormGroup>
              <label>Datum:</label>
              <input
                type="date"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Starttid:</label>
              <input
                type="time"
                value={startTime}
                onChange={event => setStartTime(event.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Sluttid:</label>
              <input
                type="time"
                value={endTime}
                onChange={event => setEndTime(event.target.value)}
                required
              />
            </FormGroup>


            <FormGroup>
              <label>Familjemedlemmar (minst en):</label>
              {familyMembers.length === 0 && <NoFamilyMessage>Inga familjemedlemmar hittades.</NoFamilyMessage>}
              {familyMembers.map(fm => (
                <CheckboxLabel key={fm.id}>
                  <input
                    type="checkbox"
                    checked={selectedFamilyMembers.includes(fm.id)}
                    onChange={() => toggleFamilyMember(fm.id)}
                  />
                  {fm.name}
                </CheckboxLabel>
              ))}
            </FormGroup>

            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

            <SubmitButton type="submit">Skapa Event</SubmitButton>
          </StyledForm>
        )}

      </FormContainer>


      {Array.isArray(events) && events.length > 0 ? (
        <EventList>
          {events.map(event => (
            <EventItem key={event.id}>
              <DeleteButton onClick={() => handleDelete(event.id)}>Radera</DeleteButton>
              <strong>{event.title}</strong>
              <br />
              { /* Skapa ett Date-objekt med newDate(), omvandla till ISO-string .split('T' delar upp strängen i två delar,
              och [0] tar första delen av arrayen som är datumet*/
                new Date(event.event_date).toISOString().split('T')[0]}
              <br />
              { // Visa start- och sluttid utan sekunder genom att ta bort 5 första tecknena
                event.start_time && event.end_time
                  ? `${event.start_time.slice(0, 5)} - ${event.end_time.slice(0, 5)}`
                  : ''}
              <br />
              {// Lägger till description om det finns
                event.description && <em>{event.description}</em>}
              <br />
              {!event.family_member_ids || event.family_member_ids.length === 0
                ? 'Ingen'
                : event.family_member_ids
                  .map(id => familyMembers.find(fm => fm.id === id)?.name)
                  .filter(Boolean) // Ta bort undefined om någon inte hittas
                  .join(', ') //Gör en lista med kommatecken mellan
              }
              <br />
            </EventItem>
          ))}
        </EventList>
      ) : (<p>Inga events skapade än.</p>)
      }
    </EventsFormContainer>
  );
}

export default Events;

// styling
const EventsFormContainer = styled.div`
  max-width: 800px;
  min-width: 350px;
  margin: 2rem auto;
  padding: 2rem;  
  border-radius: 12px;  
  background: transparent;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
  font-size: 28px;
  font-family: 'Indie Flower', Arial, sans-serif;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  input[type="text"],
  input[type="date"],
  textarea {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  background-color: rgb(117, 119, 212);
  color: white;
  font-weight: bold;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgb(91, 201, 133);
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
`;

const NoFamilyMessage = styled.p`
  font-style: italic;
  color: #555;
`;

const EventList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  max-width: 700px;
  min-width: 300px;
  margin: 0 auto;
  `;

const EventItem = styled.li`
position: relative;
border: 1px solid #ccc;
margin: 1em 0;
padding: 1em;
border-radius: 8px;
box-shadow: 0 2px 5px rgba(31, 30, 30, 0.5);
background: linear-gradient(
  135deg,
  rgb(241, 232, 248), 
  rgb(243, 238, 247), 
  rgb(230, 226, 238)   
);
`;

const DeleteButton = styled.button`
position: absolute;
top: 8px;
right: 6px;
font-size: 11px;
background:rgb(116, 112, 111);
color: rgb(255, 255, 255);
cursor: pointer;
padding: 0.15rem .5rem;
border: 1px;
border-radius: 8px;
transition: background - color 0.3s;

  &:hover {
  background: rgb(189, 11, 11);
}
`;
