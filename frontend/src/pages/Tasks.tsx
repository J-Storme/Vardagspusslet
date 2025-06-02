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
  recurring_weekdays?: string[];
}

interface FamilyMember {
  id: number;
  name: string;
  role: string;
  profile_image: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  user_id: number;
  family_member_id: number;
  category_id: number;
}

function Tasks() {
  // states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedFamilyMemberIdForFilter, setSelectedFamilyMemberIdForFilter] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State för nya uppgifter (inputfält)
  const [isAddingTask, setIsAddingTask] = useState(false); // Lägg till så att lägga-till-formuläret visas ej från början
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newSelectedFamilyMemberIds, setNewSelectedFamilyMemberIds] = useState<number[]>([]);
  const [newSelectedEventId, setNewSelectedEventId] = useState<number | null>(null);
  const [newRecurring, setNewRecurring] = useState(false);
  const [newRecurringWeekday, setNewRecurringWeekday] = useState<string[]>([]);


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
      return fetch('http://localhost:8080/api/tasks', {
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
        setEvents(eventsData);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError('Kunde inte hämta data från servern');
        setLoading(false);
      });
  }, []);

  // Lägg till ny uppgift
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

    // Skapa objekt för ny uppgift (POST)
    const newTaskToAdd = {
      title: newTitle,
      description: newDescription,
      due_date: newRecurring ? '' : newDueDate, // om återkommande, sätt tomt datum
      completed: false,
      family_member_ids: newSelectedFamilyMemberIds,
      event_id: newSelectedEventId,
      recurring: newRecurring,
      recurring_weekdays: newRecurring ? newRecurringWeekday : []
    };



    console.log('Skickar ny uppgift med family_member_ids:', newSelectedFamilyMemberIds);

    fetch('http://localhost:8080/api/tasks', {
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

        setTasks(prev => [...prev, addedTask]);

        // Nollställ formulärfält
        setNewTitle('');
        setNewDescription('');
        setNewDueDate('');
        setNewSelectedFamilyMemberIds([]);
        setNewSelectedEventId(null);
        setIsAddingTask(false); // Stänger formuläret för att skapa uppgift
      })
      .catch(error => {
        console.error(error);
        alert('Något gick fel när uppgiften skulle sparas');
      });
  }


  // Funktion för att uppdatera en uppgift (t.ex. bocka av, ändra info)
  function updateTask(updatedTask: Task) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Du måste vara inloggad för att uppdatera uppgifter');
      return;
    }

    fetch(`http://localhost:8080/api/tasks/${updatedTask.id}`, {
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

  // Funktion för att radera uppgift
  function deleteTask(taskId: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Du måste vara inloggad för att radera uppgifter');
      return;
    }

    fetch(`http://localhost:8080/api/tasks/${taskId}`, {
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

  // Events ändringar
  function handleEventChange(eventId: number) {
    setNewSelectedEventId(eventId);
  }

  // Filtrera tasks baserat på vald användare
  const filteredTasks = selectedFamilyMemberIdForFilter === 'all'
    ? tasks
    : tasks.filter(data => data.family_member_ids.includes(selectedFamilyMemberIdForFilter as number));

  // Veckodags tasks
  const recurringTasks = filteredTasks.filter(task => task.recurring);

  // Vanliga tasks
  const normalTasks = filteredTasks.filter(task => !task.recurring);

  // Veckoschema
  const weekdaysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const weekdayNames: Record<string, string> = {
    monday: 'Måndag',
    tuesday: 'Tisdag',
    wednesday: 'Onsdag',
    thursday: 'Torsdag',
    friday: 'Fredag',
    saturday: 'Lördag',
    sunday: 'Söndag',
  };

  if (loading) return <p>Laddar uppgifter...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      {loading && <p>Laddar...</p>}
      {error && <p >{error}</p>}

      <FormContainer>
        {!loading && !error && (
          <>
            {!isAddingTask && (
              <SubmitButton onClick={ /*För att öppna formuläret */() => setIsAddingTask(true)}>
                Lägg till nytt event
              </SubmitButton>
            )}

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

                { /* <label>
                Klar senast: <br />
                <input
                  type="date"
                  value={newDueDate}
                  onChange={event => setNewDueDate(event.target.value)}
                />
              </label> */}
                <br />

                <fieldset>
                  <legend>Lägg till i veckoschema:</legend>
                  {['måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag'].map(day => (
                    <label key={day} style={{ marginRight: '10px' }}>
                      <input
                        type="checkbox"
                        value={day}
                        checked={newRecurringWeekday.includes(day)}
                        onChange={event => {
                          const checked = event.target.checked;
                          const value = event.target.value;

                          if (checked) {
                            setNewRecurringWeekday(prev => [...prev, value]);
                          } else {
                            setNewRecurringWeekday(prev => prev.filter(d => d !== value));
                          }
                        }}
                      />
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </label>
                  ))}
                </fieldset>

                {!newRecurring && (
                  <label>
                    Klar senast: <br />
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={event => setNewDueDate(event.target.value)}
                    />
                  </label>
                )}

                <fieldset>
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
                </fieldset>

                <fieldset>
                  <legend>Koppla till event (valfritt):</legend>
                  <select
                    value={newSelectedEventId ?? ''}
                    onChange={event => setNewSelectedEventId(Number(event.target.value))}
                  >
                    <option value="">Ingen</option>
                    {events.map(e => (
                      <option key={e.id} value={e.id}>{e.title}</option>
                    ))}
                  </select>
                </fieldset>

                <button type="button" onClick={addTask}>Lägg till uppgift</button>
              </Form>
            )}
          </>
        )}
      </FormContainer>


      <WeeklySchedule>
        <h3>Veckoschema</h3>
        {['måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag'].map(day => {
          const tasksForDay = tasks.filter(task =>
            Array.isArray(task.recurring_weekdays) && task.recurring_weekdays.includes(day)
          );

          return (
            <div key={day}>
              <h4>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
              {tasksForDay.length > 0 ? (
                <ul>
                  {tasksForDay.map(task => (
                    <li key={task.id}>{task.title}</li>
                  ))}
                </ul>
              ) : (
                <p>Inga uppgifter</p>
              )}
            </div>
          );
        })}
      </WeeklySchedule>

      <Filter>
        <h2>Uppgifter</h2>
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

      { /* Visnings-lista av uppgifter/ tasks */}
      <TaskList>
        {filteredTasks.map(task => (
          <TaskItem key={task.id} $completed={task.completed}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompleted(task.id)}
            />
            <TaskTitle $completed={task.completed}>{task.title}</TaskTitle>
            { /* Skapa ett Date-objekt med newDate(), omvandla till ISO-string .split('T' delar upp strängen i två delar,
              och [0] tar första delen av arrayen som är datumet*/}

            {task.due_date && <DueDate>Klar senast: {new Date(task.due_date).toISOString().split('T')[0]}</DueDate>}
            {task.description && <Description>{task.description}</Description>}

            {/* Visa familjemedlemmar kopplade till uppgiften */}
            <FamilyMembers>
              {Array.isArray(task.family_member_ids) && task.family_member_ids.length > 0 ? (
                (() => {
                  const assignedNames = task.family_member_ids.map(id => {
                    const member = familyMembers.find(m => m.id === id);
                    return member ? member.name : "Okänd medlem";
                  }).join(", ");

                  return <p> {assignedNames}</p>;
                })()
              ) : (
                <p>Ofördelad uppgift</p>
              )}
            </FamilyMembers>

            {/* Visa kopplade events */}
            {task.event_id && (
              <EventList>
                <strong>Event:</strong>{' '}
                {events.find(event => event.id === task.event_id)?.title ?? '(okänt event)'}
              </EventList>
            )}

            <DeleteButton onClick={() => deleteTask(task.id)}>Radera</DeleteButton>
          </TaskItem>
        ))}
        {filteredTasks.length === 0 && <p>Inga uppgifter att visa.</p>}
      </TaskList>
    </Container >
  );
}

