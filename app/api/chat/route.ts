// app/api/chat/route.ts

// 1. Definimos la cola AQUÍ MISMO (Truco sucio pero efectivo)
// Usamos globalThis para que sobreviva entre llamadas en caliente
declare global {
  var _internalQueue: Record<string, string> | undefined;
}
globalThis._internalQueue = globalThis._internalQueue || {};

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;
    const targetUser = userId || "default";
    
    const mockCode = `
      local p = Instance.new("Part")
      p.Name = "DirectPart"
      p.Color = Color3.new(0, 0, 1) -- Azul
      p.Position = Vector3.new(0, 15, 0)
      p.Parent = workspace
    `;

    // 2. Guardamos DIRECTAMENTE en la variable global
    globalThis._internalQueue[targetUser] = mockCode;

    return Response.json({
        explanation: "✅ Guardado en memoria interna (Sin importaciones).",
        lua_code: mockCode
    });

  } catch (error: any) {
    return Response.json({
        explanation: "❌ ERROR: " + error.message,
        lua_code: "none"
    }, { status: 200 });
  }
}
