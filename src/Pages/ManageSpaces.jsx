import React, { useState, useContext } from 'react';
import { Url } from '../utils/url';
import { UserContext } from '../contexts/UserContext';

const DEPARTMENTS = [
  'Computer Science and Systems Engineering',
  'Electronic Engineering and Communications'
];

const EINA = 'EINA - ADA BYRON';

const ManageSpace = () => {
  const { user } = useContext(UserContext);
  const [filters, setFilters] = useState({ identifier: '', category: '', capacity: '', floor: '' });
  const [availableRooms, setAvailableRooms] = useState([]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (filters.identifier) params.append('id', filters.identifier);
    if (filters.capacity) params.append('maxOccupants', filters.capacity);
    if (filters.category) params.append('reservabilityCategory', filters.category);
    if (filters.floor) params.append('floor', filters.floor);
    return params.toString();
  };

  const handleSearch = async () => {
    try {
      const query = buildQueryParams();
      const response = await fetch(`${Url}/spaces?${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch rooms');
      const data = await response.json();
      const formatted = data.map((room) => {
        const isOffice = room.reservabilityCategory?.name === 'Office';
        const assignedTo = typeof room.assignedTo === 'object' ? room.assignedTo.id : room.assignedTo || '';
        const isDept = DEPARTMENTS.includes(assignedTo);
        return {
          id: room.id,
          name: room.name,
          category: room.reservabilityCategory?.name || 'N/A',
          reservable: room.reservable,
          maxUsage: room.maxUsage ?? 'N/A',
          maxOccupants: room.maxOccupants ?? 'N/A',
          floor: room.floor ?? 'N/A',
          openTime: room.openTime ? new Date(room.openTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
          closeTime: room.closeTime ? new Date(room.closeTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
          assignedTo,
          assignMode: isOffice ? (isDept ? 'department' : 'person') : undefined,
          departmentValue: isOffice && isDept ? assignedTo : '',
          personValue: isOffice && !isDept ? assignedTo : '',
        };
      });
      setAvailableRooms(formatted);
    } catch {
      alert('Error while searching for rooms. Please try again.');
    }
  };

  const getAssignableOptions = (category) => {
    switch (category) {
      case 'Office':
        return DEPARTMENTS.map(d => ({ id: d, label: d }));
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

    let assignedTo = roomData.assignedTo;

    if (roomData.category === 'Office') {
      if (roomData.assignMode === 'department') {
        if (!roomData.departmentValue) {
          alert('Please select a department.');
          return;
        }
        assignedTo = roomData.departmentValue;
      } else {
        if (!roomData.personValue) {
          alert('Please enter a person ID.');
          return;
        }
        assignedTo = roomData.personValue;
      }
    } else if (['Seminar Room', 'Laboratory'].includes(roomData.category)) {
      if (!roomData.assignedTo) {
        alert('Please select who the room is assigned to.');
        return;
      }
      assignedTo = roomData.assignedTo;
    }

    const payload = {
      reservable: roomData.reservable,
      reservabilityCategory: { name: roomData.category },
      openTime: new Date(`0001-01-01T${roomData.openTime}:00`),
      closeTime: new Date(`0001-01-01T${roomData.closeTime}:00`),
      maxUsage: roomData.maxUsage,
      assignedTo
    };

    try {
      const res = await fetch(`${Url}/spaces/${roomId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Update failed');
      alert('Room updated successfully');
    } catch {
      alert('Error updating room');
    }
  };

  const handleChange = (roomId, field, value) => {
    setAvailableRooms(prev =>
      prev.map(room => {
        if (room.id === roomId) {
          const updated = { ...room, [field]: value };
          if (field === 'category') {
            if (value === 'Common Room' || value === 'Classroom') {
              updated.assignedTo = EINA;
              updated.assignMode = undefined;
              updated.departmentValue = '';
              updated.personValue = '';
            } else if (value === 'Office') {
              updated.assignedTo = '';
              updated.assignMode = 'person';
              updated.departmentValue = '';
              updated.personValue = '';
            } else {
              updated.assignedTo = '';
              updated.assignMode = undefined;
              updated.departmentValue = '';
              updated.personValue = '';
            }
          }
          return updated;
        }
        return room;
      })
    );
  };

  if (!user || (user.role !== 'Manager' && user.role !== 'Manager & Teacher')) {
    return <div className="text-center text-red-500 p-6">Access denied. Manager only.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-secondary">Manage Spaces</h2>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-secondary mb-4">Search for a Room</h2>
        <div className="flex flex-col gap-4">
          {['identifier', 'capacity', 'floor'].map((field) => (
            <label className="block" key={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
              <input
                name={field}
                value={filters[field]}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
              />
            </label>
            
          ))}
          <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
          >
            <option value="">Select Category</option>
            <option value="Common Room">Common Room</option>
            <option value="Laboratory">Laboratory</option>
            <option value="Classroom">Classroom</option>
            <option value="Office">Office</option>
            <option value="Seminar Room">Seminar Room</option>

        </select>
        </div>
        <button onClick={handleSearch} className="mt-6 bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary w-full">
          Search
        </button>
      </div>

      {availableRooms.length === 0 ? (
        <p className="text-secondary">No rooms found. Use the search above.</p>
      ) : (
        availableRooms.map(room => (
          <div key={room.id} className="bg-white p-4 rounded shadow-md space-y-2">
            <p><strong>ID:</strong> {room.id}</p>
            <p><strong>Name:</strong> {room.name}</p>
            <p className="text-sm text-gray-600"><strong>Currently assigned to:</strong> {room.assignedTo || 'None'}</p>

            <label className="block">
              <span className="text-secondary">Reservable:</span>
              <input
                type="checkbox"
                checked={room.reservable}
                onChange={e => handleChange(room.id, 'reservable', e.target.checked)}
              />
            </label>

            <label className="block">
              <span className="text-secondary">Category:</span>
              <select
                value={room.category}
                onChange={e => handleChange(room.id, 'category', e.target.value)}
                className="border px-2 py-1 rounded w-full"
              >
                {['Classroom', 'Office', 'Laboratory', 'Seminar Room', 'Common Room'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </label>

            <div className="flex gap-4">
              {['openTime', 'closeTime'].map((field) => (
                <label key={field} className="block w-1/2">
                  <span className="text-secondary">{field === 'openTime' ? 'Open' : 'Close'} Time:</span>
                  <input
                    type="time"
                    value={room[field]}
                    onChange={e => handleChange(room.id, field, e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  />
                </label>
              ))}
            </div>

            {room.category === 'Common Room' || room.category === 'Classroom' ? (
              <input
                type="text"
                value={EINA}
                disabled
                className="w-full border px-2 py-1 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            ) : room.category === 'Office' ? (
              <>
                <span className="text-secondary">Assign To:</span>
                <div className="flex gap-4">
                  {['department', 'person'].map(mode => (
                    <label key={mode} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`assignMode-${room.id}`}
                        value={mode}
                        checked={room.assignMode === mode}
                        onChange={() => handleChange(room.id, 'assignMode', mode)}
                      />
                      {mode === 'department' ? 'Department' : 'Person ID'}
                    </label>
                  ))}
                </div>

                {room.assignMode === 'department' && (
                  <select
                    value={room.departmentValue}
                    onChange={e => handleChange(room.id, 'departmentValue', e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  >
                    <option value="">-- SELECT --</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                )}

                {room.assignMode === 'person' && (
                  <input
                    type="text"
                    placeholder="Enter person ID"
                    value={room.personValue}
                    onChange={e => handleChange(room.id, 'personValue', e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  />
                )}
              </>
            ) : (
              <select
                value={room.assignedTo}
                onChange={e => handleChange(room.id, 'assignedTo', e.target.value)}
                className="w-full border px-2 py-1 rounded"
              >
                <option value="">-- SELECT --</option>
                {getAssignableOptions(room.category).map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            )}

            <label className="block">
              <span className="text-secondary">Max Usage (%):</span>
              <input
                type="number"
                min="0"
                max="100"
                value={room.maxUsage}
                onChange={e => handleChange(room.id, 'maxUsage', parseInt(e.target.value))}
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