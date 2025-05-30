import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

function CalendarView() {
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