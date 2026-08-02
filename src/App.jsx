import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Home, Package, Calculator, Users, FileText, Bell, ArrowLeft, LogOut } from 'lucide-react';

// --- Placeholders pour les pages non encore développées (à remplacer plus tard) ---
const PlaceholderPage = ({ title }) => (
  <div className="p-6 text-center">
    <h2 className="text-2xl font-bold text-amber-800">{title}</h2>
    <p className="text-gray-600 mt-4">Module en cours de développement</p>
    <div className="mt-8 bg-gray-100 p-8 rounded-xl border-2 border-dashed border-gray-300">
      <p className="text-gray-500">🔨 Contenu à venir</p>
    </div>
  </div>
);

// --- Pages réelles déjà codées (ou placeholders si manquantes) ---
import DevisDetail from './pages/Admin/DevisDetail';

// Composant page d'accueil (avec les raccourcis)
const HomePage = () => {
  const navigate = useNavigate();
  const shortcuts = [
    { icon: Package, label: 'Catalogue', path: '/produits' },
    { icon: Calculator, label: 'Calculateur', path: '/calculateur' },
    { icon: FileText, label: 'Demande de devis', path: '/devis' },
    { icon: Users, label: 'Réseau pros', path: '/pros' },
    { icon: Home, label: 'Suivi chantier', path: '/suivi' },
    { icon: Bell, label: 'Formation', path: '/formation' },
    { icon: Bell, label: 'Paiement', path: '/paiement' },
    { icon: Bell, label: 'Assistant IA', path: '/assistant' },
    { icon: Bell, label: 'Galerie', path: '/galerie' },
    { icon: Bell, label: 'Ressources', path: '/ressources' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Bell, label: 'Admin', path: '/admin/dashboard' },
  ];

  return (
    <div className="p-4">
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-2xl shadow-sm mb-6">
        <h1 className="text-3xl font-serif font-bold text-amber-900">BTT-LUX Ap</h1>
        <p className="text-amber-700">Begueni Timber Trading · Luxerboard</p>
        <div className="flex gap-2 mt-3">
          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">ISO 9001</span>
          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">JAS-ANZ</span>
          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">Sans amiante</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {shortcuts.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-all flex flex-col items-center border border-gray-100"
          >
            <item.icon className="w-8 h-8 text-amber-700" />
            <span className="text-xs font-medium text-gray-700 mt-2 text-center">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Layout avec en-tête et navigation basse ---
const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifCount] = useState(3); // exemple

  const navItems = [
    { icon: Home, label: 'Accueil', path: '/' },
    { icon: Package, label: 'Produits', path: '/produits' },
    { icon: Calculator, label: 'Calcul', path: '/calculateur' },
    { icon: Users, label: 'Pros BTP', path: '/pros' },
    { icon: FileText, label: 'Devis', path: '/devis' },
  ];

  // Cacher la navigation sur certaines pages (admin, etc.)
  const hideNav = location.pathname.startsWith('/admin');

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen flex flex-col relative">
      {/* En-tête fixe */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {location.pathname !== '/' && (
            <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded">
              <ArrowLeft className="w-5 h-5 text-amber-800" />
            </button>
          )}
          <span className="font-serif font-bold text-amber-900 text-lg">BTT-LUX</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/notifications')} className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {notifCount}
              </span>
            )}
          </button>
          <button onClick={() => navigate('/')} className="text-gray-500">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>

      {/* Barre de navigation basse */}
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 max-w-md mx-auto z-10">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center text-xs ${isActive ? 'text-amber-700' : 'text-gray-500'}`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-amber-700' : 'text-gray-500'}`} />
                <span className="mt-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
};

// --- Composant principal App ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout avec navigation */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="produits" element={<PlaceholderPage title="Catalogue produits" />} />
          <Route path="calculateur" element={<PlaceholderPage title="Calculateur de besoins" />} />
          <Route path="pros" element={<PlaceholderPage title="Réseau de professionnels BTP" />} />
          <Route path="devis" element={<PlaceholderPage title="Demande de devis" />} />
          <Route path="suivi" element={<PlaceholderPage title="Suivi de chantier" />} />
          <Route path="formation" element={<PlaceholderPage title="Luxerboard Academy" />} />
          <Route path="paiement" element={<PlaceholderPage title="Paiement mobile" />} />
          <Route path="assistant" element={<PlaceholderPage title="Assistant IA" />} />
          <Route path="galerie" element={<PlaceholderPage title="Galerie de réalisations" />} />
          <Route path="ressources" element={<PlaceholderPage title="Ressources documentaires" />} />
          <Route path="notifications" element={<PlaceholderPage title="Notifications" />} />
        </Route>

        {/* Routes sans layout (plein écran) pour l'admin */}
        <Route path="/admin/devis/:id" element={<DevisDetail />} />
        <Route path="/admin/dashboard" element={<PlaceholderPage title="Tableau de bord Admin" />} />
        {/* Ajoutez d'autres routes admin ici */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;