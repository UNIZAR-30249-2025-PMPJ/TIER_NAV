import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../utils/constants';
import { useRoomSelection } from '../contexts/RoomSelectionContext';
import { useAvailableRooms } from '../contexts/AvailableRoomsContext';
import { useUser } from '../contexts/UserContext';
import { Url } from '../utils/url';

const RoomList = () => {
    const { selectedRooms } = useRoomSelection();
    const { availableRooms } = useAvailableRooms();
    const { user } = useUser();
    const navigate = useNavigate();

    const personId = user.id;

    const handleViewDetails = (room) => {
        navigate(routes.roomdetails, {
            state: { room },
        });
    };

    const handleBook = async () => {
        try {

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

                const response = await fetch(`${Url}/api/reservations`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        usage: room.use,
                        startTime,
                        duration: parseInt(room.duration),
                        maxAttendees: parseInt(room.people),
                        personId: personId,
                        spaceId: room.id,
                    }),

                });

                if (!response.ok) {
                    throw new Error(`Reservation failed for ${room.name}`);
                }
            }

            navigate(routes.bookingsuccess);
        } catch (error) {
            console.error('Booking error:', error);
            alert('One or more bookings failed.');
        }
    };

    return (
        <div className="p-10 flex justify-center gap-20 text-secondary">
            <div className="bg-gray-100 rounded-xl p-6 shadow-md w-[500px]">
                <h2 className="text-2xl font-semibold mb-4">Spaces:</h2>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-300">
                            <th className="pb-2">Room</th>
                            <th className="pb-2">Category</th>
                            <th className="pb-2">Capacity</th>
                            <th className="pb-2">Floor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {availableRooms.map((room) => (
                            <tr
                                key={room.id}
                                className="border-b border-gray-200 hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleViewDetails(room)}
                            >
                                <td className="py-2">{room.name}</td>
                                <td className="py-2">{room.category}</td>
                                <td className="py-2">{room.capacity}</td>
                                <td className="py-2">{room.floor}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-gray-100 rounded-xl p-6 shadow-md w-[400px] flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Selected rooms:</h2>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-300">
                                <th className="pb-2">Room</th>
                                <th className="pb-2">Start</th>
                                <th className="pb-2">Date</th>
                                <th className="pb-2">Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedRooms.map((room, index) => (
                                <tr key={index} className="border-b border-gray-200">
                                    <td className="py-2">{room.name}</td>
                                    <td className="py-2">{room.start}</td>
                                    <td className="py-2">{room.date}</td>
                                    <td className="py-2">{room.duration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button
                    onClick={handleBook}
                    className="mt-6 bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition duration-300 self-center"
                >
                    Book
                </button>
            </div>
        </div>
    );
};

export default RoomList;
