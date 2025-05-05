import { useEffect, useState } from "react"
import { SearchRoomsContext } from "./SearchRoomsContext"



export const SearchRoomsProvider = ({ children }) => {
  const [availableRooms, setAvailableRooms] = useState([]);

  // Save availableRooms to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('availableRooms', JSON.stringify(availableRooms));
  }, [availableRooms]);

  

  

  // Clear available rooms
  const clearAvailableRooms = () => {
    setAvailableRooms([]);
  };

  return (
    <SearchRoomsContext.Provider
      value={{ availableRooms, setAvailableRooms,  clearAvailableRooms }}
    >
      {children}
    </SearchRoomsContext.Provider>
  );
};