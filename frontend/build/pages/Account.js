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
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create(
        (typeof Iterator === 'function' ? Iterator : Object).prototype,
      );
    return (
      (g.next = verb(0)),
      (g['throw'] = verb(1)),
      (g['return'] = verb(2)),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
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
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
var Account = function () {
  var _a = useState([]),
    members = _a[0],
    setMembers = _a[1];
  var _b = useState(''),
    newName = _b[0],
    setNewName = _b[1];
  var _c = useState(''),
    newRole = _c[0],
    setNewRole = _c[1];
  var _d = useState(null),
    editId = _d[0],
    setEditId = _d[1];
  var _e = useState(''),
    editName = _e[0],
    setEditName = _e[1];
  var _f = useState(''),
    editRole = _f[0],
    setEditRole = _f[1];
  var _g = useState(''),
    userName = _g[0],
    setUserName = _g[1];
  var token = localStorage.getItem('token');
  useEffect(function () {
    var storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);
  useEffect(
    function () {
      if (!token) return;
      // Hämta familjemedlemmar från backend
      var fetchMembers = function () {
        return __awaiter(void 0, void 0, void 0, function () {
          var response, data, error_1;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                _a.trys.push([0, 3, , 4]);
                return [
                  4 /*yield*/,
                  fetch('/api/family-members', {
                    headers: {
                      Authorization: 'Bearer '.concat(token),
                    },
                  }),
                ];
              case 1:
                response = _a.sent();
                if (!response.ok) {
                  throw new Error(
                    'Misslyckades med att hämta familjemedlemmar',
                  );
                }
                return [4 /*yield*/, response.json()];
              case 2:
                data = _a.sent();
                setMembers(data);
                return [3 /*break*/, 4];
              case 3:
                error_1 = _a.sent();
                console.error(error_1);
                return [3 /*break*/, 4];
              case 4:
                return [2 /*return*/];
            }
          });
        });
      };
      fetchMembers();
    },
    [token],
  );
  var addMember = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var response, newMember, error_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (newName.trim() === '') return [2 /*return*/];
            _a.label = 1;
          case 1:
            _a.trys.push([1, 4, , 5]);
            return [
              4 /*yield*/,
              fetch('/api/family-members', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: token || '',
                },
                body: JSON.stringify({
                  name: newName.trim(),
                  role: newRole.trim(),
                  profile_image: null,
                }),
              }),
            ];
          case 2:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Kunde inte lägga till familjemedlem');
            }
            return [4 /*yield*/, response.json()];
          case 3:
            newMember = _a.sent();
            setMembers(
              __spreadArray(
                __spreadArray([], members, true),
                [newMember],
                false,
              ),
            );
            setNewName('');
            setNewRole('');
            return [3 /*break*/, 5];
          case 4:
            error_2 = _a.sent();
            console.error(error_2);
            return [3 /*break*/, 5];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  var startEditing = function (member) {
    setEditId(member.id);
    setEditName(member.name);
    setEditRole(member.role);
  };
  var saveEdit = function () {
    if (editId === null) return;
    setMembers(
      members.map(function (m) {
        return m.id === editId
          ? __assign(__assign({}, m), {
              name: editName.trim(),
              role: editRole.trim(),
            })
          : m;
      }),
    );
    cancelEdit();
  };
  var cancelEdit = function () {
    setEditId(null);
    setEditName('');
    setEditRole('');
  };
  var deleteMember = function (id) {
    return __awaiter(void 0, void 0, void 0, function () {
      var response, error_3;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (
              !window.confirm('Vill du verkligen ta bort denna familjemedlem?')
            )
              return [2 /*return*/];
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            return [
              4 /*yield*/,
              fetch('/api/family-members/'.concat(id), {
                method: 'DELETE',
                headers: {
                  Authorization: token || '',
                },
              }),
            ];
          case 2:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Kunde inte ta bort familjemedlem');
            }
            setMembers(
              members.filter(function (m) {
                return m.id !== id;
              }),
            );
            return [3 /*break*/, 4];
          case 3:
            error_3 = _a.sent();
            console.error(error_3);
            return [3 /*break*/, 4];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  return _jsxs(Container, {
    children: [
      _jsx('h2', { children: 'Hantera familjemedlemmar' }),
      _jsxs('p', {
        children: ['L\u00E4gg till medlemmar i hush\u00E5ll ', userName],
      }),
      _jsxs(AddMemberSection, {
        children: [
          _jsx('input', {
            type: 'text',
            placeholder: 'Namn',
            value: newName,
            onChange: function (e) {
              return setNewName(e.target.value);
            },
          }),
          _jsxs('select', {
            value: newRole,
            onChange: function (e) {
              return setNewRole(e.target.value);
            },
            children: [
              _jsx('option', { value: '', children: 'V\u00E4lj roll' }),
              _jsx('option', { value: 'vuxen', children: 'Vuxen' }),
              _jsx('option', { value: 'barn', children: 'Barn' }),
            ],
          }),
          _jsx('button', { onClick: addMember, children: 'L\u00E4gg till' }),
        ],
      }),
      _jsxs(List, {
        children: [
          members.length === 0 &&
            _jsx('p', {
              children: 'Inga familjemedlemmar tillagda \u00E4nnu.',
            }),
          members.map(function (member) {
            return editId === member.id
              ? _jsxs(
                  ListItem,
                  {
                    children: [
                      _jsx('input', {
                        type: 'text',
                        value: editName,
                        onChange: function (event) {
                          return setEditName(event.target.value);
                        },
                      }),
                      _jsx('input', {
                        type: 'text',
                        value: editRole,
                        onChange: function (event) {
                          return setEditRole(event.target.value);
                        },
                      }),
                      _jsx('button', { onClick: saveEdit, children: 'Spara' }),
                      _jsx('button', {
                        onClick: cancelEdit,
                        children: 'Avbryt',
                      }),
                    ],
                  },
                  member.id,
                )
              : _jsxs(
                  ListItem,
                  {
                    children: [
                      _jsxs('span', {
                        children: [
                          _jsx('strong', { children: member.name }),
                          ' - ',
                          member.role,
                        ],
                      }),
                      _jsxs(Buttons, {
                        children: [
                          _jsx('button', {
                            onClick: function () {
                              return startEditing(member);
                            },
                            children: 'Redigera',
                          }),
                          _jsx('button', {
                            onClick: function () {
                              return deleteMember(member.id);
                            },
                            children: 'Ta bort',
                          }),
                        ],
                      }),
                    ],
                  },
                  member.id,
                );
          }),
        ],
      }),
    ],
  });
};
export default Account;
// Styled Components
var Container = styled.div(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        '\n  max-width: 500px;\n  margin: 40px auto;\n  padding: 10px;\n  background-color: white;\n  border-radius: 6px;\n  box-shadow: 0 0 8px rgba(0,0,0,0.1);\n\nh2 {\nmargin-top: 20px;\n}\n\np {\nmargin-top: 28px;\nmargin-bottom: 10px;\n}\n',
      ],
      [
        '\n  max-width: 500px;\n  margin: 40px auto;\n  padding: 10px;\n  background-color: white;\n  border-radius: 6px;\n  box-shadow: 0 0 8px rgba(0,0,0,0.1);\n\nh2 {\nmargin-top: 20px;\n}\n\np {\nmargin-top: 28px;\nmargin-bottom: 10px;\n}\n',
      ],
    )),
);
var AddMemberSection = styled.div(
  templateObject_2 ||
    (templateObject_2 = __makeTemplateObject(
      [
        '\n  display: flex;\n  gap: 8px;\n  margin-top: 8px;\n  margin-bottom: 40px;\n  input {\n    flex: 1;\n    padding: 6px 10px;\n    font-size: 16px;\n  }\n  button {\n    padding: 6px 12px;\n    font-size: 16px;\n    cursor: pointer;\n  }\n',
      ],
      [
        '\n  display: flex;\n  gap: 8px;\n  margin-top: 8px;\n  margin-bottom: 40px;\n  input {\n    flex: 1;\n    padding: 6px 10px;\n    font-size: 16px;\n  }\n  button {\n    padding: 6px 12px;\n    font-size: 16px;\n    cursor: pointer;\n  }\n',
      ],
    )),
);
var List = styled.ul(
  templateObject_3 ||
    (templateObject_3 = __makeTemplateObject(
      ['\n  list-style: none;\n  padding: 0;\n'],
      ['\n  list-style: none;\n  padding: 0;\n'],
    )),
);
var ListItem = styled.li(
  templateObject_4 ||
    (templateObject_4 = __makeTemplateObject(
      [
        '\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 10px;\n\n  input {\n    font-size: 16px;\n    padding: 4px 8px;\n    margin-right: 8px;\n  }\n\n  span {\n    flex: 1;\n  }\n',
      ],
      [
        '\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 10px;\n\n  input {\n    font-size: 16px;\n    padding: 4px 8px;\n    margin-right: 8px;\n  }\n\n  span {\n    flex: 1;\n  }\n',
      ],
    )),
);
var Buttons = styled.div(
  templateObject_5 ||
    (templateObject_5 = __makeTemplateObject(
      [
        '\n  button {\n    margin-left: 8px;\n    padding: 4px 8px;\n    cursor: pointer;\n  }\n',
      ],
      [
        '\n  button {\n    margin-left: 8px;\n    padding: 4px 8px;\n    cursor: pointer;\n  }\n',
      ],
    )),
);
var templateObject_1,
  templateObject_2,
  templateObject_3,
  templateObject_4,
  templateObject_5;
//# sourceMappingURL=Account.js.map
