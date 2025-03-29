import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from '../utils/constants';

const BookingSuccess = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const example = {
        identifier: 'A0.5',
        category: 'Class',
        people: 40,
        date: 'Tuesday 11',
        start: '10:00',
        end: '12:00',
    };

    const {
        identifier,
        category,
        people,
        date,
        start,
        end,
    } = state || example;

    //   if (!identifier) {
    //     return (
    //     <div className="text-center mt-20 text-red-500">
    //     Missing booking data.
    //     </div>
    //     );
    //   }

    return (
        <div className="flex flex-col items-center justify-center h-screen px-4 text-secondary">
            <h1 className="text-3xl font-bold text-center text-primary mb-10">
                Your booking has been completed successfully
            </h1>

            <div className="text-lg space-y-2 text-center">
                <p>
                    <span className="font-medium">Identifier</span>{' '}
                    <span className="font-semibold text-black">{identifier}</span>
                </p>
                <p>
                    <span className="font-medium">Category</span>{' '}
                    <span className="font-semibold text-black">{category}</span>
                </p>
                <p>
                    <span className="font-medium">People</span>{' '}
                    <span className="font-semibold text-black">{people}</span>
                </p>
                <p>
                    <span className="font-medium">Date</span>{' '}
                    <span className="font-semibold text-black">{date}</span>
                </p>
                <p>
                    <span className="font-medium">Start</span>{' '}
                    <span className="font-semibold text-black">{start}</span>
                </p>
                <p>
                    <span className="font-medium">End</span>{' '}
                    <span className="font-semibold text-black">{end}</span>
                </p>
            </div>

            <button
                onClick={() => navigate(routes.myspace)}
                className="mt-10 bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition duration-300"
            >
                Go to My Bookings
            </button>
        </div>
    );
};

export default BookingSuccess;
