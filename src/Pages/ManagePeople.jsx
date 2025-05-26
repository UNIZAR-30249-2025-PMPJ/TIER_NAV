import React, { useState, useContext } from 'react';
import { Url } from '../utils/url';
import { UserContext } from '../contexts/UserContext';

const roles = [
    'Student',
    'Hired Researcher',
    'Teacher Researcher',
    'Concierge',
    'Laboratory Technician',
    'Manager',
    'Manager & Teacher'
];

const departments = [
    'Computer Science and Systems Engineering',
    'Electronic Engineering and Communications'
];
  
const ManagePeople = () => {
    const { user } = useContext(UserContext);
    const [personId, setPersonId] = useState('');
    const [person, setPerson] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [newDepartment, setNewDepartment] = useState('');

    const isDepartmentAllowed = (role) => {
        return [
          'Hired Researcher',
          'Teacher Researcher',
          'Laboratory Technician',
          'Manager & Teacher'
        ].includes(role);
    };

    const shouldClearDepartment = (role) => {
        return ['Student', 'Concierge', 'Manager'].includes(role);
    };

    const handleSearch = async () => {
        try {
            const res = await fetch(`${Url}/people/${personId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!res.ok) throw new Error('Person not found');
            const data = await res.json();
            setPerson(data);
            setNewRole(data.role);
            setNewDepartment(data.department || '');
        } catch (err) {
            alert('Error fetching person.');
            console.error(err);
        }
    };

    const handleUpdate = async () => {
        try {
          const finalDepartment = shouldClearDepartment(newRole) ? null : newDepartment;
      
          const depRes = await fetch(`${Url}/people/department/${personId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ department: finalDepartment }),
          });
      
          if (!depRes.ok) throw new Error('Failed to update department');
      
          const roleRes = await fetch(`${Url}/people/role/${personId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ role: newRole }),
          });
      
          if (!roleRes.ok) throw new Error('Failed to update role');
      
          alert('Person updated successfully');
        } catch (err) {
          alert('Update failed');
          console.error(err);
        }
    };
      

    if (!user || user.role !== 'Manager' && user.role !== 'Manager & Teacher') {
        return <div className="text-center text-red-500 p-6">Access denied. Manager only.</div>;
    }
    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-secondary">Manage People</h2>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <label className="block mb-4">
                    Enter Person ID
                    <input
                        type="text"
                        value={personId}
                        onChange={(e) => setPersonId(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                    />
                </label>
                <button
                    onClick={handleSearch}
                    className="bg-primary text-white px-6 py-2 rounded hover:bg-secondary transition duration-300"
                >
                    Search
                </button>
            </div>
            {person && (
                <div className="bg-white p-6 rounded-xl shadow space-y-4">
                    <p><strong>Name:</strong> {person.name}</p>
                    <p><strong>Email:</strong> {person.email}</p>
                    <p><strong>Current Role:</strong> {person.role}</p>
                    <label className="block">
                        <span className="text-secondary">Change Role:</span>
                        <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="w-full border px-2 py-1 rounded mt-1"
                        >
                            {roles.map((role) => (
                            <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        </label>
                        {isDepartmentAllowed(newRole) && (
                        <>
                            <p><strong>Current Department:</strong> {person.department || 'None'}</p>
                            <label className="block">
                            <span className="text-secondary">Change Department:</span>
                            <select
                                value={newDepartment}
                                onChange={(e) => setNewDepartment(e.target.value)}
                                className="w-full border px-2 py-1 rounded mt-1"
                            >
                                <option value="">-- None --</option>
                                {departments.map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            </label>
                        </>
                        )}
                        <button
                        onClick={handleUpdate}
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary"
                        >
                        Update Person
                        </button>
                </div>
                )}
        </div>
    );
};

export default ManagePeople;
