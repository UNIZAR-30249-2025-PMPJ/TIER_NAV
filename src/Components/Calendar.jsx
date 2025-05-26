import React, { useContext, useEffect, useState } from "react";
import { Url } from "../utils/url";
import { UserContext } from "../contexts/UserContext";
import { SelectedRoomsContext } from "../contexts/SelectedRoomsContext";
import { useNavigate } from "react-router-dom";
import { routes } from '../utils/constants';
import { SearchRoomsContext } from "../contexts/SearchRoomsContext";

const Calendar = ({ bookings, setTime, room }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useContext(UserContext);
  const { addRoom,  } = useContext(SelectedRoomsContext);
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(room);
  const {clearAvailableRooms} = useContext(SearchRoomsContext);


  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch(`${Url}/buildings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const json = await response.json();
          const holidays = json[0]?.holidays || [];
          setHolidays(holidays);
        }
      } catch (error) {
        console.error("Error fetching holidays:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg font-semibold text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-xl border-secondary border rounded-xl w-full h-[93%] -mt-18 overflow-x-auto">
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

      <div className="grid grid-cols-5 gap-4 min-w-[1000px] h-[93%]">
        {weekDays.map((day) => {
          const isHoliday = holidays.some((holiday) => {
            const holidayDate = new Date(holiday);
            return (
              holidayDate.getDate() === day.getDate() &&
              holidayDate.getMonth() === day.getMonth() &&
              holidayDate.getFullYear() === day.getFullYear()
            );
          });
          if (isHoliday) {
            return (
              <div key={day} className="bg-gray-200 p-4 rounded shadow-md">
                <h4 className="text-lg font-semibold text-secondary mb-2">Holiday</h4>
                <p className="text-gray-700">This day is a holiday.</p>
              </div>
            );
          }
          const dayOfWeek = day.toLocaleString("default", { weekday: "long" });
          const formattedDate = formatDate(day);
          const dayBookings = bookings[formattedDate] || [];
          //the hours in the dayBookings are in utc format, so we need to convert them to local time
          // the content of dayBookings is an array of strings in the format "HH:mm"

        // Convert each "HH:mm" string from UTC to local time
        const localDayBookings = dayBookings.map(utcTime => {
          const [hours, minutes] = utcTime.split(':').map(Number);

          // Create a Date object with UTC time on an arbitrary date (e.g., today)
          const now = new Date();
          const utcDate = new Date(Date.UTC(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hours,
            minutes
          ));

          // Convert to local time string (HH:mm)
          const localHours = utcDate.getHours().toString().padStart(2, '0');
          const localMinutes = utcDate.getMinutes().toString().padStart(2, '0');

          return `${localHours}:${localMinutes}`;
        });

          
          return (
            <div key={formattedDate} className="bg-third p-4 rounded shadow-md">
              <h4 className="text-lg font-semibold text-secondary mb-2">
                {dayOfWeek} - {formattedDate}
              </h4>
              <ul className="space-y-1 max-h-[780px] overflow-y-auto scrollbar-hidden">
                {hours.map((hour, index) => {
                  const isBooked = localDayBookings.includes(hour);
                    return (
                    <li
                      key={index}
                      onClick={() => {
                      if (!isBooked || user.role === "Manager") {
                        const [day, month, year] = formattedDate.split("/");
                        const newDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
                        setTime({ date: newDate, time: hour });
                        //añadir la room y navegar
                        setSelectedRoom({...selectedRoom});
                        addRoom(selectedRoom);
                        clearAvailableRooms();
                        navigate(routes.searchrooms);

                      }
                      }}
                      className={`p-2 rounded border text-sm cursor-pointer transition ${
                      isBooked
                        ? user.role === "Manager"
                        ? "bg-green-100 text-green-800 border-green-300 font-medium hover:bg-green-300"
                        : "bg-green-100 text-green-800 border-green-300 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                      title={isBooked ? (user.role === "Manager" ? "Click to manage booking" : "Already booked") : "Available"}
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