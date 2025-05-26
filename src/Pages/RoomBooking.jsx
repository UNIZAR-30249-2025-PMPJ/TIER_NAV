import React, { useState, useEffect, useContext } from 'react';
import {  useParams } from 'react-router-dom';
import { Url } from '../utils/url';
import { SearchRoomsContext } from '../contexts/SearchRoomsContext';
import { SelectedRoomsContext } from '../contexts/SelectedRoomsContext';
import Calendar  from '../Components/Calendar';

const RoomInfo = ({ room }) => (
    <div className="flex flex-col gap-2 text-lg w-full bg-white border border-secondary rounded-xl p-6 shadow-xl">
        {['name', 'category', 'capacity', 'floor', 'assignedTo'].map((key) => (
            <div key={key}>
                <span className="font-semibold text-secondary">{key.charAt(0).toUpperCase() + key.slice(1)}</span>{' '}
                <span className="text-black font-medium">{room[key]}</span>
                
            </div>
        ))}
    </div>
);


const RoomBooking = () => {
    const { availableRooms } = useContext(SearchRoomsContext);
    const { setInitialTime } = useContext(SelectedRoomsContext);
    const [bookedTimes, setBookedTimes] = useState({});
    const { id: roomId } = useParams();
    const room = availableRooms.find((room) => room.id === roomId);

    
    useEffect(() => {
        const fetchReservations = async () => {
            if (!roomId) return;
          
            const response = await fetch(`${Url}/reservations?spaceIds=${roomId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
          
            if (response.ok) {
              const json = await response.json();
              const result = {};
          
              json.forEach((res) => {
                const start = new Date(res.startTime); // UTC from DB
                const end = new Date(start.getTime() + res.duration * 60000);
          
                const dateKey = `${start.getUTCDate()}/${start.getUTCMonth() + 1}/${start.getUTCFullYear()}`; // no local shift
          
                if (!result[dateKey]) result[dateKey] = [];
          
                const slots = [];
                const current = new Date(start.getTime());
          
                while (current < end) {
                  const hour = current.getUTCHours().toString().padStart(2, "0");
                  const minutes = current.getUTCMinutes().toString().padStart(2, "0");
                  slots.push(`${hour}:${minutes}`);
                  current.setUTCMinutes(current.getUTCMinutes() + 30);
                }
          
                result[dateKey].push(...slots);
              });
          
              setBookedTimes(result);
            }
          };
          

        fetchReservations();
    }, [roomId]);

    

    

    if (!room) {
        return <div className="text-center mt-20 text-red-500">Room not found.</div>;
    }
    return (
        <div className="p-10 flex flex-row items-stretch gap-10 text-secondary min-h-screen">
        {/* Left side: HourGridCalendar taking 2/3 of the space */}
        <div className="w-2/3 flex justify-center items-center">
            <Calendar bookings={bookedTimes} room={room} setTime={({ date, time }) => {
                setInitialTime({ date, time } );}} 
            />
        </div>
        
        {/* Right side: RoomInfo and BookingForm stacked, taking 1/3 of the space */}
        <div className="w-1/3 flex flex-col gap-6">
            <RoomInfo room={room} />
            
        </div>
        </div>
    );
};

export default RoomBooking;