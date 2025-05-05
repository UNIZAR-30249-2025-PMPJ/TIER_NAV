

import { useEffect, useState } from "react"
import { UserContext } from "./UserContext"


export const UserProvider = ({children}) => {

  //Basic user data
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
  });

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

   // Function to decode JWT
   const decodeJWT = (token) => {
    const payload = token.split('.')[1]; // Obtener la parte del payload
    const decodedPayload = atob(payload); // Decodificar en Base64
    return JSON.parse(decodedPayload); // Parsear el JSON
  };

  //Read from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        // Decode the JWT and set user data
        const decodedUser = decodeJWT(storedToken);
        setUser(decodedUser);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }, []);



    // Save user data to localStorage
    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

  return (
    <UserContext.Provider value={{user,setUser, logout}}>
        {children}
    </UserContext.Provider>
  )
}
