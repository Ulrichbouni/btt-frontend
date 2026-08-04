import React, { useState } from 'react';

export default function Galerie() {
  const [realisations] = useState([
    { id: 1, ville: 'Douala', produit: 'Façade 12mm', description: 'Rénovation façade immeuble commercial', avant: '#e5e7eb', apres: '#d4a373' },
    { id: 2, ville: 'Yaoundé', produit: 'Cloison 10mm', description: 'Bureaux open space', avant: '#e5e7eb', apres: '#b7b7a4' },
    { id: 3, ville: 'Bafoussam', produit: 'Plafond 8mm', description: 'Plafond suspendu résidentiel', avant: '#e5e7eb', apres: '#a5a58d' },
  ]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-4">🏗️ Galerie de réalisations</h1>
      <p className="text-sm text-gray-500 mb-4">* Photos schématiques - remplacement par vraies photos à venir</p>
      <div className="grid grid-cols-1 gap-4">
        {realisations.map(r => (
          <div key={r.id} className="bg-white p-4 rounded-xl shadow border border-gray-100">
            <h3 className="font-bold">{r.ville} - {r.produit}</h3>
            <p className="text-sm text-gray-600">{r.description}</p>
            <div className="flex gap-4 mt-3">
              <div className="flex-1 p-8 rounded text-center" style={{ background: r.avant }}>
                <span className="text-xs text-gray-600">⬅️ Avant</span>
              </div>
              <div className="flex-1 p-8 rounded text-center" style={{ background: r.apres }}>
                <span className="text-xs text-white">➡️ Après</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}