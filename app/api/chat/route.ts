import { NextResponse } from 'next/server';

import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { queue } from '@/lib/store'; // OJO: Si moviste lib a root usa @/lib/store
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
    const { userId, messages } = body;
    const targetUser = userId || "default";
    
    // Simulación de IA (Para probar conexión)
    const mockCode = `
      local p = Instance.new("Part")
      p.Name = "MagicPart_" .. math.random(100)
      p.Color = Color3.new(1, 0, 0)
      p.Position = Vector3.new(0, 10, 0)
      p.Parent = workspace
      print("¡MagicLua funciona!")
    `;

    // Guardar en cola
    if (queue) {
        queue.add(targetUser, mockCode);
    } else {
        throw new Error("Queue no está definida");
    }

    // Responder al chat simulando ser la IA
    return NextResponse.json({
        explanation: "¡Conexión de prueba exitosa! He creado una parte roja.",
        lua_code: mockCode
    });

  } catch (error: any) {
    return NextResponse.json({
        explanation: "Error en servidor: " + error.message,
        lua_code: "none"
    }, { status: 500 });
  }
}
