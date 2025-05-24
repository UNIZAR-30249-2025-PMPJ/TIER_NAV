
import SearchRooms from '../Components/SearchRoom';
import RoomsSearched from '../Components/RoomsSearched';
import RoomsSelected from '../Components/RoomsSelected';
import { BookingData } from '../Components/BookingData';

export const Search = () => {
  return (
    <div className="h-screen w-screen bg-white flex justify-center items-start p-8 overflow-auto">
      <div className="grid grid-cols-4 gap-6 w-full h-[90%] ">
        
        {/* Left Column */}
        <div className="flex flex-col gap-6 h-full">
          <div className="bg-gray-100 p-4 rounded shadow flex-grow min-h-[650px] h-full ">
            <SearchRooms />
          </div>
          
        </div>
        <div className="flex flex-col gap-6 h-full">
          <div className="bg-gray-100 p-4 rounded shadow flex-grow min-h-[650px] ">
            <RoomsSearched />
          </div>
          
        </div>
        <div className="flex flex-col gap-6 h-full">
          <div className="bg-gray-100 p-4 rounded shadow flex-grow min-h-[650px] ">
            <RoomsSelected />
          </div>
          
        </div>
        <div className="flex flex-col gap-6 h-full">
          <div className="bg-gray-100 p-4 rounded shadow flex-grow min-h-[650px] ">
            <BookingData />
          </div>
          
        </div>
        

      </div>
    </div>
  );
};

export default Search;
