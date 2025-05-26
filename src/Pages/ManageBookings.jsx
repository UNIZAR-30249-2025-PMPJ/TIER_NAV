import React, { useEffect, useState, useContext } from 'react';
import { Url } from '../utils/url';
import { UserContext } from '../contexts/UserContext';

const ManageBookings = () => {
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user?.role === 'Manager' || user?.role === 'Manager & Teacher') {
      fetchAllBookings();
    }
  }, [user]);

  const fetchAllBookings = async () => {
    try {
      const response = await fetch(`${Url}/reservations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const json = await response.json();

      const formatted = json.map(res => {
        const start = new Date(res.startTime);
        const end = new Date(start.getTime() + res.duration * 60000);

        return {
          id: res.id,
          identifier: res.spaceId,
          userId: res.personId,
          people: res.maxAttendees,
          state: res.state,
          date: start.toLocaleDateString('es-ES'),
          start: start.toTimeString().slice(0, 5),
          end: end.toTimeString().slice(0, 5),
        };
      });

      setBookings(formatted);
    } catch (err) {
      console.error('Error fetching all reservations:', err);
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
        setBookings(prev => prev.filter(b => b.id !== id));
      } else {
        console.error('Failed to delete booking.');
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
    }
  };

  const updateState = async (id, newState) => {
    try {
      const response = await fetch(`${Url}/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ state: newState }),
      });

      if (response.ok) {
        setBookings(prev =>
          prev.map(b => (b.id === id ? { ...b, state: newState } : b))
        );
      } else {
        console.error('Failed to update booking state.');
      }
    } catch (err) {
      console.error('Error updating booking state:', err);
    }
  };

  if (!user || user.role !== 'Manager' && user.role !== 'Manager & Teacher') {
    return <div className="p-10 text-center text-red-500">Access denied. Manager only.</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-primary mb-4">All Bookings</h1>
      <div className="bg-gray-100 rounded-xl p-6 shadow-md overflow-x-auto">
        <table className="w-full text-left text-md text-secondary">
          <thead>
            <tr className="border-b border-blue-300">
              <th className="pb-2">Space</th>
              <th className="pb-2">User ID</th>
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
                <td className="py-2">{booking.userId}</td>
                <td className="py-2">{booking.people}</td>
                <td className="py-2">{booking.date}</td>
                <td className="py-2">{booking.start}</td>
                <td className="py-2">{booking.end}</td>
                <td className="py-2">
                  <select
                    value={booking.state}
                    onChange={(e) => updateState(booking.id, e.target.value)}
                    className="bg-white border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="POTENTIALLY_INVALID">Potentially invalid</option>
                  </select>
                </td>
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
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
