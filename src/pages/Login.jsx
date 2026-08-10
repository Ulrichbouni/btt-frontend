import React, { useState } from 'react';
import api from '../services/api';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '', otp_token: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin?.(data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Connexion impossible');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-4">Connexion</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="border p-2 w-full rounded" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="border p-2 w-full rounded" type="password" placeholder="Mot de passe" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <input className="border p-2 w-full rounded" placeholder="OTP (si activé)" value={form.otp_token} onChange={e => setForm({ ...form, otp_token: e.target.value })} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="bg-amber-700 text-white p-3 w-full rounded font-bold" type="submit">Se connecter</button>
      </form>
    </div>
  );
}
