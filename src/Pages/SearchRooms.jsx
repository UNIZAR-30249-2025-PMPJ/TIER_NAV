import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../utils/constants';
import { Url } from '../utils/url';
import { useRoomSelection } from '../contexts/RoomSelectionContext';
import { useAvailableRooms } from '../contexts/AvailableRoomsContext';

const SearchRooms = () => {
  const { clearRooms } = useRoomSelection();
  const { updateAvailableRooms } = useAvailableRooms();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    identifier: '',
    category: '',
    maxOccupants: '',
    floor: '',
  });

  useEffect(() => {
    clearRooms();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams();

      if (filters.identifier) queryParams.append('id', filters.identifier);
      if (filters.maxOccupants) queryParams.append('maxOccupants', filters.maxOccupants);
      if (filters.category) queryParams.append('reservabilityCategory', filters.category);
      if (filters.floor) queryParams.append('floor', filters.floor);

      queryParams.append('reservable', true);

      const response = await fetch(Url + `/spaces?${queryParams.toString()}`);
      const data = await response.json();

      const formatted = data.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.reservabilityCategory?.name || 'N/A',
        maxUsage: item.maxUsage || 'N/A',
        maxOccupants: item.maxOccupants || 'N/A',
        floor: item.floor || 'N/A',
        capacity: Math.floor((item.maxOccupants || 0) * (item.maxUsage || 0) / 100),
      }));

      updateAvailableRooms(formatted);

      navigate(routes.roomlist);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      alert('An error occurred while searching for rooms.');
    }
  };


  return (
    <div className="h-screen w-screen bg-white flex flex-col items-center justify-start pt-24">
      <div className="bg-third p-10 rounded-xl w-full max-w-md text-center shadow-md">
        <h2 className="text-3xl font-semibold text-secondary mb-6">Search for a Room</h2>
        <div className="flex flex-col gap-4 text-left">
          <label className="text-secondary font-medium">
            Identifier
            <input
              type="text"
              name="identifier"
              value={filters.identifier}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
            />
          </label>
          <label className="text-secondary font-medium">
            Category
            <input
              type="text"
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
            />
          </label>
          <label className="text-secondary font-medium">
            Capacity
            <input
              type="number"
              name="maxOccupants"
              value={filters.maxOccupants}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
            />
          </label>
          <label className="text-secondary font-medium">
            Floor
            <input
              type="text"
              name="floor"
              value={filters.floor}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
            />
          </label>
        </div>
        <button
          onClick={handleSearch}
          className="mt-6 bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition duration-300"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchRooms;
