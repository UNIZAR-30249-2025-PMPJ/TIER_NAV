import React from 'react';

const ItemSelectedRoom = ({ room, removeRoom }) => {
  return (
    <li className="shadow-md p-3 rounded bg-third flex items-center justify-between">
      <div>
        <p><strong className="text-secondary">Name:</strong> {room.name}</p>
        <p><strong className="text-secondary">Start:</strong> {room.start}</p>
        <p><strong className="text-secondary">Date:</strong> {room.date}</p>
        <p><strong className="text-secondary">Duration:</strong> {room.duration}</p>
      </div>
      <button
        onClick={() => removeRoom(room)}
        className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
      >
        Remove
      </button>
    </li>
  );
};

export default ItemSelectedRoom;