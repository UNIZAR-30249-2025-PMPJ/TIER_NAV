import { useContext, useState } from "react";
import { routes } from '../utils/constants';
import { UserContext } from '../contexts/UserContext';
import { SelectedRoomsContext } from '../contexts/SelectedRoomsContext';
import { SearchRoomsContext } from '../contexts/SearchRoomsContext';
import { useNavigate } from "react-router-dom";
import { Url } from "../utils/url";



export const BookingData = () => {

    const {selectedRooms, clearRooms} = useContext(SelectedRoomsContext);
    const {clearAvailableRooms} = useContext(SearchRoomsContext);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const personId = user.id;
    const [form, setForm] = useState({
            use: '',
            people: '',
            duration: '',
            comments: '',
            start: '',
            date: '',
        });
    

    const handleSubmit = async (e) => {

        e.preventDefault();

        const { start, duration, date, people, use, comments } = form;
        if (!start || !duration || !date || !people || !use || !comments.trim()) {
            alert('Please fill in all fields.');
            return;
        }
        //date is in YYYY-MM-DD format and we need to convert it to DD/MM/YYYY
        const [year, month, day] = date.split('-');
        const formattedDate = `${day}/${month}/${year}`;
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

        if (!timeRegex.test(start)) {
            alert('Start must be in HH:mm format (e.g. 09:00).');
            return;
        }

        if (!dateRegex.test(formattedDate)) {
            alert('Date must be in DD/MM/YYYY format (e.g. 01/05/2025).');
            return;
        }

        const numberOfPeople = parseInt(people, 10);
        if (isNaN(numberOfPeople) || numberOfPeople <= 0) {
            alert('Number of people must be a positive integer.');
            return;
        }



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
            clearRooms();
        clearAvailableRooms();
      
        navigate(routes.bookingsuccess);
        } catch (error) {
        console.error('Booking error:', error);
        alert('One or more bookings failed.');
        }
    };
    

  const BookingForm = ({ form, handleChange, handleSubmit }) => (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-grow h-full justify-between ">
        {[
            { label: 'Use', name: 'use', type: 'text' },
            { label: 'Number of people', name: 'people', type: 'number' },
            { label: 'Start', name: 'start', type: 'time', placeholder: 'ex: 08:30' },
            { label: 'Duration (minutes)', name: 'duration', type: 'text' },
            { label: 'Date', name: 'date', type: 'date', placeholder: 'ex: 01/05/2025' },
        ].map(({ label, name, type, placeholder }) => (
            <div className="flex flex-col gap-4 " key={name}>
                <label className="font-medium">{label}</label>
                <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    readOnly={name === 'date' || name === 'start'}
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
        <div className="flex justify-center mt-6">
            <button
                onClick={handleSubmit}
                className="mt-6 bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition duration-300 w-full"
            >
            Book
            </button>
        </div>
    </form>
);

const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

return (
   <div className="w-full h-full bg-white p-6 rounded-xl shadow-md flex flex-col ">
        <h2 className="text-2xl font-semibold text-secondary mb-6 text-center">Booking information</h2>
        <div className="flex flex-col gap-4 flex-grow h-full justify-between">
            <BookingForm
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />
        </div>
        
    </div>
)
}
