
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Accessories from './pages/Accessories';
import Tasks from './pages/Tasks';
import PresetMessages from './pages/PresetMessages';
import { setAuthToken, setAuthUser, getAuthToken } from './utils/storageUtils';
import api from './utils/api';

function AppRoutes() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');

    if (tokenFromUrl) {
    
      setAuthToken(tokenFromUrl);

   
      api
        .get('/users/me')
        .then((res) => {
          setAuthUser(res.data);
        
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          setCheckingAuth(false);
       
          navigate('/');
        })
        .catch((err) => {
          console.error('Token inválido ou erro ao buscar usuário:', err);
         
          setAuthToken('');
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          setCheckingAuth(false);
          navigate('/login');
        });
    } else {
      
      const token = getAuthToken();
      if (!token) {
        setCheckingAuth(false);
        navigate('/login');
      } else {
      
        api
          .get('/users/me')
          .then((res) => {
            setAuthUser(res.data);
            setCheckingAuth(false);
         
          })
          .catch((err) => {
            console.error('Token expirado ou inválido:', err);
            setAuthToken('');
            setCheckingAuth(false);
            navigate('/login');
          });
      }
    }

  }, []);

  if (checkingAuth) return null;

  return (
    <Routes>
  
      <Route path="/login" element={<Login />} />

  
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/preset_messages" element={<PresetMessages />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
