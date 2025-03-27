import React, { useState } from 'react';

const SearchRooms = () => {
  const [filters, setFilters] = useState({
    identifier: '',
    category: '',
    capacity: '',
    floor: '',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    // Add logic
    console.log('Searching with filters:', filters);
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
              name="capacity"
              value={filters.capacity}
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
