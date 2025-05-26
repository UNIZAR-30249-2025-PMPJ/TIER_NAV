import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Url } from '../utils/url';

const Bookings = () => {
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchUserBookings();
  }, [user]);

  const fetchUserBookings = async () => {
    if (!user || !user.id) return;

    try {
      const response = await fetch(`${Url}/reservations?personId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const json = await response.json();

      const formatted = json.map(res => {
        console.log(res, 'res', new Date(res.startTime))
        const start = new Date(res.startTime);
        const end = new Date(start.getTime() + res.duration * 60000);

        return {
          id: res.id,
          identifier: res.spaceId,
          people: res.maxAttendees,
          date: start.toLocaleDateString('es-ES'),
          start: start.toTimeString().slice(0, 5),
          end: end.toTimeString().slice(0, 5),
          state: res.state,
        };
      });

      setBookings(formatted);
    } catch (err) {
      console.error('Error fetching reservations:', err);
    }
  };

  const deleteBooking = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${Url}/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setBookings((prev) => prev.filter(b => b.id !== id));
      } else {
        console.error('Failed to delete booking.');
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
    }
  };

  if (!user) {
    return <div className="p-10 text-center text-red-500">User not connected.</div>;
  }
  return (
    <div className="p-10">
      {/* User Info */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-primary mb-2">User info</h1>
        <p className="text-lg text-black"><span className="font-semibold">Name:</span> {user.name}</p>
        <p className="text-lg text-black"><span className="font-semibold">Email:</span> {user.email}</p>
        <p className="text-lg text-black"><span className="font-semibold">Role:</span> {user.role}</p>
      </div>

      {/* Bookings Table */}
      <div className="bg-gray-100 rounded-xl p-6 shadow-md overflow-x-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">My Bookings</h1>
        <table className="w-full text-left text-md text-secondary">
          <thead>
            <tr className="border-b border-blue-300">
              <th className="pb-2">Identifier</th>
              <th className="pb-2">People</th>
              <th className="pb-2">Date</th>
              <th className="pb-2">Start</th>
              <th className="pb-2">End</th>
              <th className="pb-2">State</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-blue-200 text-black">
                <td className="py-2">{booking.identifier}</td>
                <td className="py-2">{booking.people}</td>
                <td className="py-2">{booking.date}</td>
                <td className="py-2">{booking.start}</td>
                <td className="py-2">{booking.end}</td>
                <td className="py-2">{booking.state}</td>
                <td className="py-2">
                  <button
                    onClick={() => deleteBooking(booking.id)}
                    className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;
