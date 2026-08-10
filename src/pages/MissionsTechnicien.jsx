import React, { useState, useEffect } from 'react';
import api from '../services/api';
import RouteGuard from '../components/RouteGuard';

export default function MissionsTechnicien() {
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;

  return (
    <RouteGuard allowedRoles={['technicien', 'admin']} user={user}>
      <MissionsContent />
    </RouteGuard>
  );
}

function MissionsContent() {
  const [missions, setMissions] = useState([]);
  const [mesures, setMesures] = useState({
    longueur_murs: '',
    hauteur_sous_plafond: '',
    surface_ouverte: '',
    perimetre: ''
  });

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res = await api.get('/missions/technicien/mes-missions');
        setMissions(res.data);
      } catch (err) {
        console.error('Erreur chargement missions:', err);
      }
    };
    fetchMissions();
  }, []);

  const handleMesureChange = (e) => {
    setMesures({ ...mesures, [e.target.name]: e.target.value });
  };

  const submitMesures = async (missionId) => {
    try {
      await api.post(`/missions/${missionId}/mesures`, mesures);
      alert('? Mesures soumises avec succès');
      window.location.reload();
    } catch (err) {
      alert('? Erreur: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-4">Mes missions</h1>
      {missions.length === 0 && <p className="text-gray-500">Aucune mission assignée</p>}
      {missions.map((m) => (
        <div key={m.id} className="bg-white p-4 rounded-xl shadow mb-4 border border-gray-100">
          <p><strong>Devis #{m.devis_id}</strong> - {m.ville}</p>
          <p>Adresse: {m.adresse}</p>
          <p>
            Statut: 
            <span className={`ml-2 px-2 py-1 rounded ${m.statut === 'terminee' ? 'bg-green-200' : 'bg-yellow-200'}`}>
              {m.statut}
            </span>
          </p>
          <p>Date visite: {new Date(m.date_visite).toLocaleDateString()}</p>
          {m.statut !== 'terminee' && (
            <details className="mt-2">
              <summary className="cursor-pointer text-amber-700 font-semibold">?? Saisir les mesures</summary>
              <div className="mt-2 space-y-2">
                <input
                  type="number"
                  name="longueur_murs"
                  placeholder="Longueur murs (m)"
                  onChange={handleMesureChange}
                  className="border p-2 w-full rounded"
                />
                <input
                  type="number"
                  name="hauteur_sous_plafond"
                  placeholder="Hauteur (m)"
                  onChange={handleMesureChange}
                  className="border p-2 w-full rounded"
                />
                <input
                  type="number"
                  name="surface_ouverte"
                  placeholder="Surface ouvertures (m²)"
                  onChange={handleMesureChange}
                  className="border p-2 w-full rounded"
                />
                <input
                  type="number"
                  name="perimetre"
                  placeholder="Périmètre (m)"
                  onChange={handleMesureChange}
                  className="border p-2 w-full rounded"
                />
                <button
                  onClick={() => submitMesures(m.id)}
                  className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700"
                >
                  Soumettre les mesures
                </button>
              </div>
            </details>
          )}
        </div>
      ))}
    </div>
  );
}
