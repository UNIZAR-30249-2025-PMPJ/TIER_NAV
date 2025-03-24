import React from 'react';
import { useNavigate } from 'react-router-dom';
import {routes} from '../utils/constants'
import '../styles/ByronHub.css';

const ByronHub = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <h1 className="title">ByronHub</h1>
      <button className="login-button" onClick={() => navigate(routes.LogIn)}>
        Login
      </button>
      <div className="welcome-box">
        <h2 className="welcome-title">
          Welcome to the Ada Byron Building Reservation System
        </h2>
        <p className="welcome-text">
          Effortlessly find and book spaces within the Ada Byron building with our intuitive reservation system.
          Whether you need a study room, a meeting space, or a collaborative area, our interactive application
          makes the process seamless.
        </p>
      </div>
      <div className="button-grid">
        <div className="grid-button">Smart Search</div>
        <div className="grid-button">Interactive Map</div>
      </div>
    </div>
  );
};

export default ByronHub;
