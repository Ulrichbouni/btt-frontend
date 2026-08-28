import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Accueil() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ devis: 0, notifications: 0, paiements: 0 });

  useEffect(() => {
    try { setUser(JSON.parse(localStorage.getItem('user') || 'null')); } catch {}

    (async () => {
      try {
        const [d, n, p] = await Promise.allSettled([
          api.get('/devis/mes-devis'),
          api.get('/notifications'),
          api.get('/paiements/historique')
        ]);
        setStats({
          devis: d.status === 'fulfilled' ? d.value.data?.length || 0 : 0,
          notifications: n.status === 'fulfilled' ? n.value.data?.length || 0 : 0,
          paiements: p.status === 'fulfilled' ? p.value.data?.filter(x => x.statut === 'reussi').length || 0 : 0
        });
      } catch {}
    })();
  }, []);

  const cards = [
    { label: 'Devis', value: stats.devis, path: '/devis', emoji: '📄', color: 'bg-amber-100 text-amber-900' },
    { label: 'Notifications', value: stats.notifications, path: '/notifications', emoji: '🔔', color: 'bg-blue-100 text-blue-900' },
    { label: 'Paiements réussis', value: stats.paiements, path: '/paiement', emoji: '💳', color: 'bg-green-100 text-green-900' }
  ];

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Bannière */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-600 rounded-xl p-6 text-white mb-5">
        <h1 className="text-2xl font-serif font-bold">Bonjour, {user?.nom?.split(' ')[0] || user?.email || 'Bienvenue'} 👋</h1>
        <p className="text-amber-100 text-sm mt-1">Panneaux isolants Luxerboard & construction BTT-LUX</p>
      </div>

      {/* Cartes stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {cards.map(c => (
          <Link key={c.label} to={c.path} className={`${c.color} rounded-xl p-3 text-center`}>
            <div className="text-2xl">{c.emoji}</div>
            <div className="text-xl font-bold">{c.value}</div>
            <div className="text-xs">{c.label}</div>
          </Link>
        ))}
      </div>

      {/* Actions rapides */}
      <h2 className="font-bold text-lg mb-3 text-gray-800">Actions rapides</h2>
      <div className="grid grid-cols-2 gap-3">
        <Link to="/calculateur" className="bg-white border rounded-xl p-4">
          <div className="text-2xl mb-1">🧮</div>
          <div className="font-semibold">Calculer un besoin</div>
          <div className="text-xs text-gray-500">Estimez vos panneaux</div>
        </Link>
        <Link to="/devis" className="bg-white border rounded-xl p-4">
          <div className="text-2xl mb-1">📄</div>
          <div className="font-semibold">Demander un devis</div>
          <div className="text-xs text-gray-500">Sous 48h</div>
        </Link>
        <Link to="/paiement" className="bg-white border rounded-xl p-4">
          <div className="text-2xl mb-1">💳</div>
          <div className="font-semibold">Payer</div>
          <div className="text-xs text-gray-500">Mobile Money</div>
        </Link>
        <Link to="/assistant" className="bg-white border rounded-xl p-4">
          <div className="text-2xl mb-1">🤖</div>
          <div className="font-semibold">Assistant IA</div>
          <div className="text-xs text-gray-500">Questions ?</div>
        </Link>
        <Link to="/suivi" className="bg-white border rounded-xl p-4">
          <div className="text-2xl mb-1">🏗️</div>
          <div className="font-semibold">Suivre mon chantier</div>
          <div className="text-xs text-gray-500">Avancement</div>
        </Link>
        <Link to="/galerie" className="bg-white border rounded-xl p-4">
          <div className="text-2xl mb-1">📷</div>
          <div className="font-semibold">Galerie</div>
          <div className="text-xs text-gray-500">Réalisations</div>
        </Link>
      </div>
    </div>
  );
}