import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Componente de Layout
import Layout from './Layout';

// Importação das Páginas
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import AdminSettings from './Pages/AdminSettings';
import Login from './Pages/Login'; 

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Rota Pública (Site Principal) */}
          <Route path="/" element={<Home />} />
          
          {/* Rota de Login (Pública também) */}
          <Route path="/login" element={<Login />} />
          
          {/* Rotas de Admin (Protegidas) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-settings" element={<AdminSettings />} />
        </Routes>
      </Layout>
      
      {/* Notificações Toast */}
      <Toaster position="top-center" theme="dark" richColors />
    </BrowserRouter>
  );
}

export default App;