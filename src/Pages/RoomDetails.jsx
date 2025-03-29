import React from 'react';

const RoomDetails = () => {
    // const { id } = useParams();
    // const [room, setRoom] = useState(null);
    // const [schedule, setSchedule] = useState({});
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const fetchRoomDetails = async () => {
    //       try {
    //         const response = await axios.get(`http://localhost:3000/api/rooms/${id}`);
    //         setRoom(response.data.room);
    //         setSchedule(response.data.schedule);
    //       } catch (err) {
    //         console.error('Error fetching room:', err);
    //       } finally {
    //         setLoading(false);
    //       }
    //     };
    
    //     fetchRoomDetails();
    //   }, [id]);

    // exemple
    const room = {
    identifier: 'A0.5',
    category: 'Class',
    capacity: 65,
    floor: 0,
    image: '',
    };

    const schedule = {
    'Monday 10': ['8:00', '9:00', '10:00', '11:00'],
    'Tuesday 11': ['8:00', '10:00', '11:00', '12:00'],
    'Wednesday 12': ['8:00', '9:00', '12:00'],
    'Thursday 13': ['8:00', '10:00', '11:00', '12:00'],
    'Friday 14': ['9:00', '10:00', '11:00', '12:00'],
    };

    const handleSlotClick = (day, time) => {
        navigate('/confirm-booking', {
          state: {
            room,
            day,
            time,
          },
        });
      };

    return (
        <div className="p-10 flex flex-col items-center gap-12">
        {/* Room Info */}
        <div className="flex justify-center items-start gap-20 w-full max-w-5xl">
            <div className="flex flex-col gap-2 text-lg text-secondary">
            <div>
                <span className="pb-2 font-semibold">Identifier</span>{' '}
                <span className="text-primary font-medium">{room.identifier}</span>
            </div>
            <div>
                <span className="pb-2 font-semibold">Category</span>{' '}
                <span className="text-primary font-medium">{room.category}</span>
            </div>
            <div>
                <span className="pb-2 font-semibold">Capacity</span>{' '}
                <span className="text-primary font-medium">{room.capacity}</span>
            </div>
            <div>
                <span className="pb-2 font-semibold">Floor</span>{' '}
                <span className="text-primary font-medium">{room.floor}</span>
            </div>
            </div>
            <img
            src={room.image}
            alt="Room layout"
            className="rounded-lg shadow-md w-90 h-60 object-cover"
            />
        </div>

        {/* Time Slots */}
        <div className="bg-third rounded-xl p-6 shadow-md w-full max-w-5xl">
            <div className="grid grid-cols-5 gap-6 text-center text-secondary text-md">
            {Object.entries(schedule).map(([day, times]) => (
                <div key={day}>
                <h3 className="mb-2 font-semibold">{day}</h3>
                <div className="flex flex-col gap-2">
                    {times.map((time, i) => (
                    <button
                        key={i}
                        className="bg-white text-primary font-semibold border border-primary rounded-full px-4 py-1 hover:bg-primary hover:text-white transition duration-200"
                        onClick={() => handleSlotClick(day, time)}
                    >
                        {time}
                    </button>
                    ))}
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    );
    };

export default RoomDetails;
