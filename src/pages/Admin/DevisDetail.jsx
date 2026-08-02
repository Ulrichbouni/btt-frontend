import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

export default function DevisDetail() {
  const { id } = useParams();
  const [devis, setDevis] = useState(null);
  const [remise, setRemise] = useState(0);
  const [transport, setTransport] = useState(0);
  const [divers, setDivers] = useState(0);
  const [totalCalcule, setTotalCalcule] = useState(null);

  useEffect(() => {
    const fetchDevis = async () => {
      try {
        const res = await api.get(`/admin/devis/${id}`);
        setDevis(res.data);
        setRemise(res.data.remise_pourcentage || 0);
        setTransport(res.data.frais_transport || 0);
        setDivers(res.data.frais_divers || 0);
      } catch (err) {
        alert('Erreur : ' + (err.response?.data?.error || err.message));
      }
    };
    fetchDevis();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const res = await api.put(`/admin/devis/${id}`, {
        remise_pourcentage: remise,
        frais_transport: transport,
        frais_divers: divers
      });
      setTotalCalcule(res.data.total_final);
      alert('✅ Devis mis à jour !');
    } catch (err) {
      alert('❌ Erreur : ' + (err.response?.data?.error || err.message));
    }
  };

  const handleValidate = async () => {
    try {
      await api.post(`/admin/devis/${id}/valider`);
      alert('🚀 Chantier créé avec succès !');
    } catch (err) {
      alert('❌ Erreur : ' + (err.response?.data?.error || err.message));
    }
  };

  if (!devis) return <div className="p-4">Chargement du devis...</div>;

  return (
    <div className="p-4 max-w-lg mx-auto font-sans">
      <h1 className="text-2xl font-bold text-amber-800">Détail du Devis #{id}</h1>
      <div className="bg-gray-100 p-4 my-4 rounded">
        <p><strong>Étage :</strong> {devis.etage} | <strong>Surface :</strong> {devis.surface} m²</p>
        <p><strong>Ville :</strong> {devis.ville}</p>
      </div>
      
      <div className="bg-blue-50 p-4 my-4 rounded border border-blue-200">
        <p className="text-sm">Coût brut estimé (avec majoration étage) :</p>
        <p className="text-xl font-bold">{devis.cout_estime_brut} FCFA</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block font-semibold">🏷️ Remise (%)</label>
          <input 
            type="number" 
            value={remise} 
            onChange={(e) => setRemise(e.target.value)} 
            className="border p-2 w-full rounded" 
            placeholder="Ex: 10 pour -10%" 
          />
        </div>

        <div>
          <label className="block font-semibold">🚚 Frais de transport (FCFA)</label>
          <input 
            type="number" 
            value={transport} 
            onChange={(e) => setTransport(e.target.value)} 
            className="border p-2 w-full rounded" 
            placeholder="0" 
          />
        </div>

        <div>
          <label className="block font-semibold">🔧 Frais divers (étage / divers)</label>
          <input 
            type="number" 
            value={divers} 
            onChange={(e) => setDivers(e.target.value)} 
            className="border p-2 w-full rounded" 
            placeholder="0" 
          />
        </div>

        <button onClick={handleUpdate} className="bg-blue-600 text-white p-3 w-full rounded font-bold hover:bg-blue-700">
          🔁 Recalculer le total
        </button>
        
        {totalCalcule !== null && (
          <div className="bg-green-100 p-4 text-center text-2xl font-bold border-2 border-green-600 rounded">
            💰 Total final : {totalCalcule} FCFA
          </div>
        )}

        <button onClick={handleValidate} className="bg-green-700 text-white p-3 w-full rounded font-bold hover:bg-green-800 mt-2">
          ✅ Accepter & créer le chantier
        </button>
      </div>
    </div>
  );
}