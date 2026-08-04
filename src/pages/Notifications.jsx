import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Notifications simulées (à connecter à l'API)
    const saved = localStorage.getItem('notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      const defaults = [
        { id: 1, titre: 'Bienvenue sur BTT-LUX Ap', corps: 'Découvrez notre catalogue de produits', lu: false, date: new Date() },
        { id: 2, titre: 'Devis envoyé', corps: 'Votre devis #1 a bien été reçu', lu: false, date: new Date() },
      ];
      setNotifications(defaults);
      localStorage.setItem('notifications', JSON.stringify(defaults));
    }
  }, []);

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, lu: true } : n);
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const countUnread = notifications.filter(n => !n.lu).length;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-serif font-bold text-amber-900">🔔 Notifications</h1>
        {countUnread > 0 && <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">{countUnread} non lues</span>}
      </div>
      {notifications.map(n => (
        <div key={n.id} className={`p-4 rounded-xl mb-3 border ${n.lu ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-300'}`}>
          <div className="flex justify-between">
            <h3 className="font-bold">{n.titre}</h3>
            <button onClick={() => markAsRead(n.id)} className="text-sm text-blue-600">
              {n.lu ? '✅ Lu' : 'Marquer comme lu'}
            </button>
          </div>
          <p className="text-sm text-gray-600">{n.corps}</p>
          <p className="text-xs text-gray-400 mt-1">{new Date(n.date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}