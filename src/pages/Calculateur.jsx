import React, { useState } from 'react';
import api from '../services/api';

export default function Calculateur() {
  const [form, setForm] = useState({ longueur: '', largeur: '', type_batiment: 'residentiel', etage: 0, produit_id: 1 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/calculator/estimer', form);
      setResult(res.data);
    } catch (err) {
      alert('Erreur: ' + err.response?.data?.error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-4">Calculateur de besoins</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Longueur (m)</label>
          <input type="number" name="longueur" value={form.longueur} onChange={handleChange} className="border p-2 w-full rounded" required />
        </div>
        <div>
          <label className="block font-semibold">Largeur (m)</label>
          <input type="number" name="largeur" value={form.largeur} onChange={handleChange} className="border p-2 w-full rounded" required />
        </div>
        <div>
          <label className="block font-semibold">Type de bâtiment</label>
          <select name="type_batiment" value={form.type_batiment} onChange={handleChange} className="border p-2 w-full rounded">
            <option value="residentiel">Résidentiel</option>
            <option value="commercial">Commercial</option>
            <option value="industriel">Industriel</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">Étage</label>
          <input type="number" name="etage" value={form.etage} onChange={handleChange} className="border p-2 w-full rounded" />
        </div>
        <div>
          <label className="block font-semibold">Produit (ID)</label>
          <input type="number" name="produit_id" value={form.produit_id} onChange={handleChange} className="border p-2 w-full rounded" />
        </div>
        <button type="submit" className="bg-amber-700 text-white p-3 w-full rounded font-bold" disabled={loading}>
          {loading ? 'Calcul en cours...' : '🔢 Estimer mes besoins'}
        </button>
      </form>
      {result && (
        <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-200">
          <h3 className="font-bold text-lg">Résultat</h3>
          <p>Surface: {result.surface} m²</p>
          <p>Épaisseur suggérée: {result.epaisseur_suggested}</p>
          <p>Panneaux nécessaires: {result.nb_panneaux} (marge 10%)</p>
          <p>Ossature: {result.ossature_ml} ml</p>
          <p>Vis: {result.nb_vis}</p>
          <p>Poids total: {result.poids_total} kg</p>
          <p>Équivalent conteneur: {result.equivalent_conteneur}</p>
          <p className="text-2xl font-bold text-amber-800 mt-2">Coût estimé: {result.cout_total} FCFA</p>
          <p className="text-xs text-gray-500 mt-2">* {result.mention}</p>
        </div>
      )}
    </div>
  );
}