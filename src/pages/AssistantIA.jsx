import React, { useState } from 'react';
import api from '../services/api';

export default function AssistantIA() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/assistant/chat', { message: input });
      const botMsg = { role: 'assistant', content: res.data.response };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Service indisponible. Contactez-nous par téléphone.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto flex flex-col h-[80vh]">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-4">🤖 Assistant IA</h1>
      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center">Posez votre question sur les panneaux Luxerboard</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-xl max-w-[80%] ${m.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-white border border-gray-200'}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="text-gray-400">🤔 Réflexion...</div>}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="border p-2 flex-1 rounded"
          placeholder="Ex: Quel panneau choisir ?"
        />
        <button onClick={sendMessage} className="bg-amber-700 text-white px-4 py-2 rounded font-bold" disabled={loading}>
          Envoyer
        </button>
      </div>
    </div>
  );
}