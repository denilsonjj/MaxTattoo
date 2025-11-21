import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import Layout from './Layout';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import AdminSettings from './Pages/AdminSettings';
import Login from './Pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas privadas dentro do Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-settings" element={<AdminSettings />} />
        </Route>
      </Routes>

      <Toaster position="top-center" theme="dark" richColors />
    </BrowserRouter>
  );
}

export default App;
