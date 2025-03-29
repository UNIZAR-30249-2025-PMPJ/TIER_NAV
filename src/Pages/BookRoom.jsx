import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookRoom = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // exemple
  const Room = {
    id: 1,
    identifier: 'A0.5',
    category: 'Class',
    capacity: 65,
    floor: 0,
    image: '',
  };

  const room = state?.room || Room;
  const day = state?.day || '2025-03-27';
  const time = state?.time || '10:00';

  const [form, setForm] = useState({
    use: '',
    people: '',
    duration: '',
    comments: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const booking = {
      roomId: room.id,
      day,
      time,
      ...form,
    };

    console.log('Booking submitted:', booking);
    navigate('/my-bookings');
  };

  if (!room) {
    return (
      <div className="text-center mt-20 text-red-500">
        Room not found.
      </div>
    );
  }

  return (
    <div className="p-10 flex flex-col items-center gap-10 text-secondary">
      {/* Room info + image */}
      <div className="flex justify-center items-start gap-20 w-full max-w-5xl">
        <div className="flex flex-col gap-2 text-lg">
          <div>
            <span className="font-medium">Identifier</span>{' '}
            <span className="text-black font-semibold">{room.identifier}</span>
          </div>
          <div>
            <span className="font-medium">Category</span>{' '}
            <span className="text-black font-semibold">{room.category}</span>
          </div>
          <div>
            <span className="font-medium">Capacity</span>{' '}
            <span className="text-black font-semibold">{room.capacity}</span>
          </div>
          <div>
            <span className="font-medium">Floor</span>{' '}
            <span className="text-black font-semibold">{room.floor}</span>
          </div>
        </div>

        <img
          src={room.imageUrl}
          alt="Room layout"
          className="rounded-lg shadow-md w-64 h-48 object-cover"
        />
      </div>

      {/* Booking form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 rounded-xl p-8 shadow-md w-full max-w-3xl text-secondary text-lg"
      >
        <div className="grid grid-cols-2 gap-6 items-center mb-6">
          <label className="font-medium">Use</label>
          <input
            type="text"
            name="use"
            value={form.use}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full text-black"
          />

          <label className="font-medium">Number of people</label>
          <input
            type="number"
            name="people"
            value={form.people}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full text-black"
          />

          <label className="font-medium">Start</label>
          <div className="flex gap-4 col-span-2">
            <input
              type="text"
              readOnly
              value={day}
              className="border border-gray-300 rounded px-3 py-2 w-full text-black"
            />
            <input
              type="text"
              readOnly
              value={time}
              className="border border-gray-300 rounded px-3 py-2 w-full text-black"
            />
          </div>

          <label className="font-medium">Duration</label>
          <input
            type="text"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full text-black"
          />

          <label className="font-medium">Comments</label>
          <textarea
            name="comments"
            value={form.comments}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full text-black"
            rows={3}
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-primary text-white px-8 py-2 text-lg rounded-md hover:bg-secondary transition"
          >
            Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookRoom;
