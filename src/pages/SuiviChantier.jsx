import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function SuiviChantier() {
  const [chantiers, setChantiers] = useState([]);
  const [selected, setSelected] = useState(null);

  const etapes = ['Devis reçu', 'Visite technique', 'Commande validée', 'Livraison', 'Pose en cours', 'Chantier terminé'];

  useEffect(() => {
    const fetchChantiers = async () => {
      const res = await api.get('/chantiers/mes-chantiers');
      setChantiers(res.data);
    };
    fetchChantiers();
  }, []);

  const avancer = async (id) => {
    await api.put(`/chantiers/${id}/avancer`);
    alert('✅ Étape suivante');
    window.location.reload();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-4">Suivi de chantier</h1>
      {chantiers.map(c => {
        const currentIndex = etapes.indexOf(c.etape);
        return (
          <div key={c.id} className="bg-white p-4 rounded-xl shadow mb-4 border border-gray-100">
            <p><strong>Chantier #{c.id}</strong> - {c.ville}</p>
            <p className="text-sm text-gray-600">{c.adresse}</p>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                {etapes.map((e, i) => (
                  <React.Fragment key={i}>
                    <div className={`w-4 h-4 rounded-full ${i <= currentIndex ? 'bg-green-600' : 'bg-gray-300'}`} />
                    {i < etapes.length - 1 && <div className={`flex-1 h-0.5 ${i < currentIndex ? 'bg-green-600' : 'bg-gray-300'}`} />}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-between text-xs mt-1 text-gray-500">
                {etapes.map((e, i) => <span key={i}>{i === currentIndex ? '📍' : ''}{e}</span>)}
              </div>
            </div>
            <p className="mt-2 font-semibold text-amber-800">Étape actuelle: {c.etape}</p>
            {(localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'technicien') && currentIndex < etapes.length - 1 && (
              <button onClick={() => avancer(c.id)} className="mt-2 bg-blue-600 text-white px-4 py-1 rounded text-sm">
                ⏩ Passer à l'étape suivante
              </button>
            )}
          </div>
        );
      })}
      {chantiers.length === 0 && <p className="text-gray-500">Aucun chantier en cours</p>}
    </div>
  );
}