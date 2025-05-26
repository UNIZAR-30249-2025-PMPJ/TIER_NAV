import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../utils/constants';

const ManageOverview = () => {
  const navigate = useNavigate();

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-secondary mb-6">Management Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate(routes.managebookings)}
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-left border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-primary">Manage Bookings</h2>
          <p className="mt-2 text-gray-600">View and update room bookings</p>
        </button>
        <button
          onClick={() => navigate(routes.managespaces)}
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-left border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-primary">Manage Spaces</h2>
          <p className="mt-2 text-gray-600">Modify room availability and settings</p>
        </button>
        <button
          onClick={() => navigate(routes.managepeople)}
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-left border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-primary">Manage People</h2>
          <p className="mt-2 text-gray-600">Update roles and departments</p>
        </button>
      </div>
    </div>
  );
};

export default ManageOverview;
