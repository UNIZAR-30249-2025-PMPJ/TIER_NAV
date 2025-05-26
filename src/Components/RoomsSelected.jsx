import { useContext } from 'react';

import { SelectedRoomsContext } from '../contexts/SelectedRoomsContext';
import ItemSelectedRoom from './ItemSelectedRoom';


const RoomsSelected = () => {
  const {selectedRooms, removeRoom, initialTime} = useContext(SelectedRoomsContext);


  

  return (
    <div className="bg-white p-4 rounded shadow w-full h-full">
      <h3 className="text-2xl text-secondary font-semibold mb-4">Selected Rooms</h3>
      {selectedRooms.length === 0 ? (
        <p className="text-secondary text-center">No rooms selected.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {selectedRooms.map((room, index) => (
              <ItemSelectedRoom key={index} room={room} initialTime={initialTime} removeRoom={removeRoom} />
            ))}
          </ul>
          
        </>
      )}
    </div>
  );
};
export default RoomsSelected;