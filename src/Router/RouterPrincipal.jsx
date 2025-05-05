import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { routes } from '../utils/constants';
import { NotFound } from '../Pages/NotFound';
import { Home } from '../Pages/Home';
import ByronHub from '../Pages/ByronHub';
import LoginPage from '../Pages/LogIn';
import Search from '../Pages/Search';
import Layout from '../layout/Layout';
import MySpace from '../Pages/MySpace';
import RoomBooking from '../Pages/RoomBooking';
import BookingSuccess from '../Pages/BookingSuccess';
import RoomList from '../Pages/RoomList';
import { UserProvider } from '../contexts/UserProvider';





const RouterPrincipal = () => {

  const PrivateRoute = ({ children }) => {
    return !localStorage.getItem('token') ? <Navigate to="/login" /> : children;

  };
 
  const AdminRoute = ({ children }) => {
    //se obtiene del JWT el rol del usuario
    const auth = JSON.parse(localStorage.getItem('esAdmin'));
    if(!auth){
      return <Navigate to="/login" />
    }

    return !localStorage.getItem('token') ?
      <Navigate to="/login" />
    :
    auth.rol == "usuario" ? <Navigate to="/login" /> : children;
  }

  return (
    <UserProvider>

          <Router>
            <Routes>
              <Route path={routes.byronhub} element={<ByronHub />} />
              <Route path={routes.login} element={<LoginPage />} />
              <Route path="*" element={<NotFound />} />
    
              <Route path="/" element={<Layout />} >
                <Route path={routes.home} element={<Home />} />
                <Route path={routes.myspace} element={<MySpace />} />
                <Route path={routes.searchrooms} element={<Search />} />
                <Route path={routes.roomlist} element={<RoomList />} />
                <Route path={routes.roomdetails} element={<RoomBooking />} />
                <Route path={routes.bookingsuccess} element={<BookingSuccess />} />
              </Route>
            </Routes>
          </Router>
    </UserProvider>
  );  
}

export default RouterPrincipal;