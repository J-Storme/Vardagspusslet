import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
  event_id: number | null;
  family_member_ids: number[];
  recurring: boolean;
  recurring_weekday?: number[];
}

interface FamilyMember {
  id: number;
  name: string;
  role: string;
  profile_image: string;
}

function WeeklySchedule() {
  // states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedFamilyMemberIdForFilter, setSelectedFamilyMemberIdForFilter] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State för nya uppgifter (inputfält)
  const [isAddingTask, setIsAddingTask] = useState(false); // Lägg till så att lägga-till-formuläret visas ej från början
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSelectedFamilyMemberIds, setNewSelectedFamilyMemberIds] = useState<number[]>([]);
  const [newRecurringWeekday, setNewRecurringWeekday] = useState<number[]>([]);

  const weekdayMap: { [key: string]: number } = {
    måndag: 1,
    tisdag: 2,
    onsdag: 3,
    torsdag: 4,
    fredag: 5,
    lördag: 6,
    söndag: 7,
  };

  // Hämta data när komponenten laddas
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Ingen token hittades, du är inte inloggad');
      setLoading(false);
      return;
    }


    // Hämta tasks
    function fetchTasks() {
      return fetch('http://localhost:8080/api/week-tasks', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(response => {
        console.log('fetchTasks status:', response.status);
        if (!response.ok) {
          throw new Error('Något gick fel vid hämtning av uppgifter');
        }
        return response.json();
      });
    }

    // Hämta familjemedlemmar
    function fetchFamilyMembers() {
      return fetch('http://localhost:8080/api/family-members', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(response => {
        console.log('fetchFamilyMembers status:', response.status);
        if (!response.ok) {
          throw new Error('Något gick fel vid hämtning av familjemedlemmar');
        }
        return response.json();
      });
    }

    function getFamilyMemberNames(ids: number[]): string {
      const names = familyMembers
        .filter(member => ids.includes(member.id))
        .map(member => member.name);
      return names.join(', ');
    }

    // Hämta events
    function fetchEvents() {
      return fetch('http://localhost:8080/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(response => {
        console.log('fetchEvents status:', response.status);
        if (!response.ok) {
          throw new Error('Något gick fel vid hämtning av events');
        }
        return response.json();
      });
    }

    // Hämta allt parallellt
    Promise.all([fetchTasks(), fetchFamilyMembers(), fetchEvents()])
      .then(([tasksData, familyMembersData, eventsData]) => {
        setTasks(tasksData);
        setFamilyMembers(familyMembersData);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError('Kunde inte hämta data från servern');
        setLoading(false);
      });
  }, []);

  // POST Lägg till ny uppgift
  function addTask() {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Du måste vara inloggad för att lägga till uppgifter');
      return;
    }

    // Kontrollera att titel finns
    if (newTitle.trim() === '') {
      alert('Namn på uppgiften måste fyllas i');
      return;
    }

    // const recurringWeekdaysAsNumbers = newRecurringWeekday.map(day => weekdayMap[day]);


    // Skapa objekt för ny uppgift (POST)
    const newTaskToAdd = {
      title: newTitle,
      description: newDescription,
      completed: false,
      family_member_ids: newSelectedFamilyMemberIds,
      recurring: true,
      recurring_weekday: newRecurringWeekday,
    };

    console.log('Skickar ny uppgift med family_member_ids:', newSelectedFamilyMemberIds);
    console.log("Recurring weekdays to send:", newRecurringWeekday);

    fetch('http://localhost:8080/api/week-tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newTaskToAdd),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Misslyckades med att lägga till uppgift');
        }
        return response.json();
      })
      .then(addedTask => {
        console.log('Ny uppgift från server:', addedTask);

        setTasks(prev => {
          // Om prev är en array, använd den, annars tom array
          const safePrev = Array.isArray(prev) ? prev : [];
          return [...safePrev, addedTask];
        });

        console.log("Data som skickas till backend:", newTaskToAdd);

        // Nollställ formulärfält
        setNewTitle('');
        setNewDescription('');
        setNewSelectedFamilyMemberIds([]);
        setIsAddingTask(false); // Stänger formuläret för att skapa uppgift
      })
      .catch(error => {
        console.error(error);
        alert('Något gick fel när uppgiften skulle sparas');
      });
  }


  // PUT Funktion för att uppdatera en uppgift
  function updateTask(updatedTask: Task) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Du måste vara inloggad för att uppdatera uppgifter');
      return;
    }

    fetch(`http://localhost:8080/api/week-tasks/${updatedTask.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedTask),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Misslyckades med att uppdatera uppgift');
        }
        // Uppdatera lokalt state med nya data
        setTasks(prev =>
          prev.map(task =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
      })
      .catch(error => {
        console.error(error);
        alert('Något gick fel när uppgiften skulle uppdateras');
      });
  }

  // Funktion för att bocka av/markera klar eller ej klar
  function toggleTaskCompleted(taskId: number) {
    const task = tasks.find(task => task.id === taskId);
    if (!task) return;

    const updatedTask = { ...task, completed: !task.completed };
    updateTask(updatedTask);
  }

  // DELETE Funktion för att radera uppgift
  function deleteTask(taskId: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Du måste vara inloggad för att radera uppgifter');
      return;
    }

    fetch(`http://localhost:8080/api/week-tasks/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Misslyckades med att radera uppgift');
        }
        setTasks(prev => prev.filter(task => task.id !== taskId));
      })
      .catch(error => {
        console.error(error);
        alert('Något gick fel när uppgiften skulle raderas');
      });
  }

  // Filtrera tasks baserat på vald användare, kolla först om det är en array
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  let filteredTasks;

  if (selectedFamilyMemberIdForFilter === 'all') {
    filteredTasks = safeTasks.filter(task => task.recurring === true);
  } else {
    filteredTasks = safeTasks.filter(task =>
      task.recurring === true && task.family_member_ids.includes(selectedFamilyMemberIdForFilter as number)
    );
  }


  if (loading) return <p>Laddar uppgifter...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      {loading && <p>Laddar...</p>}
      {error && <p >{error}</p>}

      <FormContainer>
        {!loading && !error && (
          <>

            {isAddingTask && (
              <Form>
                <h3>Lägg till ny uppgift</h3>

                <label>
                  Titel: <br />
                  <input
                    type="text"
                    value={newTitle}
                    onChange={event => setNewTitle(event.target.value)}
                  />
                </label>
                <br />

                <label>
                  Beskrivning: <br />
                  <textarea
                    value={newDescription}
                    onChange={event => setNewDescription(event.target.value)}
                  />
                </label>
                <br />

                <StyledFieldset>
                  <legend>Lägg till i veckoschema:</legend>
                  {['måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag'].map(day => {
                    const dayNumber = weekdayMap[day];

                    return (
                      <label key={day} style={{ marginRight: '10px' }}>
                        <input
                          type="checkbox"
                          value={dayNumber.toString()}
                          checked={newRecurringWeekday.includes(dayNumber)}
                          onChange={event => {
                            const checked = event.target.checked;
                            const value = Number(event.target.value);

                            if (isNaN(value)) {
                              return;
                            }

                            if (checked) {
                              setNewRecurringWeekday(prev => {
                                // Undvik duplicering
                                if (!prev.includes(value)) {
                                  return [...prev, value];
                                }
                                return prev;
                              });
                            } else {
                              setNewRecurringWeekday(prev => prev.filter(d => d !== value));
                            }
                          }}
                        />
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </label>
                    );
                  })}
                </StyledFieldset>

                <StyledFieldset>
                  <legend>Koppla till familjemedlem (valfritt):</legend>
                  {familyMembers.map(member => (
                    <label key={member.id} style={{ marginRight: '10px' }}>
                      <input
                        type="checkbox"
                        checked={newSelectedFamilyMemberIds.includes(member.id)}
                        onChange={event => {
                          const isChecked = event.target.checked;
                          if (isChecked) {
                            setNewSelectedFamilyMemberIds(prev => [...prev, member.id]);
                          } else {
                            setNewSelectedFamilyMemberIds(prev => prev.filter(id => id !== member.id));
                          }
                        }}
                      />
                      {member.name}
                    </label>
                  ))}
                </StyledFieldset>

                <SubmitButton type="button" onClick={addTask}>Lägg till uppgift</SubmitButton>
              </Form>
            )}
          </>
        )}
      </FormContainer>

      <Title>Veckoschema</Title>
      <WeeklyScheduleContainer>
        <WeekGrid>
          {['måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag'].map(day => {
            const tasksForDay = filteredTasks.filter(task =>
              Array.isArray(task.recurring_weekday) &&
              task.recurring_weekday.includes(weekdayMap[day])
            );

            return (
              <DayColumn key={day}>
                <DayTitle>{day.charAt(0).toUpperCase() + day.slice(1)}</DayTitle>
                {tasksForDay.length > 0 ? (
                  <ul>
                    {tasksForDay.map(task => (
                      <RecurringTaskItem key={task.id} $completed={task.completed}>
                        <TaskTitle $completed={task.completed}>{task.title}</TaskTitle>
                        {task.description && <Description>{task.description}</Description>}


                        {task.family_member_ids && (
                          <FamilyMembers>
                            {task.family_member_ids
                              .map(id => {
                                const member = familyMembers.find(m => m.id === id);
                                return member ? member.name : 'Okänd';
                              })
                              .join(', ')}
                          </FamilyMembers>
                        )}

                      </RecurringTaskItem>
                    ))}
                  </ul>
                ) : (
                  <p>Inga uppgifter</p>
                )}
              </DayColumn>
            );
          })}
        </WeekGrid>
      </WeeklyScheduleContainer>

      {!isAddingTask && (
        <SubmitButton onClick={ /*För att öppna formuläret */() => setIsAddingTask(true)}>
          Lägg till ny uppgift
        </SubmitButton>
      )}

      <Filter>
        <Title>Uppgifter</Title>
        <div>
          <label>Filtrera på familjemedlem: </label>
          <select
            value={selectedFamilyMemberIdForFilter}
            onChange={event => {
              const value = event.target.value;
              if (value === 'all') {
                setSelectedFamilyMemberIdForFilter('all');
              } else {
                setSelectedFamilyMemberIdForFilter(Number(value));
              }
            }}
          >
            <option value="all">Alla familjemedlemmar</option>
            {familyMembers.map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
        </div>
      </Filter>

    </Container >
  );
}

