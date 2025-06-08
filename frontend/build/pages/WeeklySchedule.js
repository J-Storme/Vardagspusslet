var __makeTemplateObject =
  (this && this.__makeTemplateObject) ||
  function (cooked, raw) {
    if (Object.defineProperty) {
      Object.defineProperty(cooked, 'raw', { value: raw });
    } else {
      cooked.raw = raw;
    }
    return cooked;
  };
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
function WeeklySchedule() {
  // states
  var _a = useState([]),
    tasks = _a[0],
    setTasks = _a[1];
  var _b = useState([]),
    familyMembers = _b[0],
    setFamilyMembers = _b[1];
  var _c = useState('all'),
    selectedFamilyMemberIdForFilter = _c[0],
    setSelectedFamilyMemberIdForFilter = _c[1];
  var _d = useState(true),
    loading = _d[0],
    setLoading = _d[1];
  var _e = useState(null),
    error = _e[0],
    setError = _e[1];
  var _f = useState([]),
    categories = _f[0],
    setCategories = _f[1];
  var _g = useState('all'),
    selectedCategoryForFilter = _g[0],
    setSelectedCategoryForFilter = _g[1];
  var _h = useState(false),
    isAddingTask = _h[0],
    setIsAddingTask = _h[1]; // Lägg till så att lägga-till-formuläret visas ej från början
  // State för nya uppgifter från formulär
  var _j = useState(''),
    newTitle = _j[0],
    setNewTitle = _j[1];
  var _k = useState(''),
    newDescription = _k[0],
    setNewDescription = _k[1];
  var _l = useState([]),
    newSelectedFamilyMemberIds = _l[0],
    setNewSelectedFamilyMemberIds = _l[1];
  var _m = useState([]),
    newRecurringWeekday = _m[0],
    setNewRecurringWeekday = _m[1];
  var _o = useState(null),
    newCategoryId = _o[0],
    setNewCategoryId = _o[1];
  var weekdayMap = {
    måndag: 1,
    tisdag: 2,
    onsdag: 3,
    torsdag: 4,
    fredag: 5,
    lördag: 6,
    söndag: 7,
  };
  var token = localStorage.getItem('token');
  // Hämta tasks
  function fetchTasks() {
    return fetch('http://localhost:8080/api/week-tasks', {
      headers: { Authorization: 'Bearer '.concat(token) },
    }).then(function (response) {
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
      headers: { Authorization: 'Bearer '.concat(token) },
    }).then(function (response) {
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
      headers: { Authorization: 'Bearer '.concat(token) },
    }).then(function (response) {
      console.log('fetchCategories status:', response.status);
      if (!response.ok) {
        throw new Error('Kunde inte hämta kategorier');
      }
      return response.json();
    });
  }
  // Hämta data när komponenten laddas
  useEffect(
    function () {
      var token = localStorage.getItem('token');
      if (!token) {
        setError('Ingen token hittades, du är inte inloggad');
        setLoading(false);
        return;
      }
      // Hämta allt parallellt
      Promise.all([fetchTasks(), fetchFamilyMembers(), fetchCategories()])
        .then(function (_a) {
          var tasksData = _a[0],
            familyMembersData = _a[1],
            categoriesData = _a[2];
          console.log('categoriesData från backend:', categoriesData);
          console.log('tasksData från backend:', tasksData);
          if (Array.isArray(tasksData.recurringTasks)) {
            setTasks(tasksData.recurringTasks);
          } else {
            console.warn(
              'recurringTasks är inte en array:',
              tasksData.recurringTasks,
            );
          }
          setFamilyMembers(familyMembersData);
          setCategories(categoriesData);
          setLoading(false);
        })
        .catch(function (error) {
          console.error(error);
          setError('Kunde inte hämta data från servern');
          setLoading(false);
        });
    },
    [token],
  );
  // POST Lägg till ny uppgift
  function addTask() {
    var token = localStorage.getItem('token');
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
    var newTaskToAdd = {
      title: newTitle,
      description: newDescription,
      completed: false,
      family_member_ids: newSelectedFamilyMemberIds,
      recurring: true,
      recurring_weekdays: newRecurringWeekday,
      category_id: newCategoryId,
    };
    //console.log('Skickar ny uppgift med family_member_ids:', newSelectedFamilyMemberIds);
    //console.log("Recurring weekdays to send:", newRecurringWeekday);
    fetch('http://localhost:8080/api/week-tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer '.concat(token),
      },
      body: JSON.stringify(newTaskToAdd),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Misslyckades med att lägga till uppgift');
        }
        return response.json();
      })
      .then(function (addedTask) {
        console.log('Ny uppgift från server:', addedTask);
        // Lägger till uppgiften i arrayen, previous hämtar föregående värde av Tasks state innan uppdatering
        setTasks(function (previous) {
          // Om previous är en array, använd den, annars tom array
          var safePrev = Array.isArray(previous) ? previous : [];
          return __spreadArray(
            __spreadArray([], safePrev, true),
            [addedTask],
            false,
          );
        });
        console.log('Data som skickas till backend:', newTaskToAdd);
        // Nollställ formulärfält
        setNewTitle('');
        setNewDescription('');
        setNewSelectedFamilyMemberIds([]);
        setNewCategoryId(null);
        setNewRecurringWeekday([]);
        setIsAddingTask(false); // Stänger formuläret för att skapa uppgift
      })
      .catch(function (error) {
        console.error(error);
        alert('Något gick fel när uppgiften skulle sparas');
      });
  }
  // DELETE Funktion för att radera uppgift
  function deleteTask(taskId) {
    var token = localStorage.getItem('token');
    if (!token) {
      alert('Du måste vara inloggad för att radera uppgifter');
      return;
    }
    fetch('http://localhost:8080/api/week-tasks/'.concat(taskId), {
      method: 'DELETE',
      headers: { Authorization: 'Bearer '.concat(token) },
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Misslyckades med att radera uppgift');
        }
        setTasks(function (prev) {
          return prev.filter(function (task) {
            return task.id !== taskId;
          });
        });
      })
      .catch(function (error) {
        console.error(error);
        alert('Något gick fel när uppgiften skulle raderas');
      });
  }
  // Filtrera tasks baserat på vald användare, kolla först om det är en array
  var safeTasks = Array.isArray(tasks) ? tasks : [];
  console.log('Original tasks:', safeTasks);
  var filteredTasks = safeTasks.filter(function (task) {
    var isRecurring =
      Array.isArray(task.recurring_weekdays) &&
      task.recurring_weekdays.length > 0;
    if (!isRecurring) {
      return false; // Endast uppgifter med återkommande veckodagar visas
    }
    // Kontrollera familjemedlemsfilter
    var matchesFamilyMember =
      selectedFamilyMemberIdForFilter === 'all' ||
      (Array.isArray(task.family_members) &&
        task.family_members.some(function (member) {
          return member.id === selectedFamilyMemberIdForFilter;
        }));
    // Kontrollera kategori-filter
    var matchesCategory =
      selectedCategoryForFilter === 'all' ||
      (task.category_name && task.category_name === selectedCategoryForFilter);
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
  if (loading) return _jsx('p', { children: 'Laddar uppgifter...' });
  if (error) return _jsx('p', { children: error });
  function getFamilyMemberNamesFromObjects(familyMembersObjects) {
    if (!Array.isArray(familyMembersObjects)) return '';
    var names = familyMembersObjects.map(function (member) {
      return member.name;
    });
    return names.join(', ');
  }
  // PUT, uppdatera checkbox
  function toggleTaskCompleted(task) {
    var token = localStorage.getItem('token');
    if (!token) {
      alert('Du måste vara inloggad');
      return;
    }
    // Skapa ny version av task med togglad completed
    var updatedTask = __assign(__assign({}, task), {
      completed: !task.completed,
    });
    fetch('http://localhost:8080/api/week-tasks/'.concat(task.id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer '.concat(token),
      },
      body: JSON.stringify(updatedTask),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Kunde inte uppdatera uppgiften');
        }
        return response.json();
      })
      .then(function () {
        // Uppdatera lokalt tillstånd
        setTasks(function (previousTasks) {
          return previousTasks.map(function (t) {
            return t.id === task.id
              ? __assign(__assign({}, t), { completed: updatedTask.completed })
              : t;
          });
        });
      })
      .catch(function (error) {
        console.error('Fel vid PUT:', error);
      });
  }
  var testFilteredTasks = filteredTasks;
  return _jsxs(Container, {
    children: [
      loading && _jsx('p', { children: 'Laddar...' }),
      error && _jsx('p', { children: error }),
      _jsx(FormContainer, {
        children:
          !loading &&
          !error &&
          _jsx(_Fragment, {
            children:
              isAddingTask &&
              _jsxs(Form, {
                children: [
                  _jsx('h3', { children: 'L\u00E4gg till ny uppgift' }),
                  _jsx(CancelButton, {
                    type: 'button',
                    onClick: function () {
                      return setIsAddingTask(false);
                    },
                    children: 'x',
                  }),
                  _jsxs('label', {
                    children: [
                      'Titel: ',
                      _jsx('br', {}),
                      _jsx('input', {
                        type: 'text',
                        value: newTitle,
                        onChange: function (event) {
                          return setNewTitle(event.target.value);
                        },
                      }),
                    ],
                  }),
                  _jsx('br', {}),
                  _jsxs('label', {
                    children: [
                      'Beskrivning: ',
                      _jsx('br', {}),
                      _jsx('textarea', {
                        value: newDescription,
                        onChange: function (event) {
                          return setNewDescription(event.target.value);
                        },
                      }),
                    ],
                  }),
                  _jsx('br', {}),
                  _jsxs(StyledFieldset, {
                    children: [
                      _jsx('legend', {
                        children: 'L\u00E4gg till i veckoschema:',
                      }),
                      [
                        'måndag',
                        'tisdag',
                        'onsdag',
                        'torsdag',
                        'fredag',
                        'lördag',
                        'söndag',
                      ].map(function (day) {
                        var dayNumber = weekdayMap[day];
                        return _jsxs(
                          'label',
                          {
                            style: { marginRight: '10px' },
                            children: [
                              _jsx('input', {
                                type: 'checkbox',
                                value: dayNumber.toString(),
                                checked:
                                  newRecurringWeekday.includes(dayNumber),
                                onChange: function (event) {
                                  var checked = event.target.checked;
                                  var value = Number(event.target.value);
                                  if (isNaN(value)) {
                                    return;
                                  }
                                  if (checked) {
                                    setNewRecurringWeekday(function (prev) {
                                      // Undvik duplicering
                                      if (!prev.includes(value)) {
                                        return __spreadArray(
                                          __spreadArray([], prev, true),
                                          [value],
                                          false,
                                        );
                                      }
                                      return prev;
                                    });
                                  } else {
                                    setNewRecurringWeekday(function (prev) {
                                      return prev.filter(function (d) {
                                        return d !== value;
                                      });
                                    });
                                  }
                                },
                              }),
                              day.charAt(0).toUpperCase() + day.slice(1),
                            ],
                          },
                          day,
                        );
                      }),
                    ],
                  }),
                  _jsxs(StyledFieldset, {
                    children: [
                      _jsx('legend', {
                        children: 'Koppla till familjemedlem (valfritt):',
                      }),
                      familyMembers.map(function (member) {
                        return _jsxs(
                          'label',
                          {
                            style: { marginRight: '10px' },
                            children: [
                              _jsx('input', {
                                type: 'checkbox',
                                checked: newSelectedFamilyMemberIds.includes(
                                  member.id,
                                ),
                                onChange: function (event) {
                                  var isChecked = event.target.checked;
                                  if (isChecked) {
                                    setNewSelectedFamilyMemberIds(
                                      function (prev) {
                                        return __spreadArray(
                                          __spreadArray([], prev, true),
                                          [member.id],
                                          false,
                                        );
                                      },
                                    );
                                  } else {
                                    setNewSelectedFamilyMemberIds(
                                      function (prev) {
                                        return prev.filter(function (id) {
                                          return id !== member.id;
                                        });
                                      },
                                    );
                                  }
                                },
                              }),
                              member.name,
                            ],
                          },
                          member.id,
                        );
                      }),
                    ],
                  }),
                  _jsxs(StyledFieldset, {
                    children: [
                      _jsxs('label', {
                        children: [
                          'Kategori: ',
                          _jsx('br', {}),
                          _jsxs('select', {
                            value:
                              newCategoryId !== null && newCategoryId !== void 0
                                ? newCategoryId
                                : '',
                            onChange: function (event) {
                              var val = event.target.value;
                              setNewCategoryId(val !== '' ? Number(val) : null);
                            },
                            children: [
                              _jsx('option', {
                                value: '',
                                children: 'Ingen kategori',
                              }),
                              categories.map(function (category) {
                                return _jsx(
                                  'option',
                                  {
                                    value: category.id,
                                    children: category.name,
                                  },
                                  category.id,
                                );
                              }),
                            ],
                          }),
                        ],
                      }),
                      _jsx('br', {}),
                    ],
                  }),
                  _jsx(SubmitButton, {
                    type: 'button',
                    onClick: addTask,
                    children: 'L\u00E4gg till uppgift',
                  }),
                ],
              }),
          }),
      }),
      _jsx(Title, { children: 'Veckoschema' }),
      _jsxs(Filter, {
        children: [
          _jsxs('div', {
            children: [
              _jsx('label', { children: 'Filtrera p\u00E5 familjemedlem: ' }),
              _jsxs('select', {
                value: selectedFamilyMemberIdForFilter,
                onChange: function (event) {
                  var value = event.target.value;
                  if (value === 'all') {
                    setSelectedFamilyMemberIdForFilter('all');
                  } else {
                    setSelectedFamilyMemberIdForFilter(Number(value));
                  }
                },
                children: [
                  _jsx('option', {
                    value: 'all',
                    children: 'Alla familjemedlemmar',
                  }),
                  familyMembers.map(function (member) {
                    return _jsx(
                      'option',
                      { value: member.id, children: member.name },
                      member.id,
                    );
                  }),
                ],
              }),
            ],
          }),
          _jsxs('div', {
            children: [
              _jsx('label', { children: 'Filtrera p\u00E5 kategori: ' }),
              _jsxs('select', {
                value: selectedCategoryForFilter,
                onChange: function (event) {
                  return setSelectedCategoryForFilter(event.target.value);
                },
                children: [
                  _jsx('option', { value: 'all', children: 'Alla kategorier' }),
                  categories.map(function (category) {
                    return _jsx(
                      'option',
                      { value: category.name, children: category.name },
                      category.id,
                    );
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      _jsx(WeeklyScheduleContainer, {
        children: _jsx(WeekGrid, {
          children: [
            'måndag',
            'tisdag',
            'onsdag',
            'torsdag',
            'fredag',
            'lördag',
            'söndag',
          ].map(function (day) {
            var tasksForDay = testFilteredTasks.filter(function (task) {
              return (
                Array.isArray(task.recurring_weekdays) &&
                task.recurring_weekdays.map(Number).includes(weekdayMap[day])
              );
            });
            console.log('Tasks for '.concat(day, ':'), tasksForDay);
            return _jsxs(
              DayColumn,
              {
                children: [
                  _jsx(DayTitle, {
                    children: day.charAt(0).toUpperCase() + day.slice(1),
                  }),
                  tasksForDay.length > 0
                    ? _jsx('ul', {
                        children: tasksForDay.map(function (task) {
                          var _a;
                          // Om ingen kategori finns, fallback till ljusgrå
                          var categoryColor =
                            (_a = task.category_color) !== null && _a !== void 0
                              ? _a
                              : '#ccc';
                          // Returnera JSX för just den här tasken
                          return _jsxs(
                            RecurringTaskItem,
                            {
                              $completed: task.completed,
                              $categoryColor: categoryColor,
                              children: [
                                _jsxs(BoxContainers, {
                                  children: [
                                    _jsx(CheckboxStyled, {
                                      children: _jsx('input', {
                                        type: 'checkbox',
                                        checked: task.completed,
                                        onChange: function () {
                                          return toggleTaskCompleted(task);
                                        },
                                      }),
                                    }),
                                    _jsx(DeleteButton, {
                                      onClick: function () {
                                        return deleteTask(task.id);
                                      },
                                      children: 'x',
                                    }),
                                  ],
                                }),
                                _jsx(TaskTitle, {
                                  $completed: task.completed,
                                  children: task.title,
                                }),
                                task.description &&
                                  _jsx(Description, {
                                    children: task.description,
                                  }),
                                task.family_members &&
                                  task.family_members.length > 0 &&
                                  _jsx(FamilyMembers, {
                                    children: getFamilyMemberNamesFromObjects(
                                      task.family_members,
                                    ),
                                  }),
                              ],
                            },
                            task.id,
                          );
                        }),
                      })
                    : _jsx('p', {}),
                ],
              },
              day,
            );
          }),
        }),
      }),
      !isAddingTask &&
        _jsx(SubmitButton, {
          onClick: function () {
            return setIsAddingTask(true);
          },
          children: 'L\u00E4gg till ny uppgift',
        }),
    ],
  });
}
export default WeeklySchedule;
// Styled Components för enkel styling
var Container = styled.div(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      ['\n  max-width: 700px;\n  margin: 0 auto;\n  padding: 1rem;\n'],
      ['\n  max-width: 700px;\n  margin: 0 auto;\n  padding: 1rem;\n'],
    )),
);
var Filter = styled.div(
  templateObject_2 ||
    (templateObject_2 = __makeTemplateObject(
      [
        '\n  display: flex;\n  justify-content: flex-end;  \n  gap: 1rem;\n  text-align: flex-end;\n  margin-top: 20px;  \n  padding: 1px;\n  gap: 1rem;\n\n  label {\n    display: flex;\n    align-items: center;\n    gap: 0.5rem;           \n    font-family: Arial, sans-serif;\n    font-size: 0.9rem;\n  }\n\n  select {\n  background-color: rgb(235, 206, 235);\n  width: 195px;\n  border-radius: 8px;\n  border: rgb(148, 130, 148);\n  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.2);\n  }\n  ',
      ],
      [
        '\n  display: flex;\n  justify-content: flex-end;  \n  gap: 1rem;\n  text-align: flex-end;\n  margin-top: 20px;  \n  padding: 1px;\n  gap: 1rem;\n\n  label {\n    display: flex;\n    align-items: center;\n    gap: 0.5rem;           \n    font-family: Arial, sans-serif;\n    font-size: 0.9rem;\n  }\n\n  select {\n  background-color: rgb(235, 206, 235);\n  width: 195px;\n  border-radius: 8px;\n  border: rgb(148, 130, 148);\n  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.2);\n  }\n  ',
      ],
    )),
);
var FormContainer = styled.div(
  templateObject_3 ||
    (templateObject_3 = __makeTemplateObject(
      ['\n  max-width: 700px;\n  margin: 0 auto;\n  padding: 1rem;\n'],
      ['\n  max-width: 700px;\n  margin: 0 auto;\n  padding: 1rem;\n'],
    )),
);
var Form = styled.div(
  templateObject_4 ||
    (templateObject_4 = __makeTemplateObject(
      [
        '\n  margin-top: 1rem;\n  margin-bottom: 2rem;\n  padding: 1rem;  \n  border: none;\n  border: 1px solid #ccc;\n  margin: 1em 0;\n  padding: 1em;\n  border-radius: 8px;\n  box-shadow: 0 2px 5px rgba(31, 30, 30, 0.5);\n  background-color: rgb(232, 232, 235);\n',
      ],
      [
        '\n  margin-top: 1rem;\n  margin-bottom: 2rem;\n  padding: 1rem;  \n  border: none;\n  border: 1px solid #ccc;\n  margin: 1em 0;\n  padding: 1em;\n  border-radius: 8px;\n  box-shadow: 0 2px 5px rgba(31, 30, 30, 0.5);\n  background-color: rgb(232, 232, 235);\n',
      ],
    )),
);
var Title = styled.h3(
  templateObject_5 ||
    (templateObject_5 = __makeTemplateObject(
      [
        "\n  text-align: center;  \n  font-size: 28px;\n  font-family: 'Montserrat', Arial, sans-serif;\n",
      ],
      [
        "\n  text-align: center;  \n  font-size: 28px;\n  font-family: 'Montserrat', Arial, sans-serif;\n",
      ],
    )),
);
var WeeklyScheduleContainer = styled.div(
  templateObject_6 ||
    (templateObject_6 = __makeTemplateObject(
      [
        '\n  display: flex;\n  justify-content: flex-end;\n  margin-top: 0.4rem;\n  padding: 0 0.5rem;\n',
      ],
      [
        '\n  display: flex;\n  justify-content: flex-end;\n  margin-top: 0.4rem;\n  padding: 0 0.5rem;\n',
      ],
    )),
);
var WeekGrid = styled.div(
  templateObject_7 ||
    (templateObject_7 = __makeTemplateObject(
      [
        '\n  display: grid;\n  grid-template-columns: repeat(7, 1fr); \n  gap: 0.2rem;\n  margin-top: 1rem;\n',
      ],
      [
        '\n  display: grid;\n  grid-template-columns: repeat(7, 1fr); \n  gap: 0.2rem;\n  margin-top: 1rem;\n',
      ],
    )),
);
var DayColumn = styled.div(
  templateObject_8 ||
    (templateObject_8 = __makeTemplateObject(
      [
        '\n  background-color: #f4f4f4;\n  border-radius: 10px;\n  padding: 0rem;\n  min-width: 90px;\n  min-height: 300px;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);\n',
      ],
      [
        '\n  background-color: #f4f4f4;\n  border-radius: 10px;\n  padding: 0rem;\n  min-width: 90px;\n  min-height: 300px;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);\n',
      ],
    )),
);
var DayTitle = styled.h4(
  templateObject_9 ||
    (templateObject_9 = __makeTemplateObject(
      [
        '\n  background-color: rgb(117, 119, 212);\n  color: white;\n  border-radius: 3px;\n  padding: 2px;\n  text-align: center;\n  margin-bottom: 0.5rem;\n',
      ],
      [
        '\n  background-color: rgb(117, 119, 212);\n  color: white;\n  border-radius: 3px;\n  padding: 2px;\n  text-align: center;\n  margin-bottom: 0.5rem;\n',
      ],
    )),
);
var RecurringTaskItem = styled.li(
  templateObject_10 ||
    (templateObject_10 = __makeTemplateObject(
      [
        '\n  border: 1px solid #ccc;\n  padding: 0.75rem;\n  margin-bottom: 0.3rem;\n  border-radius: 8px;\n  background-color: ',
        ';\n  color: ',
        ';\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);\n  list-style: none;\n  font-size: 0.9rem;\n  position: relative;\n',
      ],
      [
        '\n  border: 1px solid #ccc;\n  padding: 0.75rem;\n  margin-bottom: 0.3rem;\n  border-radius: 8px;\n  background-color: ',
        ';\n  color: ',
        ';\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);\n  list-style: none;\n  font-size: 0.9rem;\n  position: relative;\n',
      ],
    )),
  function (props) {
    return props.$completed ? '#ddd' : props.$categoryColor;
  },
  function (props) {
    return props.$completed ? '#666' : '#000';
  },
);
var BoxContainers = styled.div(
  templateObject_11 ||
    (templateObject_11 = __makeTemplateObject(
      [
        '\n  display: flex; \n  justify-content: space-between;\n  align-items: center;\n  width: 100%;\n  ',
      ],
      [
        '\n  display: flex; \n  justify-content: space-between;\n  align-items: center;\n  width: 100%;\n  ',
      ],
    )),
);
var TaskTitle = styled.span(
  templateObject_12 ||
    (templateObject_12 = __makeTemplateObject(
      [
        "\n  display: flex; \n  justify-content: flex-start;\n  word-break: break-word;     \n  white-space: normal; \n  font-weight: bold;\n  font-size: 14px;    \n  font-family: 'Indie Flower', Arial, sans-serif;\n  text-decoration: ",
        ';\n  margin-top: 0.4rem;\n',
      ],
      [
        "\n  display: flex; \n  justify-content: flex-start;\n  word-break: break-word;     \n  white-space: normal; \n  font-weight: bold;\n  font-size: 14px;    \n  font-family: 'Indie Flower', Arial, sans-serif;\n  text-decoration: ",
        ';\n  margin-top: 0.4rem;\n',
      ],
    )),
  function (props) {
    return props.$completed ? 'line-through' : 'none';
  },
);
var CheckboxStyled = styled.div(
  templateObject_13 ||
    (templateObject_13 = __makeTemplateObject(
      [
        "\n  display: flex;\n  align-items: center;\n\n  input[type='checkbox'] {\n    width: 16px;\n    height: 16px;\n    accent-color: rgb(117, 119, 212); \n    cursor: pointer;\n  }\n",
      ],
      [
        "\n  display: flex;\n  align-items: center;\n\n  input[type='checkbox'] {\n    width: 16px;\n    height: 16px;\n    accent-color: rgb(117, 119, 212); \n    cursor: pointer;\n  }\n",
      ],
    )),
);
var Description = styled.div(
  templateObject_14 ||
    (templateObject_14 = __makeTemplateObject(
      ['\n  margin-top: 0.25rem;\n  font-style: italic;\n'],
      ['\n  margin-top: 0.25rem;\n  font-style: italic;\n'],
    )),
);
var FamilyMembers = styled.div(
  templateObject_15 ||
    (templateObject_15 = __makeTemplateObject(
      [
        '\n  display: flex; \n  justify-content: flex-end;\n  margin-top: 0.5rem;\n  color: #333;\n  Font-style: arial;\n  font-size: 11px;\n',
      ],
      [
        '\n  display: flex; \n  justify-content: flex-end;\n  margin-top: 0.5rem;\n  color: #333;\n  Font-style: arial;\n  font-size: 11px;\n',
      ],
    )),
);
var StyledFieldset = styled.fieldset(
  templateObject_16 ||
    (templateObject_16 = __makeTemplateObject(
      ['\n  border: none; \n  padding: 0;\n  margin: 1rem 0;\n'],
      ['\n  border: none; \n  padding: 0;\n  margin: 1rem 0;\n'],
    )),
);
var DeleteButton = styled.button(
  templateObject_17 ||
    (templateObject_17 = __makeTemplateObject(
      [
        '\ndisplay: flex; \njustify-content: space-between;\n\nbackground:rgb(116, 112, 111);\ncolor: rgb(255, 255, 255);\nfont-size: 10px;\ncursor: pointer;\npadding: 0.13rem .4rem;\nborder: 1px;\nborder-radius: 6px;\n\n  &:hover {\n  background: rgb(189, 11, 11);\n}\n',
      ],
      [
        '\ndisplay: flex; \njustify-content: space-between;\n\nbackground:rgb(116, 112, 111);\ncolor: rgb(255, 255, 255);\nfont-size: 10px;\ncursor: pointer;\npadding: 0.13rem .4rem;\nborder: 1px;\nborder-radius: 6px;\n\n  &:hover {\n  background: rgb(189, 11, 11);\n}\n',
      ],
    )),
);
var SubmitButton = styled.button(
  templateObject_18 ||
    (templateObject_18 = __makeTemplateObject(
      [
        '\n  background-color: rgb(117, 119, 212);\n  color: white;\n  font-weight: bold;\n  padding: 0.75rem 1.25rem;\n  margin-top: 10px;\n  margin-left: auto;\n  display: block;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  \n  &:hover {\n    background-color:rgb(115, 221, 120);\n  }\n',
      ],
      [
        '\n  background-color: rgb(117, 119, 212);\n  color: white;\n  font-weight: bold;\n  padding: 0.75rem 1.25rem;\n  margin-top: 10px;\n  margin-left: auto;\n  display: block;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  \n  &:hover {\n    background-color:rgb(115, 221, 120);\n  }\n',
      ],
    )),
);
var CancelButton = styled.button(
  templateObject_19 ||
    (templateObject_19 = __makeTemplateObject(
      [
        '\n  background-color: rgb(117, 119, 212);\n  color: white;\n  font-weight: bold;\n  padding: 0.7rem 1rem;\n  margin-top: 0px;\n  margin-left: auto;\n  display: block;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  \n  &:hover {\n    background-color:rgb(115, 221, 120);\n  }\n',
      ],
      [
        '\n  background-color: rgb(117, 119, 212);\n  color: white;\n  font-weight: bold;\n  padding: 0.7rem 1rem;\n  margin-top: 0px;\n  margin-left: auto;\n  display: block;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  \n  &:hover {\n    background-color:rgb(115, 221, 120);\n  }\n',
      ],
    )),
);
var templateObject_1,
  templateObject_2,
  templateObject_3,
  templateObject_4,
  templateObject_5,
  templateObject_6,
  templateObject_7,
  templateObject_8,
  templateObject_9,
  templateObject_10,
  templateObject_11,
  templateObject_12,
  templateObject_13,
  templateObject_14,
  templateObject_15,
  templateObject_16,
  templateObject_17,
  templateObject_18,
  templateObject_19;
//# sourceMappingURL=WeeklySchedule.js.map
