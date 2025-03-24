import React from 'react';
import '../styles/LogIn.css';

const LoginPage = () => {
    const handleSubmit = (e) => {
        // add logic
    };
    
    return (
    <div className="login-container">
        <h1 className="title">ByronHub</h1>

        <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email" className="login-label">Email</label>
        <input type="email" id="email" className="login-input" />

        <label htmlFor="password" className="login-label">Password</label>
        <input type="password" id="password" className="login-input" />

        <button type="submit" className="submit-button">Submit</button>
        </form>
    </div>
    );
};

export default LoginPage;
