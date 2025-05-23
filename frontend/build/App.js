import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyles, { AppContainer } from './styles/GlobalStyles';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Account from './pages/Account';
import Login from './pages/Login';
import { LoginProvider } from './context/LoginContext';
import Register from './pages/Register';
useEffect(function () {
    fetch('/api')
        .then(function (response) { return response.json(); })
        .then(function (result) {
        //alert(`Hello ${result.hello}!`)
    });
}, []);
function App() {
    return (_jsx(_Fragment, { children: _jsxs(LoginProvider, { children: [_jsx(GlobalStyles, {}), _jsx(BrowserRouter, { children: _jsxs(AppContainer, { children: [_jsx(Header, {}), _jsx(Navbar, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/tasks", element: _jsx(Tasks, {}) }), _jsx(Route, { path: "/account", element: _jsx(Account, {}) })] })] }) })] }) }));
}
export default App;
//# sourceMappingURL=App.js.map