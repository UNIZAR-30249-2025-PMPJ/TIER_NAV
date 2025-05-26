

const BookingSuccess = () => {
   
    const data = localStorage.getItem('bookingData');
    const bookingData = data ? JSON.parse(data) : null;

    

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
                <h3 className="text-xl font-semibold mb-4">Booking Details</h3>
                {bookingData ? (
                    <div className="space-y-2">
                        <div>
                            <span className="font-semibold">Date:</span> {bookingData.date}
                        </div>
                        <div>
                            <span className="font-semibold">Start Time:</span>{" "}
                            {bookingData.startTime.split('T')[1].slice(0, 5)}
                        </div>
                        <div>
                            <span className="font-semibold">End time:</span> {getEndTime(bookingData.startTime.split('T')[1], bookingData.duration)}
                        </div>
                        <div>
                            <span className="font-semibold">People:</span> {bookingData.people}
                        </div>
                        <div>
                            <span className="font-semibold">Use:</span> {bookingData.use}
                        </div>
                        <div>
                            <span className="font-semibold">Rooms:</span>{" "}
                            {bookingData.rooms && bookingData.rooms.length > 0
                                ? bookingData.rooms.map((room, idx) => (
                                        <span key={room.id || idx}>
                                            {room.id || `Room ${idx + 1}`}
                                            {idx < bookingData.rooms.length - 1 ? ', ' : ''}
                                        </span>
                                    ))
                                : 'N/A'}
                        </div>
                        {bookingData.comments && (
                            <div>
                                <span className="font-semibold">Comments:</span> {bookingData.comments}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>No booking data found.</div>
                )}
            </div>
        </div>
    );
};

export default BookingSuccess;
