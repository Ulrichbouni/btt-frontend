import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function PrendreMesures() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    longueur_murs: '',
    hauteur_sous_plafond: '',
    surface_ouverte: '',
    perimetre: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/technicien/missions/${id}/mesures`, form);
      alert('Mesures envoyées avec succès !');
      navigate('/technicien/mes-missions');
    } catch (err) {
      alert('Erreur : ' + err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-amber-800">📏 Prendre les mesures</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label>Longueur totale des murs (m) :</label>
          <input type="number" step="0.01" value={form.longueur_murs} onChange={e => setForm({...form, longueur_murs: e.target.value})} className="border p-2 w-full rounded" required />
        </div>
        <div>
          <label>Hauteur sous plafond (m) :</label>
          <input type="number" step="0.01" value={form.hauteur_sous_plafond} onChange={e => setForm({...form, hauteur_sous_plafond: e.target.value})} className="border p-2 w-full rounded" required />
        </div>
        <div>
          <label>Surface des ouvertures (fenêtres/portes) (m²) :</label>
          <input type="number" step="0.01" value={form.surface_ouverte} onChange={e => setForm({...form, surface_ouverte: e.target.value})} className="border p-2 w-full rounded" required />
        </div>
        <div>
          <label>Périmètre (m) :</label>
          <input type="number" step="0.01" value={form.perimetre} onChange={e => setForm({...form, perimetre: e.target.value})} className="border p-2 w-full rounded" required />
        </div>
        <button type="submit" className="bg-green-600 text-white p-3 w-full rounded font-bold">
          Envoyer les mesures
        </button>
      </form>
    </div>
  );
}