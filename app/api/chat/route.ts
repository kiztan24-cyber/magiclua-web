// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { queue } from '@/lib/store'; // <--- Importamos el almacén

// app/api/chat/route.ts
export const maxDuration = 30; // Permitir hasta 30 segundos de ejecución


// Definimos el esquema de respuesta
const responseSchema = z.object({
  explanation: z.string().describe("Explanation for the user in the web chat"),
  lua_code: z.string().describe("The functional Lua code for Roblox Studio"),
  action_type: z.enum(['create', 'modify', 'delete', 'none']).describe("Type of action"),
});

export async function POST(req: Request) {
  const { messages, userId } = await req.json(); // <--- Ahora esperamos recibir el userId del chat

  // Usamos un ID por defecto si no viene ninguno (para pruebas)
  const targetUser = userId || "default";

  const result = await generateObject({
    model: google('gemini-1.5-flash') as any,
    schema: responseSchema,
    system: `You are MagicLua, an expert Roblox Luau Assistant.
    Your goal is to help the user build inside Roblox Studio.
    ALWAYS return valid Lua code compatible with Roblox.
    If the user asks for something complex, break it down.
    IMPORTANT: Do not use markdown blocks in the 'lua_code' field. Just raw code.`,
    messages,
  });

  const { object } = result;

  // Si la IA generó código, lo guardamos en el buzón para el plugin
  if (object.lua_code && object.lua_code !== 'none') {
    queue.add(targetUser, object.lua_code);
  }

  // Devolvemos la respuesta al chat para que el usuario la lea
  return result.toJsonResponse();
}
