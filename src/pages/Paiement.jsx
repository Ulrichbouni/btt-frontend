import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

export default function Paiement() {
  const [montant, setMontant] = useState('');
  const [phone, setPhone] = useState('');
  const [devisId, setDevisId] = useState('');
  const [loading, setLoading] = useState(false);
  const [historique, setHistorique] = useState([]);
  const [campayReady, setCampayReady] = useState(false);
  const scriptRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    fetchHistorique();

    if (initializedRef.current) return;
    initializedRef.current = true;

    const script = document.createElement('script');
    script.src = 'https://demo.campay.net/sdk/js?app-id=iNSkDT6l6BM1EB6VVj2sawWRK2LIG17N86nM38-GyyENK1K25zrYXyiNMMEvIMr9NOQN20v5fdhQG0mdXzmGmg';
    script.async = true;
    script.onload = () => setCampayReady(true);
    script.onerror = () => setCampayReady(false);
    document.body.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
      }
    };
  }, []);

  const fetchHistorique = async () => {
    try {
      const res = await api.get('/paiements/historique');
      setHistorique(res.data);
    } catch (err) {
      console.error('Erreur historique:', err);
    }
  };

  const initiatePayment = async () => {
    if (!montant || montant <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }
    if (!phone || phone.length < 8) {
      alert('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/paiements/initier', {
        montant: parseFloat(montant),
        methode: 'mobile_money',
        telephone: phone,
        devis_id: devisId ? parseInt(devisId) : null
      });

      if (!campayReady || !window.campay) {
        alert('Campay non pret');
        setLoading(false);
        return;
      }

      window.campay.options({
        payButtonId: 'payButton',
        description: data.description || 'Paiement BTT-LUX',
        amount: String(data.amount || montant),
        currency: 'XAF',
        externalReference: data.reference,
        redirectUrl: data.redirect_url || `${window.location.origin}/paiement`
      });

      window.campay.onSuccess = (paymentData) => {
        alert('Paiement réussi\nRéf: ' + (paymentData.reference || data.reference));
        fetchHistorique();
      };

      window.campay.onFail = (paymentData) => {
        alert('Paiement échoué\nRéf: ' + (paymentData.reference || data.reference));
      };

      window.campay.onModalClose = (paymentData) => {
        alert('Modal fermée\nStatut: ' + (paymentData.status || 'unknown'));
      };

      if (typeof window.campay.open === 'function') {
        window.campay.open();
      }
    } catch (err) {
      alert('Erreur: ' + (err.response?.data?.error || 'Impossible d\'initier le paiement'));
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-4">Paiement Campay</h1>
      <div className="space-y-3">
        <input
          className="border p-2 w-full rounded"
          placeholder="Montant (FCFA)"
          type="number"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
        />
        <input
          className="border p-2 w-full rounded"
          placeholder="Téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          className="border p-2 w-full rounded"
          placeholder="Devis ID (optionnel)"
          type="number"
          value={devisId}
          onChange={(e) => setDevisId(e.target.value)}
        />
        <button
          id="payButton"
          onClick={initiatePayment}
          className="bg-green-600 text-white p-3 w-full rounded font-bold"
          disabled={loading}
        >
          {loading ? 'Initialisation...' : 'Payer avec Campay'}
        </button>
      </div>

      <div className="mt-6">
        <h3 className="font-bold text-lg mb-2">Historique des paiements</h3>
        {historique.length > 0 ? (
          <div className="space-y-2">
            {historique.map((p) => (
              <div key={p.id} className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{p.montant?.toLocaleString()} FCFA</p>
                    <p className="text-xs text-gray-400">Réf: {p.reference}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold">{p.statut}</p>
                    <p className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Aucun paiement effectué</p>
        )}
      </div>
    </div>
  );
}
