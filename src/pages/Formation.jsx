import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Formation() {
  const [modules, setModules] = useState([]);
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const fetchModules = async () => {
      // Simuler des modules
      setModules([
        { id: 1, titre: 'Découverte produit Luxerboard', duree: '2h', niveau: 'Débutant', description: 'Présentation de la gamme et des applications' },
        { id: 2, titre: 'Pose en façade', duree: '3h', niveau: 'Intermédiaire', description: 'Techniques de pose des panneaux façade' },
        { id: 3, titre: 'Sécurité et normes', duree: '1h', niveau: 'Débutant', description: 'Règles de sécurité et normes ISO' },
        { id: 4, titre: 'Finitions et accessoires', duree: '2h', niveau: 'Avancé', description: 'Finitions, joints et accessoires' },
      ]);
    };
    fetchModules();
    // Charger progression
    const saved = localStorage.getItem('formation-progress');
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  const completeModule = (id) => {
    const newProgress = { ...progress, [id]: true };
    setProgress(newProgress);
    localStorage.setItem('formation-progress', JSON.stringify(newProgress));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-4">🎓 Luxerboard Academy</h1>
      {modules.map(m => (
        <div key={m.id} className="bg-white p-4 rounded-xl shadow mb-4 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{m.titre}</h3>
              <p className="text-sm text-gray-600">{m.duree} • {m.niveau}</p>
              <p className="text-sm text-gray-500 mt-1">{m.description}</p>
            </div>
            {progress[m.id] ? (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">✅ Certifié</span>
            ) : (
              <button onClick={() => completeModule(m.id)} className="bg-amber-700 text-white px-3 py-1 rounded text-sm">
                Terminer le module
              </button>
            )}
          </div>
          {!progress[m.id] && (
            <details className="mt-2">
              <summary className="cursor-pointer text-blue-600 text-sm">📹 Voir le contenu</summary>
              <div className="mt-2 bg-gray-50 p-3 rounded">
                <p className="text-sm">📹 Vidéo du cours (lien à venir)</p>
                <p className="text-sm">📄 Support PDF (téléchargement)</p>
                <button className="mt-2 bg-blue-600 text-white px-4 py-1 rounded text-sm">🏆 Quiz de validation</button>
              </div>
            </details>
          )}
        </div>
      ))}
    </div>
  );
}