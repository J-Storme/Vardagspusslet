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
  recurring_weekdays?: number[];
  category_id: number | null;
  category_name?: string;
  category_color?: string;
  category_icon?: string;
  family_members?: FamilyMember[];
}

interface FamilyMember {
  id: number;
  name: string;
  role: string;
  profile_image: string;
}

interface Category {
  id: number;
  name: string;
  color: string;
}

function WeeklySchedule() {
  // states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedFamilyMemberIdForFilter, setSelectedFamilyMemberIdForFilter] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryForFilter, setSelectedCategoryForFilter] = useState<string>('all');
  const [isAddingTask, setIsAddingTask] = useState(false); // Lägg till så att lägga-till-formuläret visas ej från början


  // State för nya uppgifter från formulär
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSelectedFamilyMemberIds, setNewSelectedFamilyMemberIds] = useState<number[]>([]);
  const [newRecurringWeekday, setNewRecurringWeekday] = useState<number[]>([]);
  const [newCategoryId, setNewCategoryId] = useState<number | null>(null);

  const weekdayMap: { [key: string]: number } = {
    måndag: 1,
    tisdag: 2,
    onsdag: 3,
    torsdag: 4,
    fredag: 5,
    lördag: 6,
    söndag: 7,
  };

  const token = localStorage.getItem('token');


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

  // Hämta kategorier
  function fetchCategories() {
    return fetch('http://localhost:8080/api/categories', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(response => {
      console.log('fetchCategories status:', response.status);
      if (!response.ok) {
        throw new Error('Kunde inte hämta kategorier');
      }
      return response.json();
    });
  }

  // Hämta data när komponenten laddas
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Ingen token hittades, du är inte inloggad');
      setLoading(false);
      return;
    }

    // Hämta allt parallellt
    Promise.all([fetchTasks(), fetchFamilyMembers(), fetchCategories()])
      .then(([tasksData, familyMembersData, categoriesData]) => {
        console.log('categoriesData från backend:', categoriesData);
        console.log('tasksData från backend:', tasksData);
        if (Array.isArray(tasksData.recurringTasks)) {
          setTasks(tasksData.recurringTasks);
        } else {
          console.warn('recurringTasks är inte en array:', tasksData.recurringTasks);
        }
        setFamilyMembers(familyMembersData);
        setCategories(categoriesData);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError('Kunde inte hämta data från servern');
        setLoading(false);
      });
  }, [token]);





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

    // Skapa objekt för ny uppgift (POST)
    const newTaskToAdd = {
      title: newTitle,
      description: newDescription,
      completed: false,
      family_member_ids: newSelectedFamilyMemberIds,
      recurring: true,
      recurring_weekdays: newRecurringWeekday,
      category_id: newCategoryId
    };

    //console.log('Skickar ny uppgift med family_member_ids:', newSelectedFamilyMemberIds);
    //console.log("Recurring weekdays to send:", newRecurringWeekday);

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
        // Lägger till uppgiften i arrayen, previous hämtar föregående värde av Tasks state innan uppdatering
        setTasks(previous => {
          // Om previous är en array, använd den, annars tom array
          const safePrev = Array.isArray(previous) ? previous : [];
          return [...safePrev, addedTask];
        });

        console.log("Data som skickas till backend:", newTaskToAdd);

        // Nollställ formulärfält
        setNewTitle('');
        setNewDescription('');
        setNewSelectedFamilyMemberIds([]);
        setNewCategoryId(null);
        setNewRecurringWeekday([]);
        setIsAddingTask(false); // Stänger formuläret för att skapa uppgift
      })
      .catch(error => {
        console.error(error);
        alert('Något gick fel när uppgiften skulle sparas');
      });
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
  console.log('Original tasks:', safeTasks);

  const filteredTasks = safeTasks.filter(task => {
    const isRecurring = Array.isArray(task.recurring_weekdays) && task.recurring_weekdays.length > 0;

    if (!isRecurring) {
      return false; // Endast uppgifter med återkommande veckodagar visas
    }

    // Kontrollera familjemedlemsfilter
    const matchesFamilyMember = selectedFamilyMemberIdForFilter === 'all' ||
      (Array.isArray(task.family_members) && task.family_members.some(member => member.id === selectedFamilyMemberIdForFilter));


    // Kontrollera kategori-filter
    const matchesCategory = selectedCategoryForFilter === 'all'
      || (task.category_name && task.category_name === selectedCategoryForFilter);

    // Båda filter måste stämma för att visa uppgiften
    return matchesFamilyMember && matchesCategory;
  });


  /*
  const filteredTasks = safeTasks.filter(task => {
    const isRecurring = Array.isArray(task.recurring_weekdays) && task.recurring_weekdays.length > 0;
    if (selectedFamilyMemberIdForFilter === 'all') {
      return isRecurring;
    }
    return isRecurring && task.family_member_ids.includes(selectedFamilyMemberIdForFilter as number);
  });

  */

  console.log('Filtered tasks:', filteredTasks);


  if (loading) return <p>Laddar uppgifter...</p>;
  if (error) return <p>{error}</p>;



  function getFamilyMemberNamesFromObjects(familyMembersObjects: { id: number; name: string }[]): string {
    if (!Array.isArray(familyMembersObjects)) return '';
    const names = familyMembersObjects.map(member => member.name);
    return names.join(', ');
  }


  // PUT, uppdatera checkbox
  function toggleTaskCompleted(task: Task) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Du måste vara inloggad');
      return;
    }

    // Skapa ny version av task med togglad completed
    const updatedTask = {
      ...task,
      completed: !task.completed,
    };

    fetch(`http://localhost:8080/api/week-tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedTask),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Kunde inte uppdatera uppgiften');
        }
        return response.json();
      })
      .then(() => {
        // Uppdatera lokalt tillstånd
        setTasks(previousTasks =>
          previousTasks.map(t =>
            t.id === task.id ? { ...t, completed: updatedTask.completed } : t
          )
        );
      })
      .catch(error => {
        console.error('Fel vid PUT:', error);
      });
  }

  const testFilteredTasks = filteredTasks;


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
                <CancelButton type="button" onClick={() => setIsAddingTask(false)}>x</CancelButton>

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

                <StyledFieldset>
                  <label>
                    Kategori: <br />
                    <select
                      value={newCategoryId ?? ''}
                      onChange={event => {
                        const val = event.target.value;
                        setNewCategoryId(val !== '' ? Number(val) : null);
                      }}
                    >
                      <option value="">Ingen kategori</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <br />
                </StyledFieldset>


                <SubmitButton type="button" onClick={addTask}>Lägg till uppgift</SubmitButton>
              </Form>
            )}
          </>
        )}
      </FormContainer>

      <Title>Veckoschema</Title>

      <Filter>
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

        <div>
          <label>Filtrera på kategori: </label>
          <select
            value={selectedCategoryForFilter}
            onChange={event => setSelectedCategoryForFilter(event.target.value)}
          >
            <option value="all">Alla kategorier</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>
      </Filter>

      <WeeklyScheduleContainer>
        <WeekGrid>
          {['måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag'].map(day => {
            const tasksForDay = testFilteredTasks.filter(task =>
              Array.isArray(task.recurring_weekdays) &&
              task.recurring_weekdays.map(Number).includes(weekdayMap[day])
            );

            console.log(`Tasks for ${day}:`, tasksForDay);

            return (
              <DayColumn key={day}>
                <DayTitle>{day.charAt(0).toUpperCase() + day.slice(1)}</DayTitle>
                {tasksForDay.length > 0 ? (
                  <ul>
                    {tasksForDay.map(task => {
                      // Om ingen kategori finns, fallback till ljusgrå
                      const categoryColor = task.category_color ?? '#ccc';

                      // Returnera JSX för just den här tasken
                      return (
                        <RecurringTaskItem
                          key={task.id}
                          $completed={task.completed}
                          $categoryColor={categoryColor}
                        >
                          <BoxContainers>
                            <CheckboxStyled><input type="checkbox" checked={task.completed} onChange={() => toggleTaskCompleted(task)} /></CheckboxStyled>
                            <DeleteButton onClick={() => deleteTask(task.id)}>x</DeleteButton>
                          </BoxContainers>
                          <TaskTitle $completed={task.completed}>{task.title}</TaskTitle>
                          {task.description && <Description>{task.description}</Description>}

                          {task.family_members && task.family_members.length > 0 && (
                            <FamilyMembers>
                              {getFamilyMemberNamesFromObjects(task.family_members)}
                            </FamilyMembers>
                          )}


                        </RecurringTaskItem>
                      );
                    })}
                  </ul>
                ) : (
                  <p></p>
                )}
              </DayColumn>
            );
          })}
        </WeekGrid>

      </WeeklyScheduleContainer>

      {!isAddingTask && (
        <SubmitButton onClick={() => setIsAddingTask(true)}>
          Lägg till ny uppgift
        </SubmitButton>
      )}

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
  font-size: 28px;
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
  margin-top: 1rem;
`;

const DayColumn = styled.div`
  background-color: #f4f4f4;
  border-radius: 10px;
  padding: 0rem;
  min-width: 90px;
  min-height: 300px;
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

const RecurringTaskItem = styled.li<{ $completed: boolean; $categoryColor: string }>`
  border: 1px solid #ccc;
  padding: 0.75rem;
  margin-bottom: 0.3rem;
  border-radius: 8px;
  background-color: ${props => (props.$completed ? '#ddd' : props.$categoryColor)};
  color: ${props => (props.$completed ? '#666' : '#000')};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  list-style: none;
  font-size: 0.9rem;
  position: relative;
`;

const BoxContainers = styled.div`
  display: flex; 
  justify-content: space-between;
  align-items: center;
  width: 100%;
  `;

const TaskTitle = styled.span<{ $completed: boolean }>`
  display: flex; 
  justify-content: flex-start;
  word-break: break-word;     
  white-space: normal; 
  font-weight: bold;
  font-size: 14px;    
  font-family: 'Indie Flower', Arial, sans-serif;
  text-decoration: ${props => (props.$completed ? 'line-through' : 'none')};
  margin-top: 0.4rem;
`;

const CheckboxStyled = styled.div`
  display: flex;
  align-items: center;

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    accent-color: rgb(117, 119, 212); 
    cursor: pointer;
  }
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
  Font-style: arial;
  font-size: 11px;
`;

const StyledFieldset = styled.fieldset`
  border: none; 
  padding: 0;
  margin: 1rem 0;
`;

const DeleteButton = styled.button`
display: flex; 
justify-content: space-between;

background:rgb(116, 112, 111);
color: rgb(255, 255, 255);
font-size: 10px;
cursor: pointer;
padding: 0.13rem .4rem;
border: 1px;
border-radius: 6px;

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
  
  &:hover {
    background-color:rgb(115, 221, 120);
  }
`;

const CancelButton = styled.button`
  background-color: rgb(117, 119, 212);
  color: white;
  font-weight: bold;
  padding: 0.7rem 1rem;
  margin-top: 0px;
  margin-left: auto;
  display: block;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background-color:rgb(115, 221, 120);
  }
`;