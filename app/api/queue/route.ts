import { NextResponse } from 'next/server';
import { queue } from '@/lib/store'; // Asegúrate de que lib/store.ts existe en la raíz

// Evita que Next.js cachee esta ruta (Importante para que el plugin lea en tiempo real)
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  // Obtenemos el código pendiente para este usuario
  const pendingCode = queue.get(userId);

  return NextResponse.json({
    code: pendingCode || "none"
  });
}
