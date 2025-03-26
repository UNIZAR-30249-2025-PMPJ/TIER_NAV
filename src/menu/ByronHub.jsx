import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../utils/constants';

const ByronHub = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-white flex flex-col items-center justify-center gap-8">
      <h1 className="text-5xl font-bold text-primary">ByronHub</h1>
      <button 
        className="bg-primary text-white px-6 py-2 text-lg rounded-md transition duration-300 hover:bg-secondary"
        onClick={() => navigate(routes.LogIn)}
      >
        Login
      </button>
      <div className="bg-third p-10 rounded-xl max-w-2xl text-center shadow-md">
        <h2 className="text-3xl font-semibold text-secondary mb-6">
          Welcome to the Ada Byron Building Reservation System
        </h2>
        <p className="text-xl text-gray-700 font-medium">
          Effortlessly find and book spaces within the Ada Byron building with our intuitive reservation system.
          Whether you need a study room, a meeting space, or a collaborative area, our interactive application
          makes the process seamless.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="bg-third text-secondary text-2xl font-medium text-center p-6 rounded-lg shadow-md">
          Smart Search
        </div>
        <div className="bg-third text-secondary text-2xl font-medium text-center p-6 rounded-lg shadow-md">
          Interactive Map
        </div>
      </div>
    </div>
  );
};

export default ByronHub;
