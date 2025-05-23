import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Typ för en uppgift
interface Task {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  completed: boolean;
}


const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hämta uppgifter när komponenten laddas
  useEffect(() => {
    fetch('http://localhost:8080/tasks') // Hämta från backend
      .then(response => {
        if (!response.ok) {
          throw new Error('Något gick fel vid hämtning');
        }
        return response.json(); // Konvertera svaret till JSON
      })
      .then(data => {
        setTasks(data); // Spara uppgifterna i state
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError('Kunde inte hämta uppgifter');
        setLoading(false);
      });
  }, []);

  // Markera uppgift som klar/ej klar
  const toggleTask = (id: number) => {
    fetch(`http://localhost:8080/tasks/${id}/toggle`, {
      method: 'PATCH',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Misslyckades med att uppdatera uppgift');
        }
        setTasks(prev =>
          prev.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
          )
        );
      })
      .catch(err => {
        console.error(err);
      });
  };

  // Radera uppgift
  const deleteTask = (id: number) => {
    fetch(`http://localhost:8080/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Misslyckades med att radera uppgift');
        }
        setTasks(prev => prev.filter(task => task.id !== id));
      })
      .catch(err => {
        console.error(err);
      });
  };

  if (loading) return <p>Laddar uppgifter...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      <h2>Uppgifter</h2>
      // Om det inte finn snågra uppgifter visas denna
      {tasks.length === 0 && <p>Inga uppgifter hittades.</p>}
      {tasks.map(task => (
        <TaskCard key={task.id} completed={task.completed}>
          <h3>{task.title}</h3>
          {task.description && <p>{task.description}</p>}
          {task.due_date && <p><strong>Deadline:</strong> {task.due_date}</p>}
          <ButtonGroup>
            <ToggleButton onClick={() => toggleTask(task.id)} completed={task.completed}>
              {task.completed ? 'Ej klar' : 'Markera klar'}
            </ToggleButton>
            <DeleteButton onClick={() => deleteTask(task.id)}>
              Radera
            </DeleteButton>
          </ButtonGroup>
        </TaskCard>
      ))}
    </Container>
  );
};

export default Tasks;

// styling
const Container = styled.div`
  padding: 2rem;
`;

const TaskCard = styled.div<{ completed: boolean }>`
  border: 1px solid #ccc;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${({ completed }) => (completed ? '#e0ffe0' : '#fff')};

  h3 {
    text-decoration: ${({ completed }) => (completed ? 'line-through' : 'none')};
  }
`;

const ButtonGroup = styled.div`
  margin-top: 1rem;
`;

const ToggleButton = styled.button<{ completed: boolean }>`
  background-color: ${({ completed }) => (completed ? '#2ecc71' : '#bdc3c7')};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin-left: 10px;
  cursor: pointer;
`;
