import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyles, { AppContainer } from './styles/GlobalStyles';
import Header from './components/Header';
import Navbar from './components/Navbar';
import { LoginProvider } from './context/LoginContext';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Account from './pages/Account';
import Login from './pages/Login';
import Register from './pages/Register';
import WeeklySchedule from './pages/WeeklySchedule';



function App() {
  useEffect(() => {
    fetch('/api')
      .then((response) => response.json())
      .then((result) => {
      })
  }, [])

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
              <Route path="/weeklyschedule" element={<WeeklySchedule />} />
            </Routes>
          </AppContainer>
        </BrowserRouter>
      </LoginProvider>
    </>
  );
}

export default App
