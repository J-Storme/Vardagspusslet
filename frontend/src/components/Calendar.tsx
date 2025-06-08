import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';
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
  });

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
  padding: 5px;
  margin: 0.6rem auto;
  max-width: 400px;
  border-radius: 10px;
  overflow: hidden;

  /* Bakgrund och text */
  .react-calendar {
    background: rgb(117, 119, 212);
    color: #ddd;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(55, 55, 59, 0.7);
  }

  /* Navigation */
  .react-calendar__navigation {
    background: rgb(60, 43, 138);
    display: flex;
    justify-content: center;
    border-radius: 10px;
    gap: 1rem;
  }

  .react-calendar__navigation button {
    color: #d8caff;
    min-width: 44px;
    background: transparent;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 5px;
    transition: background 0.3s;
  }

  .react-calendar__navigation button:hover {
    background: #7c66cc;
  }

  /* Veckodagar */
  .react-calendar__month-view__weekdays {
    background: rgb(80, 63, 158);
    color: #c5b8ff;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 0.85rem;
    font-family: 'Indie Flower', cursive;
  }

  /* Grid för dagrutor */
  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }

  /* Dag-rutor */
  .react-calendar__tile {
    background: rgb(98, 80, 177);
    color: white;
    border-radius: 8px;
    width: 100%;
    aspect-ratio: 1 / 1;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition:
      background 0.3s,
      color 0.3s;
    box-sizing: border-box;
  }

  .react-calendar__tile:hover {
    background: #9d87ff;
    color: #2e1a6f;
  }

  /* Vald dag */
  .react-calendar__tile--active {
    background: rgb(229, 173, 255) !important;
    color: #2e1a6f;
    font-weight: bold;
    box-shadow: 0 0 8px #b799ff;
  }

  /* Dagar utanför aktuell månad */
  .react-calendar__tile--neighboringMonth {
    color: rgb(193, 184, 230);
  }
`;

const DailyEventList = styled.div`
max - width: 350px;
margin: 0.5rem auto;
padding: 1rem;
background: rgb(117, 119, 212);
color: #fff;
border-radius: 8px;
box-shadow: 0 2px 5px rgba(31, 30, 30, 0.5);

h3 {
font-family: 'Indie Flower', cursive;}
`;

const EventItem = styled.div`
  margin-bottom: 1rem;
  margin-top: 1rem;
  color: #fff;
  font-family: 'Indie Flower', cursive;
`;
