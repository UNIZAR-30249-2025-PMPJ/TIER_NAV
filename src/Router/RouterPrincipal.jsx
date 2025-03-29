import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { routes } from '../utils/constants';
import { NotFound } from '../Pages/NotFound';
import { Home } from '../Pages/Home';
import ByronHub from '../Pages/ByronHub';
import LoginPage from '../Pages/LogIn';
import SearchRooms from '../Pages/SearchRooms';
import Layout from '../layout/Layout';
import MySpace from '../Pages/MySpace';
import RoomDetails from '../Pages/RoomDetails';
import BookRoom from '../Pages/BookRoom';
import BookingSuccess from '../Pages/BookingSuccess';


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
        <Router>
          <Routes>
            <Route path={routes.byronhub} element={<ByronHub/>} />
            <Route path={routes.login} element={<LoginPage />} />
            <Route path="*" element={<NotFound />} />

            <Route path="/" element={<Layout />} >
              {/* Example of private and admin routes */}
              {/*<Route path="/home" element={<PrivateRoute><Home/></PrivateRoute>} />*/}
              <Route path={routes.home} element={<Home/>} />
            
              {/* <Route path={routes.searchrooms} element={<PrivateRoute><SearchRooms/></PrivateRoute>} /> */}
              <Route path={routes.searchrooms} element={<SearchRooms/>} />

              <Route path={routes.myspace} element={<MySpace/>} />

              <Route path={routes.roomdetails} element={<RoomDetails/>} />

              <Route path={routes.bookroom} element={<BookRoom/>} />

              <Route path={routes.bookingsucces} element={<BookingSuccess/>} />
            </Route>
          </Routes>
        </Router>
  );
}

export default RouterPrincipal;