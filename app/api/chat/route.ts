// app/api/chat/route.ts
import { queue } from '@/lib/store'; 
// IMPORTANTE: Si te da error en la línea de arriba, cámbiala a:
// import { queue } from '@/app/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;
    const targetUser = userId || "default";
    
    // Código de prueba fijo
    const mockCode = `
      local p = Instance.new("Part")
      p.Name = "CuboMagico_" .. math.random(1000)
      p.Color = Color3.new(0, 1, 0) -- Verde
      p.Position = Vector3.new(0, 20, 0)
      p.Anchored = true
      p.Parent = workspace
      print("¡FUNCIONA! Conexión Web -> Roblox Exitosa")
    `;

    // Intentamos guardar en la cola
    if (queue) {
        queue.add(targetUser, mockCode);
        console.log("Código guardado para:", targetUser);
    } else {
        throw new Error("La base de datos (queue) no se encontró.");
    }

    return Response.json({
        explanation: "✅ CONEXIÓN EXITOSA. He enviado un cubo verde a Roblox.",
        lua_code: mockCode
    });

  } catch (error: any) {
    console.error("Error en chat:", error);
    return Response.json({
        explanation: "❌ ERROR: " + error.message,
        lua_code: "none"
    }, { status: 200 }); // Devolvemos 200 para ver el error en pantalla
  }
}
