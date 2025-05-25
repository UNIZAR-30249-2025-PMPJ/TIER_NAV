import React, { useEffect, useState, useContext } from 'react';
import { Url } from '../utils/url';
import { UserContext } from '../contexts/UserContext';

const DEPARTMENTS = [
  'Computer Science and Systems Engineering',
  'Electronic Engineering and Communications'
];

const EINA = "EINA - ADA BYRON";

const ManageSpace = () => {
  const { user } = useContext(UserContext);
  const [filters, setFilters] = useState({ identifier: '', category: '', maxOccupants: '', floor: '' });
  const [availableRooms, setAvailableRooms] = useState([]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (filters.identifier) params.append('id', filters.identifier);
    if (filters.maxOccupants) params.append('maxOccupants', filters.maxOccupants);
    if (filters.category) params.append('reservabilityCategory', filters.category);
    if (filters.floor) params.append('floor', filters.floor);
    return params.toString();
  };

  const handleSearch = async () => {
    try {
      const query = buildQueryParams();
      const response = await fetch(`${Url}/spaces?${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch rooms: ${response.statusText}`);
      const data = await response.json();
      const formatted = data.map((room) => ({
        id: room.id,
        name: room.name,
        category: room.reservabilityCategory?.name || 'N/A',
        reservable: room.reservable,
        maxUsage: room.maxUsage ?? 'N/A',
        maxOccupants: room.maxOccupants ?? 'N/A',
        floor: room.floor ?? 'N/A',
        openTime: room.openTime ? new Date(room.openTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        closeTime: room.closeTime ? new Date(room.closeTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        assignedTo: typeof room.assignedTo === 'object' ? room.assignedTo.id : room.assignedTo || '',
      }));
      setAvailableRooms(formatted);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      alert('An error occurred while searching for rooms. Please try again.');
    }
  };

  const getAssignableOptions = (category) => {
    switch (category) {
      case 'Office':
        return [...DEPARTMENTS.map(d => ({ id: d, label: d }))];
      case 'Laboratory':
      case 'Seminar Room':
        return [...DEPARTMENTS.map(d => ({ id: d, label: d })), { id: EINA, label: EINA }];
      default:
        return [];
    }
  };

  const handleUpdate = async (roomId, roomData) => {
    if (roomData.maxUsage < 0 || roomData.maxUsage > 100) {
      alert('Max Usage must be between 0 and 100.');
      return;
    }

    const updatePayload = {
        reservable: roomData.reservable,
        reservabilityCategory: { name: roomData.category },
        openTime: new Date(`1970-01-01T${roomData.openTime}:00.000Z`),
        closeTime: new Date(`1970-01-01T${roomData.closeTime}:00.000Z`),
        maxUsage: roomData.maxUsage,
    };

    if (roomData.assignedTo === EINA) {
      updatePayload.assignedTo = EINA;
    } else if (DEPARTMENTS.includes(roomData.assignedTo)) {
      updatePayload.assignedTo = roomData.assignedTo;
    } else if (roomData.category === 'Office') {
      updatePayload.assignedTo = roomData.assignedTo;
    }

    try {
      const res = await fetch(`${Url}/spaces/${roomId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatePayload),
      });

      if (!res.ok) throw new Error('Failed to update space');

      alert('Room updated successfully');
    } catch (err) {
      console.error('Error updating space:', err);
      alert('An error occurred while updating the room.');
    }
  };

  const handleChange = (roomId, field, value) => {
    setAvailableRooms(prev =>
      prev.map(room =>
        room.id === roomId ? { ...room, [field]: value } : room
      )
    );
  };

  if (!user || user.role !== 'Manager') {
    return <div className="text-center text-red-500 p-6">Access denied. Manager only.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-secondary">Manage Spaces</h2>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-secondary mb-4">Search for a Room</h2>
        <div className="flex flex-col gap-4">
          <label className="block">
            Identifier
            <input name="identifier" value={filters.identifier} onChange={handleFilterChange} className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black" />
          </label>
          <label className="block">
            Category
            <input name="category" value={filters.category} onChange={handleFilterChange} className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black" />
          </label>
          <label className="block">
            Capacity
            <input name="maxOccupants" type="number" value={filters.maxOccupants} onChange={handleFilterChange} className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black" />
          </label>
          <label className="block">
            Floor
            <input name="floor" value={filters.floor} onChange={handleFilterChange} className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black" />
          </label>
        </div>
        <button onClick={handleSearch} className="mt-6 bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition duration-300 w-full">
          Search
        </button>
      </div>

      {availableRooms.length === 0 ? (
        <p className="text-secondary">No rooms found. Use the search above.</p>
      ) : (
        availableRooms.map((room) => (
          <div key={room.id} className="bg-white p-4 rounded shadow-md space-y-2">
            <p><strong>ID:</strong> {room.id}</p>
            <p><strong>Name:</strong> {room.name}</p>
            <label className="block">
              <span className="text-secondary">Reservable:</span>
              <input
                type="checkbox"
                checked={room.reservable || false}
                onChange={(e) => handleChange(room.id, 'reservable', e.target.checked)}
              />
            </label>
            <label className="block">
              <span className="text-secondary">Category:</span>
              <select
                value={room.category}
                onChange={(e) => handleChange(room.id, 'category', e.target.value)}
                className="border px-2 py-1 rounded w-full"
              >
                <option value="Classroom">Classroom</option>
                <option value="Office">Office</option>
                <option value="Laboratory">Laboratory</option>
                <option value="Seminar Room">Seminar Room</option>
                <option value="Common Room">Common Room</option>
              </select>
            </label>
            <div className="flex gap-4">
              <label className="block w-1/2">
                <span className="text-secondary">Open Time:</span>
                <input
                  type="time"
                  value={room.openTime || 'N/A'}
                  onChange={(e) => handleChange(room.id, 'openTime', e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </label>
              <label className="block w-1/2">
                <span className="text-secondary">Close Time:</span>
                <input
                  type="time"
                  value={room.closeTime || 'N/A'}
                  onChange={(e) => handleChange(room.id, 'closeTime', e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </label>
            </div>
            {getAssignableOptions(room.category).length > 0 && (
              <div className="space-y-2">
                <label className="block">
                  <span className="text-secondary">Assigned To:</span>
                  <select
                    value={room.assignedTo || ''}
                    onChange={(e) => handleChange(room.id, 'assignedTo', e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  >
                    {getAssignableOptions(room.category).map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </label>
                {room.category === 'Office' && (
                  <label className="block">
                    <span className="text-secondary">Or enter person ID manually:</span>
                    <input
                      type="text"
                      placeholder="Enter person ID"
                      value={room.assignedTo || ''}
                      onChange={(e) => handleChange(room.id, 'assignedTo', e.target.value)}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </label>
                )}
              </div>
            )}
            <label className="block">
              <span className="text-secondary">Max Usage (%):</span>
              <input
                type="number"
                min="0"
                max="100"
                value={room.maxUsage || 100}
                onChange={(e) => handleChange(room.id, 'maxUsage', parseInt(e.target.value))}
                className="w-full border px-2 py-1 rounded"
              />
            </label>
            <button
              onClick={() => handleUpdate(room.id, room)}
              className="bg-primary text-white mt-2 px-4 py-2 rounded hover:bg-secondary"
            >
              Save Changes
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageSpace;