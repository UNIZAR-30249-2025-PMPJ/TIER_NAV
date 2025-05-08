import React, { useContext, useEffect, useState } from "react";
import { Url } from "../utils/url";
import { UserContext } from "../contexts/UserContext";

const Calendar = ({ bookings, setTime }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch(`${Url}/buildings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    const startOfWeek = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    ));
    const day = startOfWeek.getUTCDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() + diffToMonday);

    return Array.from({ length: 5 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setUTCDate(startOfWeek.getUTCDate() + i);
      return day;
    });
  };

  const formatDate = (date) => {
    return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`;
  };

  const getDateKey = (date) => {
    return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`;
  };

  const toISOStringDate = (date) => date.toISOString().split("T")[0]; // e.g., "2025-05-08"

  const handlePreviousWeek = () => {
    const previousWeek = new Date(currentWeek);
    previousWeek.setUTCDate(currentWeek.getUTCDate() - 7);
    setCurrentWeek(previousWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setUTCDate(currentWeek.getUTCDate() + 7);
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
            return toISOStringDate(new Date(holiday)) === toISOStringDate(day);
          });

          if (isHoliday) {
            return (
              <div key={day.toISOString()} className="bg-gray-200 p-4 rounded shadow-md">
                <h4 className="text-lg font-semibold text-secondary mb-2">Holiday</h4>
                <p className="text-gray-700">This day is a holiday.</p>
              </div>
            );
          }

          const dayOfWeek = day.toLocaleString("default", {
            weekday: "long",
            timeZone: "UTC",
          });

          const formattedDate = formatDate(day);
          const dayBookings = bookings[formattedDate] || [];

          return (
            <div key={formattedDate} className="bg-third p-4 rounded shadow-md">
              <h4 className="text-lg font-semibold text-secondary mb-2">
                {dayOfWeek} - {formattedDate}
              </h4>
              <ul className="space-y-1 max-h-[780px] overflow-y-auto scrollbar-hidden">
                {hours.map((hour, index) => {
                  const isBooked = dayBookings.includes(hour);
                  return (
                    <li
                      key={index}
                      onClick={() => {
                        if (!isBooked || user.role === "Manager") {
                          const [dayStr, month, year] = formattedDate.split("/");
                          const newDate = `${year}-${month.padStart(2, "0")}-${dayStr.padStart(2, "0")}`;
                          setTime({ date: newDate, time: hour });
                        }
                      }}
                      className={`p-2 rounded border text-sm cursor-pointer transition ${
                        isBooked
                          ? user.role === "Manager"
                            ? "bg-green-100 text-green-800 border-green-300 font-medium hover:bg-green-300"
                            : "bg-green-100 text-green-800 border-green-300 cursor-not-allowed"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                      title={
                        isBooked
                          ? user.role === "Manager"
                            ? "Click to manage booking"
                            : "Already booked"
                          : "Available"
                      }
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
