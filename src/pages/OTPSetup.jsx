import React, { useState } from 'react';
import api from '../services/api';

export default function OTPSetup() {
  const [qr, setQr] = useState(null);
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const enableOTP = async () => {
    setLoading(true);
    const res = await api.post('/otp/enable');
    setQr(res.data.qrCode);
    setSecret(res.data.secret);
    setLoading(false);
  };

  const verifyOTP = async () => {
    await api.post('/otp/verify', { token });
    alert('✅ OTP activé ! Utilisez Google Authenticator pour vos prochaines connexions.');
    window.location.href = '/';
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-4">🔐 Sécuriser mon compte</h1>
      {!qr ? (
        <button onClick={enableOTP} className="bg-amber-700 text-white p-3 w-full rounded font-bold" disabled={loading}>
          {loading ? 'Génération...' : 'Activer l\'authentification à 2 facteurs (OTP)'}
        </button>
      ) : (
        <div>
          <p className="text-sm text-gray-600 mb-2">Scannez ce QR code avec Google Authenticator</p>
          <img src={qr} alt="QR Code" className="w-64 h-64 mx-auto border rounded" />
          <p className="text-xs text-center text-gray-500 mt-2">Secret: {secret}</p>
          <div className="mt-4">
            <input type="text" placeholder="Code OTP (6 chiffres)" value={token} onChange={(e) => setToken(e.target.value)} className="border p-2 w-full rounded text-center text-2xl" />
            <button onClick={verifyOTP} className="bg-green-600 text-white p-3 w-full rounded font-bold mt-2">Vérifier et activer</button>
          </div>
        </div>
      )}
    </div>
  );
}