import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { queue } from '@/lib/store'; // <--- OJO AQUÍ

// Configuración para Vercel
export const maxDuration = 30;
export const dynamic = 'force-dynamic';

const responseSchema = z.object({
  explanation: z.string(),
  lua_code: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, userId } = body;
    const targetUser = userId || "default";

    // 1. Verificación básica
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error("Falta la API Key de Google en las variables de entorno");
    }

    // 2. Intentamos generar con la IA
    const result = await generateObject({
      model: google('gemini-1.5-flash') as any,
      schema: responseSchema,
      messages,
      system: `You are a Roblox Lua expert. Return valid code only.`,
    });

    const { object } = result;

    // 3. Intentamos guardar en la cola
    try {
      if (object.lua_code && object.lua_code !== 'none') {
        // Verificamos si la cola existe antes de usarla
        if (queue) {
            queue.add(targetUser, object.lua_code);
        } else {
            console.error("Error: El objeto 'queue' es undefined. Revisa la importación.");
        }
      }
    } catch (queueError) {
      console.error("Error guardando en cola:", queueError);
      // No detenemos el chat si falla la cola, solo avisamos
    }

    return result.toJsonResponse();

  } catch (error: any) {
    // AQUÍ ESTÁ LA CLAVE: Devolvemos el error al chat para que lo leas
    console.error("Error FATAL en chat:", error);
    
    return new Response(JSON.stringify({
      explanation: `❌ ERROR DEL SISTEMA: ${error.message}`,
      lua_code: "none"
    }), {
      status: 200, // Devolvemos 200 para que el frontend muestre el mensaje de error
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
