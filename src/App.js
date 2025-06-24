import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Accessories from './pages/Accessories';
import Tasks from './pages/Tasks';
import PresetMessages from './pages/PresetMessages';
import Login from './pages/Login'; // podes manter este se ainda quiseres pagina interna
import { setAuthToken, setAuthUser, getAuthToken } from './utils/storageUtils';
import api from './utils/api';

const EXTERNAL_LOGIN = 'https://yu-mctw.vercel.app/login';

function AppRoutes() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');

    if (tokenFromUrl) {
    
      setAuthToken(tokenFromUrl);

   
      api.get('/users/me')
        .then((res) => {
          setAuthUser(res.data);
        
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          setCheckingAuth(false);
       
          navigate('/dashboard');
        })
        .catch((err) => {
          console.error('Token inválido ou erro ao procurar utilizador:', err);
         
          setAuthToken('');
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          setCheckingAuth(false);
          navigate('/');
        });
    } else {
      
      const token = getAuthToken();
      if (!token) {
        setCheckingAuth(false);
        navigate('https://yu-mctw.vercel.app/login');
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
            navigate('https://yu-mctw.vercel.app/login');
          });
      }
    }
  }, []);

  if (checkingAuth) return null;

  return (
    <Routes>
      {/* Opcional: ainda deixas rota interna de /login? */}
      <Route path="/login" element={<Login />} />

      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="accessories" element={<Accessories />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="preset_messages" element={<PresetMessages />} />
      </Route>

      <Route
        path="*"
        element={
          isAuth ? (
            <Navigate to="/dashboard" replace />
          ) : (
            // qualquer rota estranha vai também ao login externo
            <Navigate to={EXTERNAL_LOGIN} replace />
          )
        }
      />
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
