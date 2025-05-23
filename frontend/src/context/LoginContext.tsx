import { createContext, useContext, useState, ReactNode } from 'react';

// Definierar typen för LoginContext. Detta kommer att innehålla
// token, användarens e-post och namn, funktioner för login/logout samt en flagga för om användaren är inloggad.
interface LoginContextType {
  token: string | null;
  userEmail: string | null;
  userName: string | null;
  login: (token: string, email: string, name: string) => void;
  logout: () => void;
  isLoggedIn: boolean; // Flagga som visar om användaren är inloggad
}

// Skapa en context med en default value som är undefined.
const LoginContext = createContext<LoginContextType | undefined>(undefined);

// LoginProvider-komponenten som wrappar alla barnkomponenter som behöver åtkomst till login data.
export const LoginProvider = ({ children }: { children: ReactNode }) => {
  // Sätt state för token, userEmail och userName från localStorage om de finns där.
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('userEmail'));
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('userName'));

  // Login-funktion 
  const login = (token: string, email: string, name: string) => {
    setToken(token);
    setUserEmail(email);
    setUserName(name);

    // Spara i localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
  };

  // Logout-funktion 
  const logout = () => {
    setToken(null);
    setUserEmail(null);
    setUserName(null);

    // Ta bort från localStorage 
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  };

  const isLoggedIn = token !== null && token !== undefined;

  return (
    <LoginContext.Provider value={{ token, userEmail, userName, login, logout, isLoggedIn }}>
      {children}
    </LoginContext.Provider>
  );
};

// Hook för att få åtkomst till LoginContext i andra komponenter.
export const useLogin = () => {
  const context = useContext(LoginContext);

  if (!context) {
    throw new Error('useLogin måste användas inom en LoginProvider');
  }

  return context;
};

