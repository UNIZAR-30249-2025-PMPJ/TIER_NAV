import React, { createContext, useContext, useState, useEffect } from 'react';

const AvailableRoomsContext = createContext();

export const useAvailableRooms = () => useContext(AvailableRoomsContext);

export const AvailableRoomsProvider = ({ children }) => {
  const [availableRooms, setAvailableRooms] = useState(() => {
    const stored = localStorage.getItem('availableRooms');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('availableRooms', JSON.stringify(availableRooms));
  }, [availableRooms]);

  const updateAvailableRooms = (rooms) => {
    setAvailableRooms(rooms);
  };

  const clearAvailableRooms = () => {
    setAvailableRooms([]);
  };

  return (
    <AvailableRoomsContext.Provider
      value={{ availableRooms, updateAvailableRooms, clearAvailableRooms }}
    >
      {children}
    </AvailableRoomsContext.Provider>
  );
};
