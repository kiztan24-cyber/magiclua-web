// app/page.tsx
'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const [apiKey, setApiKey] = useState('');

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      <header className="p-4 border-b border-slate-800 flex justify-between items-center">
        <h1 className="text-xl font-bold text-yellow-400">★ MagicLua Brain</h1>
        <div className="text-xs text-slate-500">Status: {isLoading ? 'Thinking...' : 'Ready'}</div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => {
           // Intentamos parsear si la respuesta es JSON (de la IA) o texto normal (del usuario)
           let content = m.content;
           let code = null;
           try {
             if (m.role === 'assistant') {
               const data = JSON.parse(m.content);
               content = data.explanation;
               code = data.lua_code;
             }
           } catch (e) {}

           return (
             <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[80%] p-3 rounded-lg ${m.role === 'user' ? 'bg-blue-600' : 'bg-slate-800'}`}>
                 <p>{content}</p>
                 {code && code !== 'none' && (
                   <div className="mt-2 p-2 bg-black rounded border border-slate-700 font-mono text-xs text-green-400 overflow-x-auto">
                     {code}
                   </div>
                 )}
               </div>
             </div>
           )
        })}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800 flex gap-2">
        <input
          className="flex-1 bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-yellow-500"
          value={input}
          onChange={handleInputChange}
          placeholder="Ej: Crea una parte roja que gire..."
        />
        <button type="submit" className="bg-yellow-500 text-black px-4 py-2 rounded font-bold hover:bg-yellow-400">
          Enviar
        </button>
      </form>
    </div>
  );
}
