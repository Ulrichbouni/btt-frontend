import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/notifications');
        setNotifications(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, []);

  const markAsRead = async (id) => {
    await api.patch(`/notifications/${id}/lu`);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n));
  };

  const unread = notifications.filter(n => !n.lu).length;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-serif font-bold text-amber-900">Notifications</h1>
        {unread > 0 && <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">{unread} non lues</span>}
      </div>
      {notifications.length === 0 && <p className="text-gray-500">Aucune notification</p>}
      {notifications.map(n => (
        <div key={n.id} className={`p-4 rounded-xl mb-3 border ${n.lu ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-300'}`}>
          <div className="flex justify-between">
            <h3 className="font-bold">{n.titre}</h3>
            {!n.lu && <button onClick={() => markAsRead(n.id)} className="text-sm text-blue-600">Marquer lu</button>}
          </div>
          <p className="text-sm text-gray-600">{n.corps}</p>
          <p className="text-xs text-gray-400 mt-1">{new Date(n.date_envoi).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
