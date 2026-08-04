import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Catalogue() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('');
  const [langue, setLangue] = useState('fr');
  const categories = ['Tous', 'Plafonds', 'Cloisons', 'Façades', 'Bardage', 'Sols', 'Accessoires'];

  useEffect(() => {
    const fetchProducts = async () => {
      const url = filter && filter !== 'Tous' ? `/products?categorie=${filter}&langue=${langue}` : `/products?langue=${langue}`;
      const res = await api.get(url);
      setProducts(res.data);
    };
    fetchProducts();
  }, [filter, langue]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-serif font-bold text-amber-900">Catalogue</h1>
        <button onClick={() => setLangue(langue === 'fr' ? 'en' : 'fr')} className="bg-amber-600 text-white px-3 py-1 rounded">
          {langue === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-full whitespace-nowrap ${filter === cat ? 'bg-amber-700 text-white' : 'bg-gray-200'}`}>
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-xl shadow border border-gray-100">
            <h3 className="font-bold text-lg">{p.nom}</h3>
            <p className="text-sm text-gray-600">Épaisseur: {p.epaisseur} | {p.categorie}</p>
            <p className="text-sm text-gray-600">{p.application}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-lg font-bold text-amber-800">{p.prix_ttc} FCFA</span>
              <span className={`text-sm px-3 py-1 rounded-full ${p.statut_stock === 'En stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {p.statut_stock}
              </span>
            </div>
            <p className="text-xs text-gray-500">Poids: {p.poids_unite}kg | Conteneur: {p.qte_conteneur} unités</p>
          </div>
        ))}
      </div>
    </div>
  );
}