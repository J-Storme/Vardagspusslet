import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Event, FamilyMember } from '../types';

type Props = {
  events: Event[];
  familyMembers: FamilyMember[];
};


function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}

function CalendarView({ events, familyMembers }: Props) {
  const [date, setDate] = useState(new Date());

  if (!events || !familyMembers) {
    return <p>Laddar kalenderdata...</p>;
  }

  // Filtrera events för det valda datumet
  const selectedDateEvents = events.filter((event) => {
    const eventDate = new Date(event.event_date);
    return !isNaN(eventDate.getTime()) && isSameDay(eventDate, date);
  })

  return (
    <div>
      <CalendarContainer>
        <Calendar
          value={date}
          onChange={(value) => {
            if (value instanceof Date) setDate(value);
          }}
        />
      </CalendarContainer>


      <DailyEventList>
        <h3>Dagens händelser:</h3>
        {selectedDateEvents.length > 0 ? (
          selectedDateEvents.map((event) => {
            const memberNames = (event.family_member_ids ?? [])
              .map((id) => {
                const member = familyMembers.find((m) => m.id === id);
                return member ? member.name : null;
              })
              .filter((name) => name !== null)
              .join(', ');

            return (
              <EventItem key={event.id}>
                {event.title} — {memberNames}
              </EventItem>
            );
          })
        ) : (
          <p>Inga händelser denna dag.</p>
        )}
      </DailyEventList>
    </div>
  );
}

export default CalendarView;

const CalendarContainer = styled.div`
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
`;

const DailyEventList = styled.div`
  max-width: 350px;
  margin: 0.5rem auto;
  padding: 1rem;
  background:rgb(117, 119, 212);
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(31, 30, 30, 0.5);
`;

const EventItem = styled.div`
  margin-bottom: 1rem; 
  margin-top: 1rem;  
  color: #fff;
  font-family: 'Indie Flower', cursive;   
`;


/*function CalendarView() {
  const [date, setDate] = useState<Date | null>(new Date());



  return (
    <div>
      <CalendarContainer>
        <Calendar value={date} onChange={(value) => {
          if (value instanceof Date) setDate(value);
        }} />
      </CalendarContainer>
    </div>
  );
}

export default CalendarView;

//Styling
const CalendarContainer = styled.div`
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
*/