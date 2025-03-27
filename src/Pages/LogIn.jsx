import React from 'react';
import { Url } from '../utils/url';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    //Use the navigate hook to redirect the user to another page
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
       //Get the email from the form
        const email = e.target.email.value;
        //Send a POST request to the server to login
        const request = await fetch(Url
            +"/login", {
            method: "POST",
            body: JSON.stringify({email}),
            headers: {
              "Content-Type":"application/json"
            }
        });
        //Get the response from the server
        const response = await request.json();
        //Check the response
        if (response.token) {
            //If the response has a token, save it in the local storage
            localStorage.setItem("token", response.token);
            //Redirect the user to the Home page
            navigate("/home");
        }
        console.log(response);

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
