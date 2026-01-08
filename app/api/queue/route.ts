// app/api/queue/route.ts
import { NextResponse } from 'next/server';
import { queue } from '@/lib/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  // Buscamos si hay código para este usuario
  const pendingCode = queue.get(userId);

  return NextResponse.json({
    code: pendingCode || "none" // Si no hay nada, devolvemos "none"
  });
}
