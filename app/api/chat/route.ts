import { NextResponse } from 'next/server';

// --- TRUCO GLOBAL SEGURO ---
// Esto engaña a TypeScript para que nos deje usar una variable global
declare global {
  var myGlobalQueue: Record<string, string> | undefined;
}

// Inicializamos la cola si no existe
if (!globalThis.myGlobalQueue) {
  globalThis.myGlobalQueue = {};
}
// ---------------------------

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body.userId || "default";
    
    // 1. Código de prueba FIJO (Sin IA por ahora)
    const mockCode = `
      local p = Instance.new("Part")
      p.Name = "Cubo_Verde_" .. math.random(100)
      p.Color = Color3.new(0, 1, 0)
      p.Position = Vector3.new(0, 20, 0)
      p.Anchored = true
      p.Parent = workspace
      print("¡CONEXIÓN ESTABLECIDA!")
    `;

    // 2. Guardamos en la variable global
    if (globalThis.myGlobalQueue) {
        globalThis.myGlobalQueue[userId] = mockCode;
    }

    // 3. Respondemos al chat
    return NextResponse.json({
        explanation: "✅ Conectado. Enviando cubo verde...",
        lua_code: mockCode
    });

  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ 
        explanation: "Error: " + error.message, 
        lua_code: "none" 
    }, { status: 200 });
  }
}
