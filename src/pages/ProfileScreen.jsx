import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', mot_de_passe: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    api.get('/auth/me').then(res => {
      setUser(res.data);
      setForm({
        nom: res.data.nom || '',
        email: res.data.email || '',
        telephone: res.data.telephone || '',
        mot_de_passe: ''
      });
    }).catch(() => {
      setMessage({ type: 'error', text: 'Erreur lors du chargement du profil' });
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const body = {};
      if (form.nom) body.nom = form.nom;
      if (form.email) body.email = form.email;
      if (form.telephone) body.telephone = form.telephone;
      if (form.mot_de_passe) body.mot_de_passe = form.mot_de_passe;

      const res = await api.put('/auth/me', body);
      setUser(res.data.user);
      setForm({ ...form, mot_de_passe: '' });
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Erreur lors de la mise à jour' });
    }
    setLoading(false);
  };

  if (!user) return <div className="p-6 text-center">Chargement...</div>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-amber-900 mb-6">Mon Profil</h2>

      {message.text && (
        <div className={`p-3 rounded mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Téléphone</label>
          <input
            type="tel"
            name="telephone"
            value={form.telephone}
            onChange={handleChange}
            placeholder="+237655505798"
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe (optionnel)</label>
          <input
            type="password"
            name="mot_de_passe"
            value={form.mot_de_passe}
            onChange={handleChange}
            placeholder="Laisser vide pour ne pas changer"
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        <div className="pt-2">
          <span className="text-sm text-gray-500">Rôle : <strong>{user.role}</strong></span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-700 text-white py-3 rounded font-bold hover:bg-amber-800 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
}
