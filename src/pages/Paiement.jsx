import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Paiement() {
  const [montant, setMontant] = useState('');
  const [methode, setMethode] = useState('mtn');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [historique, setHistorique] = useState([]);

  useEffect(() => {
    fetchHistorique();
  }, []);

  const fetchHistorique = async () => {
    const res = await api.get('/paiements/historique');
    setHistorique(res.data);
  };

  const handlePaiement = async () => {
    if (!montant || montant <= 0) return alert('Montant invalide');
    setLoading(true);
    const data = {
      montant: parseFloat(montant),
      methode,
      telephone: phone
    };
    const res = await api.post('/paiements/simuler', data);
    alert(`✅ Paiement simulé\nRéférence: ${res.data.reference}\nMontant: ${res.data.montant} FCFA`);
    fetchHistorique();
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-4">💳 Paiement mobile</h1>
      <p className="text-sm text-gray-500 mb-4">* Simulation de paiement (intégration réelle à prévoir)</p>
      
      <div className="space-y-4">
        <div>
          <label className="block font-semibold">Montant (FCFA)</label>
          <input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} className="border p-2 w-full rounded" />
        </div>
        <div>
          <label className="block font-semibold">Méthode</label>
          <select value={methode} onChange={(e) => setMethode(e.target.value)} className="border p-2 w-full rounded">
            <option value="mtn">MTN MoMo</option>
            <option value="orange">Orange Money</option>
            <option value="carte">Carte Bancaire</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">Numéro mobile</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2 w-full rounded" placeholder="6XXXXXXXX" />
        </div>
        <button onClick={handlePaiement} className="bg-green-600 text-white p-3 w-full rounded font-bold" disabled={loading}>
          {loading ? 'Traitement...' : '💳 Payer maintenant'}
        </button>
      </div>

      <div className="mt-6">
        <h3 className="font-bold text-lg mb-2">📜 Historique des paiements</h3>
        {historique.map(p => (
          <div key={p.id} className="bg-gray-50 p-3 rounded mb-2 border border-gray-200">
            <p className="font-semibold">{p.montant} FCFA</p>
            <p className="text-sm text-gray-500">{p.methode} • Réf: {p.reference}</p>
            <p className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</p>
          </div>
        ))}
        {historique.length === 0 && <p className="text-gray-500">Aucun paiement</p>}
      </div>
    </div>
  );
}