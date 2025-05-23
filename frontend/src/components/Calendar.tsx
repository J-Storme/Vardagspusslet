import { useEffect, useRef } from 'react';
import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';

type Event = {
  id: string;
  calendarId: string;
  title: string;
  category: 'time' | 'allday';
  start: string;
  end: string;
};

function CalendarView() {
  const calendarRef = useRef<any>(null);

  useEffect(() => {
    fetch('http://localhost:8080/')
      .then(res => res.json())
      .then((data: Event[]) => {
        const calendarInstance = calendarRef.current?.getInstance();
        if (calendarInstance) {
          calendarInstance.clear(); // tar bort gamla händelser
          calendarInstance.createSchedules(data as any[]); // Lägg till nya
        }
      });
  }, []);

  return (
    <div>
      <h2>Min kalender</h2>
      <Calendar
        height="800px"
        view="week"
        ref={calendarRef}
        theme="light"
        calendars={[
          {
            id: '1',
            name: 'Standard',
            backgroundColor: '#03bd9e',
          }
        ]}
        template={{
          time(event) {
            return `${event.title}`;
          }
        }}
        week={{
          showTimezoneCollapseButton: true,
        }}
      />
    </div>
  );
};


export default CalendarView;
