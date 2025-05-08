import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Url } from '../utils/url';

const Notifications = () => {
  const { user } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${Url}/notifications/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const json = await response.json();
        setNotifications(json);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    // Initial fetch
    fetchNotifications();

    // Refresh every 15 seconds
    const interval = setInterval(fetchNotifications, 15000);

    return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    return <div className="p-10 text-center text-red-500">User not connected.</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-primary mb-6">My notifications</h1>

      <div className="bg-gray-100 rounded-xl p-6 shadow-md space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="bg-gray-200 text-black px-4 py-2 rounded"
            >
              <p className="font-medium">{notif.message}</p>
              <p className="text-sm text-gray-600">
                {new Date(notif.date).toLocaleString('es-ES', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </p>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center">You have no notifications.</div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
