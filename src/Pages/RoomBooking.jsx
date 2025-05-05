import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRoomSelection } from '../contexts/RoomSelectionContext';
import { useAvailableRooms } from '../contexts/AvailableRoomsContext';
import { routes } from '../utils/constants';
import { Url } from '../utils/url';

const RoomBooking = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addRoom } = useRoomSelection();
    const { availableRooms } = useAvailableRooms();
    const [bookedTimes, setBookedTimes] = useState({});

    const roomId = location.state?.room?.id;
    const room = availableRooms.find((r) => r.id === roomId);

    const [form, setForm] = useState({
        use: '',
        people: '',
        duration: '',
        comments: '',
        start: '',
        date: '',
    });

    if (!room) {
        return <div className="text-center mt-20 text-red-500">Room not found.</div>;
    }

    useEffect(() => {
        const fetchReservations = async () => {
          if (!roomId) return;
          try {
            const response = await fetch(`${Url}/api/reservations?spaceId=${roomId}`);
            const json = await response.json();
            const result = {};
            json.forEach(res => {
                const start = new Date(res.startTime);
                const end = new Date(start.getTime() + res.duration * 60000);
                const dateKey = start.toLocaleDateString('es-ES');
              
                if (!result[dateKey]) result[dateKey] = [];
              
                const slots = [];
                const current = new Date(start);
              
                while (current < end) {
                  const hour = current.getHours().toString().padStart(2, '0');
                  const minutes = current.getMinutes().toString().padStart(2, '0');
                  slots.push(`${hour}:${minutes}`);
                  current.setMinutes(current.getMinutes() + 30);
                }
              
                result[dateKey].push(...slots);
              });
              
      
            setBookedTimes(result);
          } catch (err) {
            console.error("Failed to fetch reservations:", err);
          }
        };
      
        fetchReservations();
      }, [roomId]);

    const generateHalfHours = () => {
        const times = [];
        for (let i = 8; i < 20; i++) {
            times.push(`${i.toString().padStart(2, '0')}:00`);
            times.push(`${i.toString().padStart(2, '0')}:30`);
        }
        times.push("20:00");
        return times;
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const { start, duration, date, people } = form;
    
        if (!start || !duration || !date || !people) {
            alert("Please fill in Start, Duration, Date and Number of people.");
            return;
        }
    
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    
        if (!timeRegex.test(start)) {
            alert("Start must be in HH:mm format (e.g. 09:00).");
            return;
        }
    
        if (!dateRegex.test(date)) {
            alert("Date must be in DD/MM/YYYY format (e.g. 01/05/2025).");
            return;
        }
    
        const numberOfPeople = parseInt(people, 10);
        if (isNaN(numberOfPeople) || numberOfPeople <= 0) {
            alert("Number of people must be a positive integer.");
            return;
        }
    
        if (numberOfPeople > room.capacity) {
            alert(`Number of people cannot exceed room capacity (${room.capacity}).`);
            return;
        }
    
        const booking = {
            id: room.id,
            name: room.name,
            category: room.category,
            capacity: room.capacity,
            floor: room.floor,
            people,
            date,
            start,
            duration: form.duration,
            comments: form.comments,
            use: form.use,
        };
    
        addRoom(booking);
    
        navigate(routes.roomlist);
    };

    return (
        <div className="p-10 flex flex-col items-center gap-10 text-secondary">
            {/* Hour Grid Calendar */}
            <div className="overflow-x-auto w-full max-w-5xl bg-gray-100 rounded-xl shadow-md">
            {Object.keys(bookedTimes).length === 0 ? (
                <div className="text-center py-6 text-gray-500 font-medium">
                No reservations found for this room.
                </div>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: `80px repeat(${Object.keys(bookedTimes).length}, 1fr)` }}>
                {/* Header row */}
                <div className="border border-gray-600 bg-white"></div>
                {[...Object.keys(bookedTimes)].sort((a, b) => {
                    const [dayA, monthA, yearA] = a.split('/').map(Number);
                    const [dayB, monthB, yearB] = b.split('/').map(Number);
                    return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
                }).map(date => (
                    <div key={date} className="border border-gray-600 text-center py-2 font-semibold">{date}</div>
                ))}

                {/* Time rows */}
                {generateHalfHours().map(time => (
                    <React.Fragment key={time}>
                    {/* Left time label */}
                    <div className="border text-right pr-2 text-sm text-gray-600 h-6 flex items-center justify-end">
                        {time}
                    </div>
                    {[...Object.keys(bookedTimes)].sort((a, b) => {
                        const [dayA, monthA, yearA] = a.split('/').map(Number);
                        const [dayB, monthB, yearB] = b.split('/').map(Number);
                        return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
                    }).map(date => {
                        const isBooked = bookedTimes[date]?.includes(time);
                        return (
                        <div
                            key={date + time}
                            className={`border border-gray-400 h-6 ${isBooked ? 'bg-gray-300' : 'bg-white'}`}
                        ></div>
                        );
                    })}
                    </React.Fragment>
                ))}
                </div>
            )}
            </div>


            {/* Room info + form */}
            <div className="w-full max-w-5xl flex gap-10 justify-between">
                <div className="flex flex-col gap-2 text-lg w-1/2">
                    <div>
                        <span className="font-medium text-blue-500">Room</span>{' '}
                        <span className="text-black font-semibold">{room.name}</span>
                    </div>
                    <div>
                        <span className="font-medium text-blue-500">Category</span>{' '}
                        <span className="text-black font-semibold">{room.category}</span>
                    </div>
                    <div>
                        <span className="font-medium text-blue-500">Capacity</span>{' '}
                        <span className="text-black font-semibold">{room.capacity}</span>
                    </div>
                    <div>
                        <span className="font-medium text-blue-500">Floor</span>{' '}
                        <span className="text-black font-semibold">{room.floor}</span>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-100 rounded-xl p-6 shadow-md text-lg w-1/2 flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-2">
                        <label className="font-medium">Use</label>
                        <input
                            type="text"
                            name="use"
                            value={form.use}
                            onChange={handleChange}
                            className="border border-gray-300 rounded px-3 py-2 text-black"
                        />

                        <label className="font-medium">Number of people</label>
                        <input
                            type="number"
                            name="people"
                            value={form.people}
                            onChange={handleChange}
                            className="border border-gray-300 rounded px-3 py-2 text-black"
                        />

                        <label className="font-medium">Start</label>
                        <input
                            type="text"
                            name="start"
                            value={form.start}
                            onChange={handleChange}
                            placeholder="ex: 08:30"
                            className="border border-gray-300 rounded px-3 py-2 text-black"
                        />

                        <label className="font-medium">Duration (minutes)</label>
                        <input
                            type="text"
                            name="duration"
                            value={form.duration}
                            onChange={handleChange}
                            className="border border-gray-300 rounded px-3 py-2 text-black"
                        />

                        <label className="font-medium">Date</label>
                        <input
                            type="text"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            placeholder="ex: 01/05/2025"
                            className="border border-gray-300 rounded px-3 py-2 text-black"
                        />

                        <label className="font-medium">Comments</label>
                        <textarea
                            name="comments"
                            value={form.comments}
                            onChange={handleChange}
                            rows={3}
                            className="border border-gray-300 rounded px-3 py-2 text-black"
                        />
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoomBooking;
