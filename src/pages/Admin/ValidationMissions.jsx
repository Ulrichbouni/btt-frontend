import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function ValidationMissions() {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    const fetchMissions = async () => {
      const res = await api.get('/missions/technicien/mes-missions?technicien_id=all'); // A adapter
      setMissions(res.data.filter(m => m.statut === 'en_cours'));
    };
    fetchMissions();
  }, []);

  const valider = async (id) => {
    await api.put(`/missions/${id}/valider`);
    alert('✅ Mission validée');
    window.location.reload();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-4">Validation des missions</h1>
      {missions.map(m => (
        <div key={m.id} className="bg-white p-4 rounded-xl shadow mb-4 border border-gray-200">
          <p><strong>Mission #{m.id}</strong> - Devis #{m.devis_id}</p>
          <p>Technicien: {m.technicien_id}</p>
          <button onClick={() => valider(m.id)} className="bg-green-600 text-white px-4 py-2 rounded">✅ Valider les mesures</button>
        </div>
      ))}
    </div>
  );
}