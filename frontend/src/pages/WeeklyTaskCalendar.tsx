
/*
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';


function getWeekDates() {
  const now = new Date();
  const day = now.getDay(); // 0=Sunday
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function WeeklyTaskCalendar() {
  const [singleTasks, setSingleTasks] = useState([]);
  const [recurringTasks, setRecurringTasks] = useState([]);
  const weekDates = getWeekDates();

  useEffect(() => {
    async function fetchTasks() {
      const res = await fetch('/api/week-tasks');
      if (res.ok) {
        const data = await res.json();
        setSingleTasks(data.singleTasks);
        setRecurringTasks(data.recurringTasks);
      }
    }
    fetchTasks();
  }, []);

  return (
    <CalendarWrapper>
      {weekDates.map((date, idx) => {
        const dateStr = date.toISOString().slice(0, 10);
        // Engångs-uppgifter på denna dag
        const tasksForDay = singleTasks.filter(
          (task) => task.due_date === dateStr
        );
        // Återkommande uppgifter för veckodag (0 = måndag i backend)
        const recurringForDay = recurringTasks.filter(
          (task) => task.recurring_weekday === idx
        );

        return (
          <DayColumn key={dateStr}>
            <DayTitle>
              {date.toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'numeric' })}
            </DayTitle>

            {tasksForDay.map((task) => (
              <TaskItem key={task.id} completed={task.completed}>
                {task.title}
              </TaskItem>
            ))}

            {recurringForDay.map((task) => (
              <TaskItem key={`r-${task.id}`} completed={task.completed}>
                {task.title} (återkommande)
              </TaskItem>
            ))}
          </DayColumn>
        );
      })}
    </CalendarWrapper>
  );
}


const CalendarWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const DayColumn = styled.div`
  flex: 1;
  border: 1px solid #ccc;
  padding: 8px;
  min-height: 150px;
`;

const DayTitle = styled.h3`
  margin-top: 0;
  text-align: center;
`;

const TaskItem = styled.div<{ completed?: boolean }>`
  background: ${({ completed }) => (completed ? '#d3ffd3' : '#fff')};
  border: 1px solid #ccc;
  padding: 4px;
  margin-bottom: 4px;
  border-radius: 4px;
`;

*/