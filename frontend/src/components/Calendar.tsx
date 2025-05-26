import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

function CalendarView() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/events')
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  return (
    <div>
      <CalendarContainer>
        <Calendar value={date} onChange={(value) => {
          if (value instanceof Date) setDate(value);
        }} />
        <h3>Dagens händelser:</h3>
        <ul>
          {date &&
            events
              .filter(e => new Date(e.date).toDateString() === date.toDateString())
              .map(e => <li key={e.id}>{e.title}</li>)
          }
        </ul>
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