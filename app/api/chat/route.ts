// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

// Estructura que forzamos a la IA a usar siempre
const responseSchema = z.object({
  explanation: z.string().describe("Explanation for the user in the web chat"),
  lua_code: z.string().describe("The functional Lua code for Roblox Studio"),
  action_type: z.enum(['create', 'modify', 'delete', 'none']).describe("Type of action"),
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await generateObject({
    model: google('gemini-1.5-flash'), // Modelo gratis y rápido
    schema: responseSchema,
    system: `You are MagicLua, an expert Roblox Luau Assistant.
    Your goal is to help the user build inside Roblox Studio.
    ALWAYS return valid Lua code compatible with Roblox.
    If the user asks for something complex, break it down.
    Do not use markdown blocks in the 'lua_code' field, just raw code.`,
    messages,
  });

  // Aquí es donde en el futuro guardaremos el 'lua_code' en una cola para el plugin
  // Por ahora, lo devolvemos al chat para probar.
  return result.toJsonResponse();
}
