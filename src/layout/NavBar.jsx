import React, { useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { routes } from '../utils/constants';
import { SearchRoomsContext } from '../contexts/SearchRoomsContext';
import { NotificationIcon } from '../utils/NotificationIcon';
import { SignoutIcon } from '../utils/SignoutIcon';
import { UserContext } from '../contexts/UserContext';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearAvailableRooms } = useContext(SearchRoomsContext);
  const { logout, user } = useContext(UserContext); // ← On récupère le user

  const handleSignout = () => {
    logout();
    navigate(routes.byronhub);
  };

  const handleNotificationClick = () => {
    navigate(routes.notifications);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `hover:underline transition ${
      isActive(path) ? 'font-bold text-primary' : 'text-gray-700'
    }`;

  const handleNavigationSearch = () => {
    clearAvailableRooms();
    navigate(routes.searchrooms);
  };

  return (
    <div className="min-h-screen flex flex-col ">
      {/* Header */}
      <header className="bg-gray-100 shadow-sm py-4 px-6 relative">
        <div className="max-w-7xl mx-auto flex justify-center items-center relative">
          {/* Centered Navigation */}
          <nav className="flex gap-6 text-lg absolute left-1/2 -translate-x-1/2">
            <button onClick={handleNavigationSearch} className={navLinkClass(routes.searchrooms)}>
              Search
            </button>
            <span className="text-blue-400">|</span>
            <button onClick={() => navigate(routes.home)} className={navLinkClass(routes.home)}>
              Mapa
            </button>
            <span className="text-blue-400">|</span>
            <button onClick={() => navigate(routes.bookings)} className={navLinkClass(routes.bookings)}>
              Bookings
            </button>
            {user?.role === 'Manager' && (
              <>
                <span className="text-blue-400">|</span>
                <button onClick={() => navigate(routes.managebookings)} className={navLinkClass(routes.managebookings)}>
                  Manage Bookings
                </button>
              </>
            )}
          </nav>

          {/* Right Icons */}
          <div className="absolute right-0 flex items-center gap-4">
            <button
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={handleNotificationClick}>
              <NotificationIcon />
            </button>
            <button
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={handleSignout}>
              <SignoutIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
