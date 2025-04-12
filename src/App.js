import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Accessories from './pages/Accessories';
import Login from './pages/Login'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota para login */}
        <Route path="/login" element={<Login />} />
       


        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/accessories" element={<Accessories />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
