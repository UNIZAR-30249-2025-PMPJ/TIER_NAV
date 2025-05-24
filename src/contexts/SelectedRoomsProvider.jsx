import { useEffect, useState } from "react";

import { SelectedRoomsContext } from "./SelectedRoomsContext";

export const SelectedRoomsProvider = ({ children }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [initialTime, setInitialTime] = useState({date: "", time:""}); // Default initial time
  const [isLoaded, setIsLoaded] = useState(false); // Add a flag to track loading

  // Load selected rooms from localStorage on initial render
  useEffect(() => {
    const storedRooms = localStorage.getItem("selectedRooms");
    const storedInitialTime = localStorage.getItem("initialTime");
    if (storedInitialTime) {
      setInitialTime(storedInitialTime);
    } 
    if (storedRooms) {
      setSelectedRooms(JSON.parse(storedRooms));
    }
    setIsLoaded(true); // Mark as loaded
  }, []);

  // Save selected rooms to localStorage whenever they change, but only after loading
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("selectedRooms", JSON.stringify(selectedRooms));
      localStorage.setItem("initialTime", JSON.stringify(initialTime));
    }
  }, [selectedRooms, isLoaded, initialTime]);

  const addRoom = (room) => {
    setSelectedRooms((prev) => [...prev, room]);
  };
  const removeRoom = (room) => {
    // Filter out the room to be removed checking by id, name, and date
    setSelectedRooms((prev) =>
      prev.filter(
      (r) =>
        r.id !== room.id ||
        r.name !== room.name ||
        r.date !== room.date ||
        r.start !== room.start ||
        r.duration !== room.duration ||
        r.people !== room.people ||
        r.use !== room.use ||
        r.comments !== room.comments
      )
    );
  };

  const clearRooms = () => {
    setSelectedRooms([]);
  };

  return (
    <SelectedRoomsContext.Provider value={{ selectedRooms, addRoom, clearRooms, removeRoom, initialTime, setInitialTime }}>
      {children}
    </SelectedRoomsContext.Provider>
  );
};