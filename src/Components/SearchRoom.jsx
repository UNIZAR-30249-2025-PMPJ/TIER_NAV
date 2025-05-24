import React, { useContext, useState } from 'react';
import { Url } from '../utils/url';
import { SearchRoomsContext } from '../contexts/SearchRoomsContext';

const initialFilters = {
  identifier: '',
  category: '',
  maxOccupants: '',
  floor: '',
};

const InputField = ({ label, name, type = 'text', value, onChange }) => (
  <label className="text-secondary font-medium block">
    {label}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
    />
  </label>
);

const SearchRooms = () => {
  const [filters, setFilters] = useState(initialFilters);
  const { setAvailableRooms } = useContext(SearchRoomsContext);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Build query parameters for the API request
  const buildQueryParams = () => {
    const params = new URLSearchParams({ reservable: true });

    if (filters.identifier) params.append('id', filters.identifier);
    if (filters.maxOccupants) params.append('maxOccupants', filters.maxOccupants);
    if (filters.category) params.append('reservabilityCategory', filters.category);
    if (filters.floor) params.append('floor', filters.floor);

    return params.toString();
  };

  // Format room data for better usability
  const formatRoomData = (rooms) =>
    rooms.map((room) => ({
      id: room.id,
      name: room.name,
      category: room.reservabilityCategory?.name || 'N/A',
      maxUsage: room.maxUsage ?? 'N/A',
      maxOccupants: room.maxOccupants ?? 'N/A',
      floor: room.floor ?? 'N/A',
      capacity: Math.floor(((room.maxOccupants || 0) * (room.maxUsage || 0)) / 100),
      assignedTo: typeof room.assignedTo === 'object' ? room.assignedTo.id : room.assignedTo || 'N/A',
    }));

  // Handle the search action
  const handleSearch = async () => {
    try {
      const query = buildQueryParams();
      const response = await fetch(`${Url}/spaces?${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch rooms: ${response.statusText}`);
      }

      const data = await response.json();

      const formatted = formatRoomData(data);
      setAvailableRooms(formatted);



    } catch (error) {
      console.error('Error fetching rooms:', error);
      alert('An error occurred while searching for rooms. Please try again.');
    }
  };

  return (
    <div className="w-full h-full bg-white p-6 rounded-xl shadow-md flex flex-col">
      <h2 className="text-2xl font-semibold text-secondary mb-6 text-center">Search for a Room</h2>
      <div className="flex flex-col gap-4 flex-grow h-full ">
        <InputField
          label="Identifier"
          name="identifier"
          value={filters.identifier}
          onChange={handleChange}
        />
        <InputField
          label="Category"
          name="category"
          value={filters.category}
          onChange={handleChange}
        />
        <InputField
          label="Capacity"
          name="maxOccupants"
          type="number"
          value={filters.maxOccupants}
          onChange={handleChange}
        />
        <InputField
          label="Floor"
          name="floor"
          value={filters.floor}
          onChange={handleChange}
        />
      </div>
      <button
        onClick={handleSearch}
        className="mt-6 bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition duration-300 w-full"
      >
        Search
      </button>
    </div>
  );
};

export default SearchRooms;
