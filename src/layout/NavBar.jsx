import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { routes } from '../utils/constants';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="bg-gray-200 text-secondary font-medium shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-center gap-8 text-xl">
          <button
            onClick={() => navigate(routes.searchrooms)}
            className={`hover:underline ${isActive(routes.searchrooms) ? 'font-bold text-primary' : ''}`}
          >
            Search
          </button>
          <span className="text-blue-400">|</span>
          <button
            onClick={() => navigate(routes.home)}
            className={`hover:underline ${isActive(routes.byronhub) ? 'font-bold text-primary' : ''}`}
          >
            ByronHub
          </button>
          <span className="text-blue-400">|</span>
          <button
            onClick={() => navigate(routes.myspace)}
            className={`hover:underline ${isActive('/home') ? 'font-bold text-primary' : ''}`}
          >
            My Space
          </button>
        </nav>
      </header>

      {/* Dynamic Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
