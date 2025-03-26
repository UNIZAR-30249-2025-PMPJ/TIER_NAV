import React from 'react';

const LoginPage = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // add logic
        const email = e.target.email.value;
        const password = e.target.password.value;
        console.log('Email:', email);
        console.log('Password:', password);

    };
    
    return (
        <div className="h-screen w-screen bg-white flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold text-primary mb-10">ByronHub</h1>
            <form className="flex flex-col w-96 bg-gray-100 p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
                <label htmlFor="email" className="font-bold text-secondary mb-2">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    className="bg-third border-1  rounded-md p-3 mb-4 text-lg shadow-md"
                />
                <label htmlFor="password" className="font-bold text-secondary mb-2">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    className="bg-third border-1 border-gray-600 rounded-md p-3 mb-6 text-lg"
                />
                <button 
                    type="submit" 
                    className="bg-primary text-white py-3 text-lg rounded-md transition duration-300 hover:bg-secondary"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
