import React, { createContext, useContext, useState, useEffect } from 'react';

const RoomSelectionContext = createContext();

export const useRoomSelection = () => useContext(RoomSelectionContext);

export const RoomSelectionProvider = ({ children }) => {
  const [selectedRooms, setSelectedRooms] = useState(() => {
    const stored = localStorage.getItem('selectedRooms');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('selectedRooms', JSON.stringify(selectedRooms));
  }, [selectedRooms]);

  const addRoom = (room) => {
    setSelectedRooms((prev) => [...prev, room]);
  };

  const clearRooms = () => {
    setSelectedRooms([]);
  };

  return (
    <RoomSelectionContext.Provider value={{ selectedRooms, addRoom, clearRooms }}>
      {children}
    </RoomSelectionContext.Provider>
  );
};
