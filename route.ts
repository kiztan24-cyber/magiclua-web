import { NextResponse } from 'next/server';
import { queue } from '@/lib/store';

// Evita que Next.js cachee esta ruta (Importante para plugins)
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  const pendingCode = queue.get(userId);

  return NextResponse.json({
    code: pendingCode || "none"
  });
}
