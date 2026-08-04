import React, { useState } from 'react';

export default function Ressources() {
  const [categorie, setCategorie] = useState('toutes');
  const ressources = [
    { id: 1, titre: 'Fiche technique Façade 12mm', categorie: 'fiches' },
    { id: 2, titre: 'Fiche technique Cloison 10mm', categorie: 'fiches' },
    { id: 3, titre: 'Brochure Luxerboard 2026', categorie: 'brochures' },
    { id: 4, titre: 'Certification ISO 9001', categorie: 'certifications' },
    { id: 5, titre: 'Fiche technique Plafond 8mm', categorie: 'fiches' },
  ];

  const filtered = categorie === 'toutes' ? ressources : ressources.filter(r => r.categorie === categorie);

  const handleWhatsApp = (titre) => {
    const msg = `Bonjour, je souhaite recevoir le document: ${titre}`;
    window.open(`https://wa.me/237699999999?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-4">📚 Ressources documentaires</h1>
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {['toutes', 'fiches', 'brochures', 'certifications'].map(c => (
          <button key={c} onClick={() => setCategorie(c)} className={`px-4 py-2 rounded-full whitespace-nowrap ${categorie === c ? 'bg-amber-700 text-white' : 'bg-gray-200'}`}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className="bg-white p-4 rounded-xl shadow border border-gray-100 flex justify-between items-center">
            <span>{r.titre}</span>
            <button onClick={() => handleWhatsApp(r.titre)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">
              📥 Demander sur WhatsApp
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}