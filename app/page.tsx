'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

export default function Chat() {
  const [userId, setUserId] = useState('default');

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    body: { userId: userId } // ¡ESTO ES LO QUE FALTABA!
  });

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white font-sans">
      <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
        <div className="flex items-center gap-2">
           <h1 className="text-xl font-bold text-yellow-400">★ MagicLua</h1>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 p-1 rounded border border-slate-700">
            <span className="text-xs text-slate-400 pl-2">ID:</span>
            <input 
                className="bg-slate-900 text-white text-xs p-1 w-24 text-center outline-none" 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)}
            />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => {
           let content = m.content;
           let code = null;
           try {
             if (m.role === 'assistant' && m.content.startsWith('{')) {
               const data = JSON.parse(m.content);
               content = data.explanation;
               code = data.lua_code;
             }
           } catch (e) {}

           return (
             <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] p-3 rounded-lg ${m.role === 'user' ? 'bg-blue-600' : 'bg-slate-800 border border-slate-700'}`}>
                 <p className="whitespace-pre-wrap text-sm">{content}</p>
                 {code && code !== 'none' && (
                   <div className="mt-2 bg-black p-2 rounded border border-slate-700">
                     <div className="text-[10px] text-green-500 mb-1">CÓDIGO ENVIADO AL PLUGIN:</div>
                     <pre className="text-xs text-green-300 font-mono overflow-x-auto">{code}</pre>
                   </div>
                 )}
               </div>
             </div>
           )
        })}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800 bg-slate-900 flex gap-2">
        <input
          className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-white"
          value={input}
          onChange={handleInputChange}
          placeholder="Escribe algo..."
        />
        <button type="submit" className="bg-yellow-500 text-black px-4 py-2 rounded font-bold">Enviar</button>
      </form>
    </div>
  );
}
