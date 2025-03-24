import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { routes } from './utils/constants';
import ByronHub from './menu/ByronHub';
import LogIn from './logging/LogIn';

function App() {
  return (
    <Router>
      <Routes>
        {/* home page */}
        <Route path={routes.ByronHub} element={<ByronHub />} />

        {/* login page */}
        <Route path={routes.LogIn} element={<LogIn />} />
      </Routes>
    </Router>
  );
}

export default App;
