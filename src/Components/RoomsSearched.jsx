import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { SearchRoomsContext } from '../contexts/SearchRoomsContext';


const ITEMS_PER_PAGE = 5;

const RoomsSearched = () => {
  const  { availableRooms }  = useContext(SearchRoomsContext);
  const navigate = useNavigate();
  const sorted = availableRooms.sort((a, b) => a.id.localeCompare(b.id)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRooms = sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  

  const handleViewDetails = (room) => {
    navigate(`/roomdetails/${room.id}`);
  };

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="bg-white p-4 rounded shadow w-full h-full">
      <h3 className="text-2xl text-secondary font-semibold mb-4">Available Rooms</h3>
      {availableRooms.length === 0 ? (
        <p className="text-secondary text-center">No rooms found.</p>
      ) : (
        <>
          <ul className="space-y-2 h-[88%] ">
            {currentRooms.map((room) => (
              <li
                key={room.id}
                className="shadow-md p-3 rounded bg-third cursor-pointer hover:shadow-lg transition"
                onClick={() => handleViewDetails(room)}
              >
                <p><strong className="text-secondary">Id:</strong> {room.id}</p>
                <p><strong className="text-secondary">Name:</strong> {room.name}</p>
                <p><strong className="text-secondary">Category:</strong> {room.category}</p>
                <p><strong className="text-secondary">Floor:</strong> {room.floor}</p>
                <p><strong className="text-secondary">Capacity:</strong> {room.capacity}</p>
                <p><strong className="text-secondary">Assigned to:</strong> {room.assignedTo}</p>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className="flex justify-between align-bottom items-center mt-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
export default RoomsSearched;