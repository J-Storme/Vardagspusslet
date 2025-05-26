import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from 'react';

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
    </div>
  );
}

export default CalendarView;
