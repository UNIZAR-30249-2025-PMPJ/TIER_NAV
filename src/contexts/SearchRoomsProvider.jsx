import { useEffect, useState } from "react";
import { SearchRoomsContext } from "./SearchRoomsContext";

export const SearchRoomsProvider = ({ children }) => {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false); // Add a flag to track loading

  // Load availableRooms from localStorage on initial render
  useEffect(() => {
    const storedRooms = localStorage.getItem("availableRooms");
    if (storedRooms) {
      setAvailableRooms(JSON.parse(storedRooms));
    }
    setIsLoaded(true); // Mark as loaded
  }, []);

  // Save availableRooms to localStorage whenever it changes, but only after loading
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("availableRooms", JSON.stringify(availableRooms));
    }
  }, [availableRooms, isLoaded]);

  // Clear available rooms
  const clearAvailableRooms = () => {
    setAvailableRooms([]);
  };

  return (
    <SearchRoomsContext.Provider
      value={{ availableRooms, setAvailableRooms, clearAvailableRooms }}
    >
      {children}
    </SearchRoomsContext.Provider>
  );
};