import { NextResponse } from 'next/server';
import { queue } from '@/lib/store'; // Asegúrate de que lib/store.ts existe en la raíz

// Misma definición global
declare global {
  var _internalQueue: Record<string, string> | undefined;
}
globalThis._internalQueue = globalThis._internalQueue || {};


// Evita que Next.js cachee esta ruta (Importante para que el plugin lea en tiempo real)
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) return Response.json({ error: 'No ID' });

  // Leemos directo de la variable global
  const pendingCode = globalThis._internalQueue[userId];
  
  // Limpiamos después de leer
  if (pendingCode) {
      delete globalThis._internalQueue[userId];
  }

  return Response.json({
    code: pendingCode || "none"
  });
}
