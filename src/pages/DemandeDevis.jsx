import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function DemandeDevis() {
  const [form, setForm] = useState({ surface: '', ville: '', adresse: '', date_souhaitee: '' });
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [mesDevis, setMesDevis] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    setPhotos(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removePhoto = (idx) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const loadMesDevis = () => {
    api.get('/devis/mes-devis').then(({ data }) => setMesDevis(Array.isArray(data) ? data : [])).catch(() => {});
  };

  useEffect(() => {
    loadMesDevis();
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadPhotos = async () => {
    if (photos.length === 0) return [];
    const fd = new FormData();
    photos.forEach((f) => fd.append('files', f));
    const { data } = await api.post('/uploads', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return (data.files || []).map((f) => f.url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const photoUrls = await uploadPhotos();
      await api.post('/devis', { ...form, photos: photoUrls });
      setSubmitted(true);
      setPhotos([]);
      setPreviews([]);
      setForm({ surface: '', ville: '', adresse: '', date_souhaitee: '' });
      loadMesDevis();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l envoi. Reessayez.');
    }
    setLoading(false);
  };

  const downloadPDF = async (id) => {
    setPdfLoading(id);
    try {
      const { data } = await api.get('/devis/' + id + '/pdf', { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'devis-' + id + '.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Erreur lors du telechargement du PDF.');
    }
    setPdfLoading(null);
  };

  if (submitted) {
    return (
      <div className="p-4 text-center">
        <div className="bg-green-100 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-green-800">Devis envoy&eacute; !</h2>
          <p className="text-gray-600 mt-2">Notre &eacute;quipe vous contactera sous 48h</p>
          <button onClick={() => setSubmitted(false)} className="mt-4 bg-amber-700 text-white px-4 py-2 rounded">
            Nouvelle demande
          </button>
        </div>
      </div>
    );
  }

  const statutColors = {
    envoye: 'bg-blue-100 text-blue-800',
    en_cours: 'bg-amber-100 text-amber-800',
    valide: 'bg-green-100 text-green-800',
    refuse: 'bg-red-100 text-red-800'
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-4">Demande de devis</h1>
      {error && <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Surface (m&sup2;)</label>
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
          <label className="block font-semibold">Date souhait&eacute;e</label>
          <input type="date" name="date_souhaitee" value={form.date_souhaitee} onChange={handleChange} className="border p-2 w-full rounded" required />
        </div>
        <div>
          <label className="block font-semibold">Photos du chantier (optionnel, max 5)</label>
          <input type="file" accept="image/*" multiple onChange={handleFiles} className="border p-2 w-full rounded text-sm" />
          {previews.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {previews.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} alt="apercu" className="w-16 h-16 object-cover rounded border" />
                  <button type="button" onClick={() => removePhoto(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs leading-none">&times;</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button type="submit" className="bg-amber-700 text-white p-3 w-full rounded font-bold" disabled={loading}>
          {loading ? 'Envoi...' : 'Envoyer la demande'}
        </button>
        <p className="text-xs text-gray-500 text-center">* Un devis detaille vous sera envoye sous 48h</p>
      </form>

      {mesDevis.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold text-lg mb-3 text-gray-800">Mes devis</h2>
          <div className="space-y-2">
            {mesDevis.map((d) => (
              <div key={d.id} className="border rounded-xl p-3 flex items-center justify-between gap-2 bg-white">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">Devis #{d.id} - {d.ville}</p>
                  <p className="text-xs text-gray-500">
                    {d.surface} m&sup2;{d.total_final ? ' - ' + Number(d.total_final).toLocaleString('fr-FR') + ' FCFA' : ''}
                  </p>
                </div>
                <span className={'text-xs px-2 py-1 rounded-full ' + (statutColors[d.statut] || 'bg-gray-100 text-gray-700')}>
                  {d.statut}
                </span>
                <button
                  onClick={() => downloadPDF(d.id)}
                  disabled={pdfLoading === d.id}
                  className="bg-amber-700 text-white text-xs px-3 py-2 rounded-lg font-semibold disabled:opacity-50"
                >
                  {pdfLoading === d.id ? '...' : 'PDF'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
