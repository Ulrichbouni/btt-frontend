import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.message || 'Un lien de réinitialisation a été envoyé si cet email existe.');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur. Réessayez.');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto flex flex-col justify-center min-h-screen">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-2">Mot de passe oublié</h1>
      <p className="text-gray-600 text-sm mb-4">Entrez votre email pour recevoir un lien de réinitialisation.</p>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="border p-2 w-full rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {message && <p className="text-green-700 text-sm">{message}</p>}
        <button className="bg-amber-700 text-white p-3 w-full rounded font-bold" type="submit" disabled={loading}>
          {loading ? 'Envoi...' : 'Envoyer le lien'}
        </button>
      </form>
      <Link to="/login" className="text-amber-700 text-center mt-4 block text-sm">Retour à la connexion</Link>
    </div>
  );
}