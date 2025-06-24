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
import Login from './pages/Login'; 
import { clearAuthStorage,setAuthToken, setAuthUser, getAuthToken } from './utils/storageUtils';
import api from './utils/api';

const EXTERNAL_LOGIN = 'https://yu-mctw.vercel.app/login';

function AppRoutes() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

useEffect(() => {

  async function bootstrap() {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    try {

      if (tokenFromUrl) {
        setAuthToken(tokenFromUrl);

        const { data: user } = await api.get("/users/me");
        setAuthUser(user);

   
        window.history.replaceState({}, "", "/dashboard");

        setIsAuth(true);
        setCheckingAuth(false);
        navigate("/dashboard", { replace: true });
        return;
      }


      const storedToken = getAuthToken();
      if (!storedToken) {

        window.location.replace(EXTERNAL_LOGIN);
        return;
      }

      const { data: user } = await api.get("/users/me");
      setAuthUser(user);

      setIsAuth(true);
      setCheckingAuth(false);
    } catch (err) {
      console.error("Token inválido ou expirado:", err);
      clearAuthStorage();
      window.location.replace(EXTERNAL_LOGIN);
    }
  }

  bootstrap();
}, [navigate]);

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
