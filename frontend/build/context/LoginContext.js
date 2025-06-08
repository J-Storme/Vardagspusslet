import { jsx as _jsx } from 'react/jsx-runtime';
import { createContext, useContext, useState } from 'react';
// Skapa en context med en default value som är undefined.
var LoginContext = createContext(undefined);
// LoginProvider-komponenten som wrappar alla barnkomponenter som behöver åtkomst till login data.
export var LoginProvider = function (_a) {
  var children = _a.children;
  // Sätt state för token, userEmail och userName från localStorage om de finns där.
  var _b = useState(localStorage.getItem('token')),
    token = _b[0],
    setToken = _b[1];
  var _c = useState(localStorage.getItem('userEmail')),
    userEmail = _c[0],
    setUserEmail = _c[1];
  var _d = useState(localStorage.getItem('userName')),
    userName = _d[0],
    setUserName = _d[1];
  var _e = useState(
      localStorage.getItem('userId')
        ? Number(localStorage.getItem('userId'))
        : null,
    ),
    userId = _e[0],
    setUserId = _e[1];
  // Login-funktion
  var login = function (token, email, name, id) {
    setToken(token);
    setUserEmail(email);
    setUserName(name);
    setUserId(id);
    // Spara i localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
    localStorage.setItem('userId', id.toString());
  };
  // Logout-funktion
  var logout = function () {
    setToken(null);
    setUserEmail(null);
    setUserName(null);
    setUserId(null);
    // Ta bort från localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
  };
  var isLoggedIn = token !== null && token !== undefined;
  return _jsx(LoginContext.Provider, {
    value: {
      token: token,
      userEmail: userEmail,
      userName: userName,
      userId: userId,
      login: login,
      logout: logout,
      isLoggedIn: isLoggedIn,
    },
    children: children,
  });
};
// Hook för att få åtkomst till LoginContext i andra komponenter.
export var useLogin = function () {
  var context = useContext(LoginContext);
  if (!context) {
    throw new Error('useLogin måste användas inom en LoginProvider');
  }
  return context;
};
//# sourceMappingURL=LoginContext.js.map
