import React from 'react';


const BookingSuccess = () => {
    const selectedRooms= []

    const getEndTime = (start, duration) => {
        const [hours, minutes] = start.split(':').map(Number);
        const startDate = new Date();
        startDate.setHours(hours, minutes);
        const endDate = new Date(startDate.getTime() + parseInt(duration, 10) * 60000);
        return endDate.toTimeString().slice(0, 5);
    };
    
    return (
        <div className="p-10 flex flex-col items-center gap-10 text-secondary">
            <h2 className="text-2xl font-semibold text-center">
                Your booking has been completed successfully
            </h2>

            <div className="bg-gray-100 rounded-xl p-6 shadow-md w-full max-w-3xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-300">
                            <th className="pb-2">Name</th>
                            <th className="pb-2">Category</th>
                            <th className="pb-2">People</th>
                            <th className="pb-2">Date</th>
                            <th className="pb-2">Start</th>
                            <th className="pb-2">End</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedRooms.map((room, index) => (
                            <tr key={index} className="border-b border-gray-200">
                                <td className="py-2">{room.name}</td>
                                <td className="py-2">{room.category}</td>
                                <td className="py-2">{room.people}</td>
                                <td className="py-2">{room.date}</td>
                                <td className="py-2">{room.start}</td>
                                <td className="py-2">{getEndTime(room.start, room.duration)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingSuccess;
