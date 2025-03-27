import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

/**
 * Layout Component
 * Wraps all pages with the common Navigation bar.
 */
const Layout = () => {

  return (
    <div>
      <NavBar />
    </div>
  );
};

export default Layout;
