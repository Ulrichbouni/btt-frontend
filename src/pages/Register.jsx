import React, { useState } from 'react';
import api from '../services/api';

export default function Register({ onRegistered }) {
  const [step, setStep] = useState('otp');
  const [form, setForm] = useState({ telephone: '', code: '', nom: '', email: '', password: '' });
  const [error, setError] = useState('');

  const requestOTP = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/request-otp', { telephone: form.telephone });
      setStep('verify');
    } catch (err) {
      setError(err.response?.data?.error || 'OTP impossible');
    }
  };

  const verifyAndRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/verify-otp', { telephone: form.telephone, code: form.code });
      const { data } = await api.post('/auth/register', {
        nom: form.nom,
        email: form.email,
        telephone: form.telephone,
        mot_de_passe: form.password,
        otp_code: form.code
      });
      onRegistered?.(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Inscription impossible');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-4">Inscription</h1>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      {step === 'otp' ? (
        <form onSubmit={requestOTP} className="space-y-3">
          <input className="border p-2 w-full rounded" placeholder="Telephone" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} />
          <button className="bg-amber-700 text-white p-3 w-full rounded font-bold" type="submit">Recevoir le code OTP</button>
        </form>
      ) : (
        <form onSubmit={verifyAndRegister} className="space-y-3">
          <input className="border p-2 w-full rounded" placeholder="Nom" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
          <input className="border p-2 w-full rounded" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className="border p-2 w-full rounded" type="password" placeholder="Mot de passe" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <input className="border p-2 w-full rounded" placeholder="Code OTP" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
          <button className="bg-green-700 text-white p-3 w-full rounded font-bold" type="submit">Verifier et creer le compte</button>
        </form>
      )}
    </div>
  );
}

