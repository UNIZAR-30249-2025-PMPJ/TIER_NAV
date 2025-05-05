import React from 'react';
import SearchRooms from '../Components/SearchRoom';
import RoomsSearched from '../Components/RoomsSearched';
import RoomsSelected from '../Components/RoomsSelected';

export const Search = () => {
  return (
    <div className="h-screen w-screen bg-white flex justify-center items-start p-8">
      <div className="flex w-full max-w-7xl gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6 w-1/2">
          <div className="flex-1 bg-gray-100 p-4 rounded shadow h-full w-full">
            <SearchRooms />
          </div>
          <div className="flex-1 bg-gray-100 p-4 rounded shadow h-full">
            <RoomsSelected />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 bg-gray-100 p-4 rounded shadow h-full">
          <RoomsSearched />
        </div>
      </div>
    </div>
  );
};

export default Search;