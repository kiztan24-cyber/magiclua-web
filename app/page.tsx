'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

export default function Chat() {
  // Estado para el ID de sesión (por defecto 'default')
  const [userId, setUserId] = useState('default');

  // Pasamos el userId en el body de CADA petición
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    body: {
      userId: userId
    }
  });

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white font-sans">
      {/* Header con Configuración */}
      <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 shadow-md">
        <div className="flex items-center gap-3">
           <h1 className="text-xl font-bold text-yellow-400 tracking-tight">★ MagicLua</h1>
           <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded tracking-wider">Brain v2.0</span>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 font-medium pl-2">SESSION ID:</span>
            <input 
                className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white w-28 focus:border-yellow-500 outline-none font-mono text-center"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="default"
            />
            <div className={`w-2.5 h-2.5 rounded-full mx-1 ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`} title={isLoading ? "Thinking..." : "Ready"} />
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-600">
                <p className="text-sm">Conecta tu plugin de Roblox Studio usando este ID:</p>
                <code className="bg-slate-900 border border-slate-700 px-4 py-2 rounded text-yellow-500 text-xl mt-3 font-mono cursor-pointer hover:bg-slate-800 transition-colors">{userId}</code>
            </div>
        )}
        
        {messages.map(m => {
           // Intentar renderizar bonito si es JSON
           let content = m.content;
           let code = null;
           let isError = false;

           try {
             // Si el asistente manda JSON
             if (m.role === 'assistant' && m.content.trim().startsWith('{')) {
               const data = JSON.parse(m.content);
               content = data.explanation || "Procesando...";
               code = data.lua_code;
               if(content.includes("ERROR")) isError = true;
             }
           } catch (e) {
               // Si falla el parse, es texto normal
           }

           return (
             <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] p-4 rounded-xl shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'}`}>
                 <div className={`whitespace-pre-wrap text-sm leading-relaxed ${isError ? 'text-red-400 font-bold' : ''}`}>{content}</div>
                 
                 {code && code !== 'none' && (
                   <div className="mt-4 bg-black rounded-lg border border-slate-700 overflow-hidden shadow-inner">
                     <div className="bg-slate-900 px-3 py-1.5 text-[10px] text-slate-500 border-b border-slate-800 flex justify-between items-center font-mono uppercase tracking-wider">
                        <span>Lua Script</span>
                        <span className="text-green-500 flex items-center gap-1">
                          Sent to Plugin <span className="text-xs">✓</span>
                        </span>
                     </div>
                     <pre className="p-3 font-mono text-xs text-green-400 overflow-x-auto custom-scrollbar">
                       {code}
                     </pre>
                   </div>
                 )}
               </div>
             </div>
           )
        })}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800 bg-slate-900 flex gap-3 shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
        <input
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-slate-600 text-sm"
          value={input}
          onChange={handleInputChange}
          placeholder="Escribe tu comando mágico aquí..."
        />
        <button 
            type="submit" 
            disabled={isLoading}
            className="bg-yellow-500 text-black px-6 py-2 rounded-xl font-bold hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-yellow-500/20"
        >
          {isLoading ? '...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}
