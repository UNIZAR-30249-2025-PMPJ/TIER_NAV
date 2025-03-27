import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ByronHub from '../Pages/ByronHub';
import LoginPage from '../Pages/LogIn';
import { NotFound } from '../Pages/NotFound';
import { Home } from '../Pages/Home';

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
            <Route path="/" element={<ByronHub/>} />
            <Route path="/login" element={<LoginPage />} />

            {/* Example of private and admin routes */}
            <Route path="/home" element={<Home />} />
            
            <Route path="*" element={<NotFound />} />

            {/* Add more routes as needed */}


          </Routes>
        </Router>
  );
}

export default RouterPrincipal;