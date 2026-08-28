import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [mot_de_passe, setMotDePasse] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (mot_de_passe.length < 6) return setError('Mot de passe trop court (min 6 caractères)');
    if (mot_de_passe !== confirm) return setError('Les mots de passe ne correspondent pas');
    if (!token) return setError('Lien invalide ou expiré');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', { token, mot_de_passe });
      setMessage(data.message || 'Mot de passe mis à jour.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur. Réessayez.');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto flex flex-col justify-center min-h-screen">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-4">Nouveau mot de passe</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="border p-2 w-full rounded"
          type="password"
          placeholder="Nouveau mot de passe"
          value={mot_de_passe}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />
        <input
          className="border p-2 w-full rounded"
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {message && <p className="text-green-700 text-sm">{message}</p>}
        <button className="bg-amber-700 text-white p-3 w-full rounded font-bold" type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : 'Réinitialiser le mot de passe'}
        </button>
      </form>
      <Link to="/login" className="text-amber-700 text-center mt-4 block text-sm">Retour à la connexion</Link>
    </div>
  );
}