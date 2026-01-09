import { NextResponse } from 'next/server';

// --- MISMA DEFINICIÓN GLOBAL ---
declare global {
  var myGlobalQueue: Record<string, string> | undefined;
}
if (!globalThis.myGlobalQueue) {
  globalThis.myGlobalQueue = {};
}
// -------------------------------

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
      return NextResponse.json({ error: 'No ID' });
  }

  // 1. Leemos de la variable global
  const pendingCode = globalThis.myGlobalQueue?.[userId];
  
  // 2. Borramos para no repetir
  if (pendingCode && globalThis.myGlobalQueue) {
      delete globalThis.myGlobalQueue[userId];
  }

  return NextResponse.json({
    code: pendingCode || "none"
  });
}
