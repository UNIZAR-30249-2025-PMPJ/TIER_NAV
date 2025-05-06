import React, { useState } from "react";

const Calendar = ({ bookings }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day; // Adjust if Sunday
    startOfWeek.setDate(date.getDate() + diffToMonday);

    return Array.from({ length: 5 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handlePreviousWeek = () => {
    const previousWeek = new Date(currentWeek);
    previousWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(previousWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  const generateHours = () => {
    const hours = [];
    for (let i = 8; i <= 20; i++) {
      hours.push(`${i.toString().padStart(2, "0")}:00`);
      hours.push(`${i.toString().padStart(2, "0")}:30`);
    }
    return hours;
  };

  const weekDays = getWeekDays(currentWeek);
  const hours = generateHours();

  return (
    <div className="p-6 bg-white shadow rounded-xl w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePreviousWeek}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition"
        >
          Previous Week
        </button>
        <h3 className="text-xl font-semibold text-secondary">Weekly Room Bookings</h3>
        <button
          onClick={handleNextWeek}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition"
        >
          Next Week
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4 min-w-[1000px]">
        {weekDays.map((day) => {
          const formattedDate = formatDate(day);
          const dayBookings = bookings[formattedDate] || [];
          return (
            <div key={formattedDate} className="bg-third p-4 rounded shadow-md">
              <h4 className="text-lg font-semibold text-secondary mb-2">{formattedDate}</h4>
              <ul className="space-y-1 max-h-[600px] overflow-y-auto scrollbar-hidden">
                {hours.map((hour, index) => {
                  const isBooked = dayBookings.includes(hour);
                  return (
                    <li
                      key={index}
                      className={`p-2 rounded border text-sm ${
                        isBooked
                          ? "bg-green-100 text-green-800 border-green-300 font-medium"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                    >
                      {hour} {isBooked && <span>(Booked)</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
