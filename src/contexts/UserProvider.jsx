import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('bookingData');
    localStorage.removeItem('availableRooms');
    localStorage.removeItem('initialTime');
    localStorage.removeItem('selectedRooms');
    setUser(null);
  };

  const decodeJWT = (token) => {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  };

  const login = (token) => {
    try {
      const decodedUser = decodeJWT(token);
      localStorage.setItem('token', token);
      setUser(decodedUser);
    } catch (err) {
      console.error('Login error - invalid token:', err);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decodedUser = decodeJWT(storedToken);
        setUser(decodedUser);
      } catch (error) {
        console.error('Error decoding token on mount:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, logout, login }}>
      {children}
    </UserContext.Provider>
  );
};
