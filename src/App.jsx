import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import api from './services/api';

import DevisDetail from './pages/Admin/DevisDetail';
import DashboardAdmin from './pages/Admin/DashboardAdmin';
import ValidationMissions from './pages/Admin/ValidationMissions';
import Catalogue from './pages/Catalogue';
import Calculateur from './pages/Calculateur';
import ProsBTP from './pages/ProsBTP';
import DemandeDevis from './pages/DemandeDevis';
import SuiviChantier from './pages/SuiviChantier';
import Formation from './pages/Formation';
import Paiement from './pages/Paiement';
import AssistantIA from './pages/AssistantIA';
import Galerie from './pages/Galerie';
import Ressources from './pages/Ressources';
import Notifications from './pages/Notifications';
import MissionsTechnicien from './pages/MissionsTechnicien';
import OTPSetup from './pages/OTPSetup';
import Login from './pages/Login';
import Register from './pages/Register';

const PlaceholderPage = ({ title }) => (
  <div className="p-6 text-center">
    <h2 className="text-2xl font-bold text-amber-800">{title}</h2>
    <p className="text-gray-600 mt-4">Module en cours de développement</p>
  </div>
);

function Layout({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  const navItems = [
    { icon: '??', label: 'Catalogue', path: '/produits' },
    { icon: '??', label: 'Calculateur', path: '/calculateur' },
    { icon: '??', label: 'Devis', path: '/devis' },
    { icon: '??', label: 'Paiement', path: '/paiement' },
    { icon: '??', label: 'Notifications', path: '/notifications' },
    { icon: '??', label: 'Missions', path: '/missions' },
  ];

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {location.pathname !== '/' && (
            <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded">
              <span className="text-xl">?</span>
            </button>
          )}
          <span className="font-serif font-bold text-amber-900 text-lg">BTT-LUX</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{user?.nom || user?.email}</span>
          <button onClick={logout} className="text-gray-500">??</button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 max-w-md mx-auto z-10">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`flex flex-col items-center text-xs ${isActive ? 'text-amber-700' : 'text-gray-500'}`}>
              <span className="text-xl">{item.icon}</span>
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    api.get('/auth/me').catch(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    });
  }, []);

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/register" element={<Register onRegistered={(u) => setUser(u)} />} />
          <Route path="*" element={<Login onLogin={setUser} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} onLogout={() => setUser(null)} />}>
          <Route index element={<PlaceholderPage title="Accueil" />} />
          <Route path="produits" element={<Catalogue />} />
          <Route path="calculateur" element={<Calculateur />} />
          <Route path="pros" element={<ProsBTP />} />
          <Route path="devis" element={<DemandeDevis />} />
          <Route path="suivi" element={<SuiviChantier />} />
          <Route path="formation" element={<Formation />} />
          <Route path="paiement" element={<Paiement />} />
          <Route path="assistant" element={<AssistantIA />} />
          <Route path="galerie" element={<Galerie />} />
          <Route path="ressources" element={<Ressources />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="missions" element={<MissionsTechnicien />} />
          <Route path="otp" element={<OTPSetup />} />
        </Route>

        <Route path="/admin/devis/:id" element={<DevisDetail />} />
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/validation-missions" element={<ValidationMissions />} />
        <Route path="*" element={<PlaceholderPage title="Page non trouvee" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;