export default Tasks;

// Styled Components för enkel styling
const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 1rem;
`;

const Filter = styled.div`
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
  border: 1px solid #ccc;
`;

const WeeklySchedule = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 1rem;
`;

const TaskList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const TaskItem = styled.li<{ $completed: boolean }>`
  border: 1px solid #ccc;
  margin: 1em 0;
  padding: 1em;
  color:  ${props => (props.$completed ? 'rgb(134, 134, 134)' : 'rgb(0, 0, 0)')};
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(31, 30, 30, 0.5);
  background-color: ${props => (props.$completed ? 'rgb(209, 209, 209)' : ' #f9f9f9')};
`;

const TaskTitle = styled.span<{ $completed: boolean }>`
  font-weight: bold;
  text-decoration: ${props => (props.$completed ? 'line-through' : 'none')};
  margin-left: 0.5rem;
`;

const DueDate = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const Description = styled.div`
  margin-top: 0.25rem;
  font-style: italic;
`;

const EventList = styled.div`
  font-size: 0.85rem;
  margin-top: 0.25rem;
`;

const FamilyMembers = styled.div`
  text-align: right;
  margin-top: 0.5rem;
  margin-left: 10rem;
  color: #333;
`;

const DeleteButton = styled.button`
  margin-left: 1rem;
  color: white;
  background-color: red;
  border: none;
  padding: 0.2rem 0.6rem;
  cursor: pointer;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  background-color: #4caf50;
  color: white;
  font-weight: bold;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #43a047;
  }
`;