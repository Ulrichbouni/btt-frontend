import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function MesMissions() {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res = await api.get('/technicien/mes-missions');
        setMissions(res.data);
      } catch (err) {
        alert('Erreur : ' + err.message);
      }
    };
    fetchMissions();
  }, []);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-amber-800">📋 Mes missions</h1>
      {missions.length === 0 ? (
        <p>Aucune mission assignée.</p>
      ) : (
        missions.map(m => (
          <div key={m.id} className="border p-4 my-4 rounded shadow">
            <p><strong>Devis #{m.devis_id}</strong> - {m.ville}</p>
            <p>Adresse : {m.adresse}</p>
            <p>Statut : {m.statut}</p>
            <p>Client : {m.client_nom}</p>
            <Link to={`/technicien/mission/${m.id}/mesures`} className="bg-blue-600 text-white p-2 rounded">
              {m.statut === 'terminee' ? 'Voir les mesures' : 'Prendre les mesures'}
            </Link>
          </div>
        ))
      )}
    </div>
  );
}