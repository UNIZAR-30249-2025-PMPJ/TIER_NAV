import React, { useContext } from 'react';


import { useNavigate } from 'react-router-dom';
import { Url } from '../utils/url';
import { routes } from '../utils/constants';
import { UserContext } from '../contexts/UserContext';
import { SelectedRoomsContext } from '../contexts/SelectedRoomsContext';
import ItemSelectedRoom from './ItemSelectedRoom';
import { SearchRoomsContext } from '../contexts/SearchRoomsContext';

const RoomsSelected = () => {
  const {selectedRooms, removeRoom} = useContext(SelectedRoomsContext);
  const {clearAvailableRooms} = useContext(SearchRoomsContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const personId = user.id;

  const handleBook = async () => {
    try {
      //TODO: Ahora solo se hace una unica reserva en al que se incluyen todas las salas seleccionadas
      for (const room of selectedRooms) {
        let startTime;
        if (room.date.includes('/')) {
          const [day, month, year] = room.date.split('/');
          const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          const isoTime = room.start.padStart(5, '0');
          startTime = `${isoDate}T${isoTime}:00`;
        } else {
          startTime = `${room.date}T${room.start.padStart(5, '0')}:00`;
        }
        const response = await fetch(`${Url}/reservations`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            usage: room.use,
            startTime,
            duration: parseInt(room.duration),
            maxAttendees: parseInt(room.people),
            personId,
            spaceId: room.id,
            description: room.comments,
          }),
        });

        if (!response.ok) {
          throw new Error(`Reservation failed for ${room.name}`);
        }
      }

      clearAvailableRooms();
      
      navigate(routes.bookingsuccess);
    } catch (error) {
      console.error('Booking error:', error);
      alert('One or more bookings failed.');
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow w-full mt-6">
      <h3 className="text-2xl text-secondary font-semibold mb-4">Selected Rooms</h3>
      {selectedRooms.length === 0 ? (
        <p className="text-secondary text-center">No rooms selected.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {selectedRooms.map((room, index) => (
              <ItemSelectedRoom key={index} room={room} removeRoom={removeRoom} />
            ))}
          </ul>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleBook}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition duration-300"
            >
              Book
            </button>
          </div>
        </>
      )}
    </div>
  );
};
export default RoomsSelected;