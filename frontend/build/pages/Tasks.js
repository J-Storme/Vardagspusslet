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
function Tasks() {
  // states
  var _a = useState([]),
    tasks = _a[0],
    setTasks = _a[1];
  var _b = useState([]),
    familyMembers = _b[0],
    setFamilyMembers = _b[1];
  var _c = useState([]),
    events = _c[0],
    setEvents = _c[1];
  var _d = useState('all'),
    selectedFamilyMemberIdForFilter = _d[0],
    setSelectedFamilyMemberIdForFilter = _d[1];
  var _e = useState(true),
    loading = _e[0],
    setLoading = _e[1];
  var _f = useState(null),
    error = _f[0],
    setError = _f[1];
  // State för nya uppgifter (inputfält)
  var _g = useState(false),
    isAddingTask = _g[0],
    setIsAddingTask = _g[1]; // Lägg till så att lägga-till-formuläret visas ej från början
  var _h = useState(''),
    newTitle = _h[0],
    setNewTitle = _h[1];
  var _j = useState(''),
    newDescription = _j[0],
    setNewDescription = _j[1];
  var _k = useState(''),
    newDueDate = _k[0],
    setNewDueDate = _k[1];
  var _l = useState([]),
    newSelectedFamilyMemberIds = _l[0],
    setNewSelectedFamilyMemberIds = _l[1];
  var _m = useState(null),
    newSelectedEventId = _m[0],
    setNewSelectedEventId = _m[1];
  var _o = useState(false),
    newRecurring = _o[0],
    setNewRecurring = _o[1];
  var _p = useState([]),
    newRecurringWeekday = _p[0],
    setNewRecurringWeekday = _p[1];
  // Hämta data när komponenten laddas
  useEffect(function () {
    var token = localStorage.getItem('token');
    if (!token) {
      setError('Ingen token hittades, du är inte inloggad');
      setLoading(false);
      return;
    }
    // Hämta tasks
    function fetchTasks() {
      return fetch('http://localhost:8080/api/tasks', {
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
    // Hämta events
    function fetchEvents() {
      return fetch('http://localhost:8080/api/events', {
        headers: { Authorization: 'Bearer '.concat(token) },
      }).then(function (response) {
        console.log('fetchEvents status:', response.status);
        if (!response.ok) {
          throw new Error('Något gick fel vid hämtning av events');
        }
        return response.json();
      });
    }
    // Hämta allt parallellt
    Promise.all([fetchTasks(), fetchFamilyMembers(), fetchEvents()])
      .then(function (_a) {
        var tasksData = _a[0],
          familyMembersData = _a[1],
          eventsData = _a[2];
        setTasks(tasksData);
        setFamilyMembers(familyMembersData);
        setEvents(eventsData);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        setError('Kunde inte hämta data från servern');
        setLoading(false);
      });
  }, []);
  // POST Lägg till ny uppgift
  function addTask() {
    var token = localStorage.getItem('token');
    if (!token) {
      alert('Du måste vara inloggad för att lägga till uppgifter');
      return;
    }
    // Om titel är tom
    if (newTitle.trim() === '') {
      alert('Namn på uppgiften måste fyllas i');
      return;
    }
    // Skapa objekt för ny uppgift (POST)
    var newTaskToAdd = {
      title: newTitle,
      description: newDescription,
      due_date: newRecurring ? '' : newDueDate, // om återkommande, sätt tomt datum
      completed: false,
      family_member_ids: newSelectedFamilyMemberIds,
      event_id: newSelectedEventId,
      recurring: newRecurring,
      //recurring_weekdays: newRecurring ? newRecurringWeekday : []
    };
    fetch('http://localhost:8080/api/tasks', {
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
      // svaret från backend sparas som addedTask
      .then(function (addedTask) {
        // Skapar en ny kopia med allt som fanns förut
        setTasks(function (previous) {
          return __spreadArray(
            __spreadArray([], previous, true),
            [addedTask],
            false,
          );
        });
        // Nollställ formulärfält
        setNewTitle('');
        setNewDescription('');
        setNewDueDate('');
        setNewSelectedFamilyMemberIds([]);
        setNewSelectedEventId(null);
        setIsAddingTask(false); // Stänger formuläret för att skapa uppgift
      })
      .catch(function (error) {
        console.error(error);
        alert('Något gick fel när uppgiften skulle sparas');
      });
  }
  // PUT Funktion för att uppdatera en uppgift
  function updateTask(updatedTask) {
    var token = localStorage.getItem('token');
    if (!token) {
      alert('Du måste vara inloggad för att uppdatera uppgifter');
      return;
    }
    fetch('http://localhost:8080/api/tasks/'.concat(updatedTask.id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer '.concat(token),
      },
      body: JSON.stringify(updatedTask),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Misslyckades med att uppdatera uppgift');
        }
        // Uppdatera lokalt state med nya data
        setTasks(function (prev) {
          return prev.map(function (task) {
            return task.id === updatedTask.id ? updatedTask : task;
          });
        });
      })
      .catch(function (error) {
        console.error(error);
        alert('Något gick fel när uppgiften skulle uppdateras');
      });
  }
  // Funktion för att bocka av/markera klar eller ej klar
  function toggleTaskCompleted(taskId) {
    var task = tasks.find(function (task) {
      return task.id === taskId;
    });
    if (!task) return;
    var updatedTask = __assign(__assign({}, task), {
      completed: !task.completed,
    });
    updateTask(updatedTask);
  }
  // DELETE Funktion för att radera uppgift
  function deleteTask(taskId) {
    var token = localStorage.getItem('token');
    if (!token) {
      alert('Du måste vara inloggad för att radera uppgifter');
      return;
    }
    fetch('http://localhost:8080/api/tasks/'.concat(taskId), {
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
  // Filtrera tasks baserat på vald användare
  var filteredTasks;
  if (selectedFamilyMemberIdForFilter === 'all') {
    filteredTasks = tasks;
  } else {
    filteredTasks = tasks.filter(function (task) {
      return task.family_member_ids.includes(selectedFamilyMemberIdForFilter);
    });
  }
  if (loading) return _jsx('p', { children: 'Laddar uppgifter...' });
  if (error) return _jsx('p', { children: error });
  return _jsxs(Container, {
    children: [
      loading && _jsx('p', { children: 'Laddar...' }),
      error && _jsx('p', { children: error }),
      _jsx(Title, { children: 'To-do' }),
      _jsx(FormContainer, {
        children:
          !loading &&
          !error &&
          _jsxs(_Fragment, {
            children: [
              !isAddingTask &&
                _jsx(OpenFormButton, {
                  onClick: function () {
                    return setIsAddingTask(true);
                  },
                  children: 'L\u00E4gg till uppgift',
                }),
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
                    !newRecurring &&
                      _jsxs('label', {
                        children: [
                          'Klar senast: ',
                          _jsx('br', {}),
                          _jsx('input', {
                            type: 'date',
                            value: newDueDate,
                            onChange: function (event) {
                              return setNewDueDate(event.target.value);
                            },
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
                        _jsx('legend', {
                          children: 'Koppla till event (valfritt):',
                        }),
                        _jsxs('select', {
                          value:
                            newSelectedEventId !== null &&
                            newSelectedEventId !== void 0
                              ? newSelectedEventId
                              : '',
                          onChange: function (event) {
                            return setNewSelectedEventId(
                              Number(event.target.value),
                            );
                          },
                          children: [
                            _jsx('option', { value: '', children: 'Ingen' }),
                            events.map(function (e) {
                              return _jsx(
                                'option',
                                { value: e.id, children: e.title },
                                e.id,
                              );
                            }),
                          ],
                        }),
                      ],
                    }),
                    _jsx(SubmitButton, {
                      type: 'button',
                      onClick: addTask,
                      children: 'L\u00E4gg till uppgift',
                    }),
                  ],
                }),
            ],
          }),
      }),
      _jsx(Filter, {
        children: _jsxs('div', {
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
      }),
      _jsxs(TaskList, {
        children: [
          filteredTasks
            .filter(function (task) {
              return (
                !Array.isArray(task.recurring_weekdays) ||
                task.recurring_weekdays.length === 0
              );
            })
            // Sortera så att högst id (nyast) kommer först
            .sort(function (a, b) {
              return b.id - a.id;
            })
            .map(function (task) {
              var _a, _b;
              return _jsxs(
                TaskItem,
                {
                  $completed: task.completed,
                  children: [
                    _jsx(CheckboxStyled, {
                      children: _jsx('input', {
                        type: 'checkbox',
                        checked: task.completed,
                        onChange: function () {
                          return toggleTaskCompleted(task.id);
                        },
                      }),
                    }),
                    _jsx(TaskTitle, {
                      $completed: task.completed,
                      children: task.title,
                    }),
                    task.due_date &&
                      _jsxs(DueDate, {
                        children: [
                          'Klar senast: ',
                          new Date(task.due_date).toISOString().split('T')[0],
                        ],
                      }),
                    task.description &&
                      _jsx(Description, { children: task.description }),
                    _jsx(FamilyMembers, {
                      children:
                        Array.isArray(task.family_member_ids) &&
                        task.family_member_ids.length > 0
                          ? (function () {
                              var assignedNames = task.family_member_ids
                                .map(function (id) {
                                  var member = familyMembers.find(function (m) {
                                    return m.id === id;
                                  });
                                  return member ? member.name : 'Okänd medlem';
                                })
                                .join(', ');
                              return _jsxs('p', {
                                children: [' ', assignedNames],
                              });
                            })()
                          : _jsx('p', { children: 'Of\u00F6rdelad uppgift' }),
                    }),
                    task.event_id &&
                      _jsxs(EventList, {
                        children: [
                          _jsx('strong', { children: 'Event:' }),
                          ' ',
                          (_b =
                            (_a = events.find(function (event) {
                              return event.id === task.event_id;
                            })) === null || _a === void 0
                              ? void 0
                              : _a.title) !== null && _b !== void 0
                            ? _b
                            : '(okänt event)',
                        ],
                      }),
                    _jsx(DeleteButton, {
                      onClick: function () {
                        return deleteTask(task.id);
                      },
                      children: 'Radera',
                    }),
                  ],
                },
                task.id,
              );
            }),
          filteredTasks.filter(function (task) {
            return (
              !Array.isArray(task.recurring_weekdays) ||
              task.recurring_weekdays.length === 0
            );
          }).length === 0 &&
            _jsx('p', { children: 'Inga uppgifter att visa.' }),
        ],
      }),
    ],
  });
}
export default Tasks;
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
        '\n  display: flex;\n  justify-content: flex-end;  \n  gap: 1rem;\n  text-align: flex-end;\n  margin-top: 20px;  \n  margin-bottom: 10px;\n  padding: 1px;\n  gap: 1rem;\n\n  label {\n    display: flex;\n    align-items: center;\n    gap: 0.5rem;           \n    font-family: Arial, sans-serif;\n    font-size: 0.9rem;\n  }\n\n  select {\n  background-color: rgb(235, 206, 235);\n  width: 195px;\n  border-radius: 8px;\n  border: rgb(148, 130, 148);\n  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.2);\n  }\n  ',
      ],
      [
        '\n  display: flex;\n  justify-content: flex-end;  \n  gap: 1rem;\n  text-align: flex-end;\n  margin-top: 20px;  \n  margin-bottom: 10px;\n  padding: 1px;\n  gap: 1rem;\n\n  label {\n    display: flex;\n    align-items: center;\n    gap: 0.5rem;           \n    font-family: Arial, sans-serif;\n    font-size: 0.9rem;\n  }\n\n  select {\n  background-color: rgb(235, 206, 235);\n  width: 195px;\n  border-radius: 8px;\n  border: rgb(148, 130, 148);\n  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.2);\n  }\n  ',
      ],
    )),
);
var FormContainer = styled.div(
  templateObject_3 ||
    (templateObject_3 = __makeTemplateObject(
      [
        '\n  max-width: 700px;\n  margin: 0 auto;\n  padding: 1rem;\n  display: flex;\n  justify-content: center;\n',
      ],
      [
        '\n  max-width: 700px;\n  margin: 0 auto;\n  padding: 1rem;\n  display: flex;\n  justify-content: center;\n',
      ],
    )),
);
var Form = styled.div(
  templateObject_4 ||
    (templateObject_4 = __makeTemplateObject(
      [
        '\n  margin-top: 1rem;\n  margin-bottom: 2rem;\n  padding: 1rem;  \n  border: none;\n  border: 1px solid #ccc;\n  margin: 1em 0;\n  padding: 1em;\n  border-radius: 8px;\n  box-shadow: 0 2px 5px rgba(31, 30, 30, 0.5);\n  background-color: rgb(229, 229, 252);\n',
      ],
      [
        '\n  margin-top: 1rem;\n  margin-bottom: 2rem;\n  padding: 1rem;  \n  border: none;\n  border: 1px solid #ccc;\n  margin: 1em 0;\n  padding: 1em;\n  border-radius: 8px;\n  box-shadow: 0 2px 5px rgba(31, 30, 30, 0.5);\n  background-color: rgb(229, 229, 252);\n',
      ],
    )),
);
var Title = styled.h3(
  templateObject_5 ||
    (templateObject_5 = __makeTemplateObject(
      [
        "\n  text-align: center;\n  margin-top: 1rem;\n  margin-bottom: 0.1rem;\n  font-family: 'Indie Flower', Arial, sans-serif;\n  font-size: 34px;\n",
      ],
      [
        "\n  text-align: center;\n  margin-top: 1rem;\n  margin-bottom: 0.1rem;\n  font-family: 'Indie Flower', Arial, sans-serif;\n  font-size: 34px;\n",
      ],
    )),
);
var TaskList = styled.ul(
  templateObject_6 ||
    (templateObject_6 = __makeTemplateObject(
      [
        '\n  margin: 0 auto;\n  max-width: 300px;\n  list-style-type: none;\n  padding: 0;\n',
      ],
      [
        '\n  margin: 0 auto;\n  max-width: 300px;\n  list-style-type: none;\n  padding: 0;\n',
      ],
    )),
);
var TaskItem = styled.li(
  templateObject_7 ||
    (templateObject_7 = __makeTemplateObject(
      [
        '\n  position: relative;\n  border: 1px solid #ccc;\n  margin: .3em 0;\n  padding: 1em;\n  color:  ',
        ';\n  border-radius: 8px;\n  box-shadow: 0 2px 5px rgba(31, 30, 30, 0.5);\n  background-color: ',
        ';\n',
      ],
      [
        '\n  position: relative;\n  border: 1px solid #ccc;\n  margin: .3em 0;\n  padding: 1em;\n  color:  ',
        ';\n  border-radius: 8px;\n  box-shadow: 0 2px 5px rgba(31, 30, 30, 0.5);\n  background-color: ',
        ';\n',
      ],
    )),
  function (props) {
    return props.$completed ? 'rgb(134, 134, 134)' : 'rgb(0, 0, 0)';
  },
  function (props) {
    return props.$completed ? 'rgb(209, 209, 209)' : 'rgb(227, 228, 250)';
  },
);
var TaskTitle = styled.span(
  templateObject_8 ||
    (templateObject_8 = __makeTemplateObject(
      [
        '\n  font-weight: bold;\n  text-decoration: ',
        ";\n  margin-left: 0.5rem;\n  font-family: 'Indie Flower', Arial, sans-serif;\n  font-size: 18px;\n",
      ],
      [
        '\n  font-weight: bold;\n  text-decoration: ',
        ";\n  margin-left: 0.5rem;\n  font-family: 'Indie Flower', Arial, sans-serif;\n  font-size: 18px;\n",
      ],
    )),
  function (props) {
    return props.$completed ? 'line-through' : 'none';
  },
);
var DueDate = styled.div(
  templateObject_9 ||
    (templateObject_9 = __makeTemplateObject(
      ['\n  font-size: 0.85rem;\n  color: #666;\n'],
      ['\n  font-size: 0.85rem;\n  color: #666;\n'],
    )),
);
var Description = styled.div(
  templateObject_10 ||
    (templateObject_10 = __makeTemplateObject(
      ['\n  margin-top: 0.25rem;\n  font-family: Arial, sans-serif;\n'],
      ['\n  margin-top: 0.25rem;\n  font-family: Arial, sans-serif;\n'],
    )),
);
var EventList = styled.div(
  templateObject_11 ||
    (templateObject_11 = __makeTemplateObject(
      ['\n  font-size: 0.85rem;\n  margin-top: 0.25rem;\n'],
      ['\n  font-size: 0.85rem;\n  margin-top: 0.25rem;\n'],
    )),
);
var FamilyMembers = styled.div(
  templateObject_12 ||
    (templateObject_12 = __makeTemplateObject(
      [
        '\n  display: flex; \n  justify-content: flex-end;\n  margin-top: 0.5rem;\n  font-size: 13px;\n  color: #333;\n',
      ],
      [
        '\n  display: flex; \n  justify-content: flex-end;\n  margin-top: 0.5rem;\n  font-size: 13px;\n  color: #333;\n',
      ],
    )),
);
var StyledFieldset = styled.fieldset(
  templateObject_13 ||
    (templateObject_13 = __makeTemplateObject(
      ['\n  border: none; \n  padding: 0;\n  margin: 1rem 0;\n'],
      ['\n  border: none; \n  padding: 0;\n  margin: 1rem 0;\n'],
    )),
);
var CheckboxStyled = styled.div(
  templateObject_14 ||
    (templateObject_14 = __makeTemplateObject(
      [
        "\n  display: flex;\n  align-items: center;\n\n  input[type='checkbox'] {\n    width: 16px;\n    height: 16px;\n    accent-color: rgb(117, 119, 212); \n    cursor: pointer;\n  }\n",
      ],
      [
        "\n  display: flex;\n  align-items: center;\n\n  input[type='checkbox'] {\n    width: 16px;\n    height: 16px;\n    accent-color: rgb(117, 119, 212); \n    cursor: pointer;\n  }\n",
      ],
    )),
);
var DeleteButton = styled.button(
  templateObject_15 ||
    (templateObject_15 = __makeTemplateObject(
      [
        '\nposition: absolute;\ntop: 8px;\nright: 6px;\nbackground:rgb(116, 112, 111);\ncolor: rgb(255, 255, 255);\nfont-size: 11px;\ncursor: pointer;\npadding: 0.15rem .5rem;\nborder: 1px;\nborder-radius: 8px;\n\n  &:hover {\n  background: rgb(189, 11, 11);\n}\n',
      ],
      [
        '\nposition: absolute;\ntop: 8px;\nright: 6px;\nbackground:rgb(116, 112, 111);\ncolor: rgb(255, 255, 255);\nfont-size: 11px;\ncursor: pointer;\npadding: 0.15rem .5rem;\nborder: 1px;\nborder-radius: 8px;\n\n  &:hover {\n  background: rgb(189, 11, 11);\n}\n',
      ],
    )),
);
var SubmitButton = styled.button(
  templateObject_16 ||
    (templateObject_16 = __makeTemplateObject(
      [
        '\n  background-color: rgb(117, 119, 212);\n  color: white;\n  font-weight: bold;\n  padding: 0.75rem 1.25rem;\n  margin-top: 0px;\n  margin-left: auto;\n  display: block;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  \n  &:hover {\n    background-color:rgb(115, 221, 120);\n  }\n',
      ],
      [
        '\n  background-color: rgb(117, 119, 212);\n  color: white;\n  font-weight: bold;\n  padding: 0.75rem 1.25rem;\n  margin-top: 0px;\n  margin-left: auto;\n  display: block;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  \n  &:hover {\n    background-color:rgb(115, 221, 120);\n  }\n',
      ],
    )),
);
var CancelButton = styled.button(
  templateObject_17 ||
    (templateObject_17 = __makeTemplateObject(
      [
        '\n  background-color: rgb(117, 119, 212);\n  color: white;\n  font-weight: bold;\n  padding: 0.7rem 1rem;\n  margin-top: 0px;\n  margin-left: auto;\n  display: block;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  \n  &:hover {\n    background-color:rgb(115, 221, 120);\n  }\n',
      ],
      [
        '\n  background-color: rgb(117, 119, 212);\n  color: white;\n  font-weight: bold;\n  padding: 0.7rem 1rem;\n  margin-top: 0px;\n  margin-left: auto;\n  display: block;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  \n  &:hover {\n    background-color:rgb(115, 221, 120);\n  }\n',
      ],
    )),
);
var OpenFormButton = styled.button(
  templateObject_18 ||
    (templateObject_18 = __makeTemplateObject(
      [
        '\n  background-color: rgb(117, 119, 212);\n  color: white;\n  font-weight: bold;\n  padding: 0.75rem 1.25rem;\n  margin: 1.5rem auto 0 auto;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: background-color 0.3s;\n\n  &:hover {\n    background-color: rgb(91, 201, 133);\n  }\n',
      ],
      [
        '\n  background-color: rgb(117, 119, 212);\n  color: white;\n  font-weight: bold;\n  padding: 0.75rem 1.25rem;\n  margin: 1.5rem auto 0 auto;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: background-color 0.3s;\n\n  &:hover {\n    background-color: rgb(91, 201, 133);\n  }\n',
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
  templateObject_18;
//# sourceMappingURL=Tasks.js.map
