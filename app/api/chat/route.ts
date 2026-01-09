export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  return new Response("¡ESTOY VIVO!", {
    status: 200,
  });
}
