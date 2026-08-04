import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function ProsBTP() {
  const [pros, setPros] = useState([]);
  const [filtreMetier, setFiltreMetier] = useState('');
  const [filtreVille, setFiltreVille] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [csvFile, setCsvFile] = useState(null);

  const villes = ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Maroua', 'Ngaoundéré', 'Bamenda', 'Bertoua'];
  const metiers = ['Poseur', 'Ingénieur BTP', 'Architecte'];

  useEffect(() => {
    fetchPros();
  }, [filtreMetier, filtreVille]);

  const fetchPros = async () => {
    const params = new URLSearchParams();
    if (filtreMetier) params.append('metier', filtreMetier);
    if (filtreVille) params.append('ville', filtreVille);
    const res = await api.get(`/professionnels?${params}`);
    setPros(res.data);
  };

  const handleImport = async () => {
    if (!csvFile) return alert('Sélectionnez un fichier CSV');
    const text = await csvFile.text();
    const lines = text.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const contacts = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      return {
        nom: values[headers.indexOf('nom')] || '',
        ville: values[headers.indexOf('ville')] || '',
        telephone: values[headers.indexOf('telephone')] || '',
        metier: values[headers.indexOf('metier')] || 'Poseur'
      };
    }).filter(c => c.nom);
    await api.post('/professionnels/import', { contacts });
    alert(`${contacts.length} professionnels importés`);
    fetchPros();
    setShowImport(false);
  };

  const handleWhatsApp = (telephone, nom) => {
    const msg = `Bonjour ${nom}, je vous contacte via BTT-LUX Ap pour un projet Luxerboard.`;
    window.open(`https://wa.me/237${telephone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-serif font-bold text-amber-900">Réseau professionnels</h1>
        <button onClick={() => setShowImport(!showImport)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
          {showImport ? '✕ Fermer' : '📥 Importer CSV'}
        </button>
      </div>

      {showImport && (
        <div className="bg-gray-100 p-4 rounded-xl mb-4">
          <p className="text-sm text-gray-600 mb-2">Colonnes: nom, ville, telephone, metier</p>
          <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} className="mb-2" />
          <button onClick={handleImport} className="bg-blue-600 text-white px-4 py-2 rounded">Importer</button>
        </div>
      )}

      <div className="flex gap-2 mb-4 overflow-x-auto">
        <select value={filtreMetier} onChange={(e) => setFiltreMetier(e.target.value)} className="border p-2 rounded">
          <option value="">Tous métiers</option>
          {metiers.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={filtreVille} onChange={(e) => setFiltreVille(e.target.value)} className="border p-2 rounded">
          <option value="">Toutes villes</option>
          {villes.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {pros.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-xl shadow border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{p.nom}</h3>
                <p className="text-sm text-gray-600">{p.role} • {p.ville}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-amber-100 px-2 py-1 rounded">{p.niveau_certification || 'Certifié'}</span>
                  <span className="text-xs bg-blue-100 px-2 py-1 rounded">⭐ {p.note || 0}/5</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{p.nb_chantiers || 0} chantiers</span>
                </div>
              </div>
              <button onClick={() => handleWhatsApp(p.telephone, p.nom)} className="bg-green-500 text-white p-2 rounded-full">
                💬
              </button>
            </div>
          </div>
        ))}
        {pros.length === 0 && <p className="text-gray-500 text-center">Aucun professionnel trouvé</p>}
      </div>
    </div>
  );
}