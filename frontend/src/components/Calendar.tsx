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

  // För att filtrera dagens händelser
  const todaysEvents = events.filter(e =>
    date && new Date(e.date).toDateString() === date.toDateString()
  );

  return (
    <div>
      <CalendarContainer>
        <Calendar value={date} onChange={(value) => {
          if (value instanceof Date) setDate(value);
        }} />
        {date && (
          todaysEvents.length > 0 ? (
            <>
              <h3>Dagens händelser:</h3>
              <ul>
                {todaysEvents.map(e => (
                  <li key={e.id}>{e.title}</li>
                ))}
              </ul>
            </>
          ) : (<p>Du har inga händelser.</p>)
        )}
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