import React, { useState } from 'react';
import api from '../services/api';

export default function DemandeDevis() {
  const [form, setForm] = useState({ surface: '', ville: '', adresse: '', date_souhaitee: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/devis', form);
      setSubmitted(true);
    } catch (err) {
      alert('❌ Erreur: ' + err.response?.data?.error);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="p-4 text-center">
        <div className="bg-green-100 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-green-800">✅ Devis envoyé !</h2>
          <p className="text-gray-600 mt-2">Notre équipe vous contactera sous 48h</p>
          <button onClick={() => setSubmitted(false)} className="mt-4 bg-amber-700 text-white px-4 py-2 rounded">
            Nouvelle demande
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-4">Demande de devis</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Surface (m²)</label>
          <input type="number" name="surface" value={form.surface} onChange={handleChange} className="border p-2 w-full rounded" required />
        </div>
        <div>
          <label className="block font-semibold">Ville</label>
          <input type="text" name="ville" value={form.ville} onChange={handleChange} className="border p-2 w-full rounded" required />
        </div>
        <div>
          <label className="block font-semibold">Adresse du chantier</label>
          <input type="text" name="adresse" value={form.adresse} onChange={handleChange} className="border p-2 w-full rounded" required />
        </div>
        <div>
          <label className="block font-semibold">Date souhaitée</label>
          <input type="date" name="date_souhaitee" value={form.date_souhaitee} onChange={handleChange} className="border p-2 w-full rounded" required />
        </div>
        <button type="submit" className="bg-amber-700 text-white p-3 w-full rounded font-bold" disabled={loading}>
          {loading ? 'Envoi...' : '📤 Envoyer la demande'}
        </button>
        <p className="text-xs text-gray-500 text-center">* Un devis détaillé vous sera envoyé sous 48h</p>
      </form>
    </div>
  );
}