import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from '../utils/constants';
import { Url } from '../utils/url';
import { SearchRoomsContext } from '../contexts/SearchRoomsContext';
import { SelectedRoomsContext } from '../contexts/SelectedRoomsContext';

const RoomInfo = ({ room }) => (
    <div className="flex flex-col gap-2 text-lg w-full">
        {['name', 'category', 'capacity', 'floor'].map((key) => (
            <div key={key}>
                <span className="font-medium text-blue-500">{key.charAt(0).toUpperCase() + key.slice(1)}</span>{' '}
                <span className="text-black font-semibold">{room[key]}</span>
            </div>
        ))}
    </div>
);

const BookingForm = ({ form, handleChange, handleSubmit }) => (
    <form
        onSubmit={handleSubmit}
        className="bg-gray-100 rounded-xl p-6 shadow-md text-lg w-full flex flex-col gap-4"
    >
        {[
            { label: 'Use', name: 'use', type: 'text' },
            { label: 'Number of people', name: 'people', type: 'number' },
            { label: 'Start', name: 'start', type: 'text', placeholder: 'ex: 08:30' },
            { label: 'Duration (minutes)', name: 'duration', type: 'text' },
            { label: 'Date', name: 'date', type: 'text', placeholder: 'ex: 01/05/2025' },
        ].map(({ label, name, type, placeholder }) => (
            <div className="flex flex-col gap-2" key={name}>
                <label className="font-medium">{label}</label>
                <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="border border-gray-300 rounded px-3 py-2 text-black"
                />
            </div>
        ))}
        <div className="flex flex-col gap-2">
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
);

const HourGridCalendar = ({ bookedTimes }) => {
    const generateHalfHours = () => {
        const times = [];
        for (let i = 8; i < 20; i++) {
            times.push(`${i.toString().padStart(2, '0')}:00`);
            times.push(`${i.toString().padStart(2, '0')}:30`);
        }
        times.push('20:00');
        return times;
    };

    const sortedDates = [...Object.keys(bookedTimes)].sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('/').map(Number);
        const [dayB, monthB, yearB] = b.split('/').map(Number);
        return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
    });

    return (
        <div className="overflow-x-auto w-full max-w-5xl bg-gray-100 rounded-xl shadow-md">
            {Object.keys(bookedTimes).length === 0 ? (
                <div className="text-center py-6 text-gray-500 font-medium">
                    No reservations found for this room.
                </div>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: `80px repeat(${sortedDates.length}, 1fr)` }}>
                    <div className="border border-gray-600 bg-white"></div>
                    {sortedDates.map((date) => (
                        <div key={date} className="border border-gray-600 text-center py-2 font-semibold">
                            {date}
                        </div>
                    ))}
                    {generateHalfHours().map((time) => (
                        <React.Fragment key={time}>
                            <div className="border text-right pr-2 text-sm text-gray-600 h-6 flex items-center justify-end">
                                {time}
                            </div>
                            {sortedDates.map((date) => {
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
    );
};

const RoomBooking = () => {
    const navigate = useNavigate();
    const { availableRooms, clearAvailableRooms } = useContext(SearchRoomsContext);
    const { addRoom } = useContext(SelectedRoomsContext);
    const [bookedTimes, setBookedTimes] = useState({});
    const { id: roomId } = useParams();
    const room = availableRooms.find((room) => room.id === roomId);

    const [form, setForm] = useState({
        use: '',
        people: '',
        duration: '',
        comments: '',
        start: '',
        date: '',
    });

    useEffect(() => {
        const fetchReservations = async () => {
            if (!roomId) return;
            
                const response = await fetch(`${Url}/reservations?spaceId=${roomId}`);
                if (response.ok) {
                    
                    const json = await response.json();
                    const result = {};
                    json.forEach((res) => {
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
                }
            
        };

        fetchReservations();
    }, [roomId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { start, duration, date, people } = form;

        if (!start || !duration || !date || !people) {
            alert('Please fill in Start, Duration, Date and Number of people.');
            return;
        }

        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

        if (!timeRegex.test(start)) {
            alert('Start must be in HH:mm format (e.g. 09:00).');
            return;
        }

        if (!dateRegex.test(date)) {
            alert('Date must be in DD/MM/YYYY format (e.g. 01/05/2025).');
            return;
        }

        const numberOfPeople = parseInt(people, 10);
        if (isNaN(numberOfPeople) || numberOfPeople <= 0) {
            alert('Number of people must be a positive integer.');
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
        clearAvailableRooms();
        navigate(routes.searchrooms);
    };

    if (!room) {
        return <div className="text-center mt-20 text-red-500">Room not found.</div>;
    }

    return (
        <div className="p-10 flex flex-row items-stretch gap-10 text-secondary min-h-screen">
        {/* Left side: HourGridCalendar taking 2/3 of the space */}
        <div className="w-2/3 flex justify-center items-center">
            <HourGridCalendar bookedTimes={bookedTimes} />
        </div>
        
        {/* Right side: RoomInfo and BookingForm stacked, taking 1/3 of the space */}
        <div className="w-1/3 flex flex-col gap-6">
            <RoomInfo room={room} />
            <BookingForm 
            form={form} 
            handleChange={handleChange} 
            handleSubmit={handleSubmit} 
            />
        </div>
        </div>
    );
};

export default RoomBooking;