export default WeeklySchedule;

// Styled Components för enkel styling
const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 1rem;
`;

const Filter = styled.div`
text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 0px;
  `;

const FormContainer = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 1rem;
`;

const Form = styled.div`
  margin-top: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;  
  border: none;
  border: 1px solid #ccc;
  margin: 1em 0;
  padding: 1em;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(31, 30, 30, 0.5);
  background-color: rgb(232, 232, 235);
`;

const Title = styled.h3`
  text-align: center;
  margin-top: 1rem;
`;

const WeeklyScheduleContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.4rem;
  padding: 0 0.5rem;
`;

const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr); 
  gap: 0.2rem;
  margin-top: 2rem;
`;

const DayColumn = styled.div`
  background-color: #f4f4f4;
  border-radius: 10px;
  padding: 0rem;
  min-height: 150px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const DayTitle = styled.h4`
  background-color: rgb(117, 119, 212);
  color: white;
  border-radius: 3px;
  padding: 2px;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const RecurringTaskItem = styled.li<{ $completed: boolean }>`
  border: 1px solid #ccc;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  background-color: ${props => (props.$completed ? '#ddd' : '#fff')};
  color: ${props => (props.$completed ? '#666' : '#000')};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  list-style: none;
  font-size: 0.9rem;
  position: relative;
`;

const TaskTitle = styled.span<{ $completed: boolean }>`
  font-weight: bold;
  text-decoration: ${props => (props.$completed ? 'line-through' : 'none')};
  margin-left: 0.5rem;
`;

const Description = styled.div`
  margin-top: 0.25rem;
  font-style: italic;
`;

const FamilyMembers = styled.div`
  display: flex; 
  justify-content: flex-end;
  margin-top: 0.5rem;
  color: #333;
`;

const StyledFieldset = styled.fieldset`
  border: none; 
  padding: 0;
  margin: 1rem 0;
`;

const DeleteButton = styled.button`
position: absolute;
top: 8px;
right: 6px;
background:rgb(116, 112, 111);
color: rgb(255, 255, 255);
font-size: 11px;
cursor: pointer;
padding: 0.15rem .5rem;
border: 1px;
border-radius: 8px;
transition: background - color 0.3s;

  &:hover {
  background: rgb(189, 11, 11);
}
`;

const SubmitButton = styled.button`
  background-color: rgb(117, 119, 212);
  color: white;
  font-weight: bold;
  padding: 0.75rem 1.25rem;
  margin-top: 10px;
  margin-left: auto;
  display: block;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color:rgb(115, 221, 120);
  }
`;