import { useEffect } from 'react'
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

useEffect(() => {
  fetch('/api')
    .then((response) => response.json())
    .then((result) => {
      //alert(`Hello ${result.hello}!`)
    })
}, [])

function App() {
  return (
    <>
      <LoginProvider>
        <GlobalStyles />
        <BrowserRouter>
          <AppContainer>
            <Header />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/account" element={<Account />} />
            </Routes>
          </AppContainer>
        </BrowserRouter>
      </LoginProvider>
    </>
  );
}

export default App
