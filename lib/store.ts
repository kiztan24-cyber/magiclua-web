// lib/store.ts
// Un almacén simple en memoria para guardar el código pendiente
// Clave: UserId, Valor: Código Lua

declare global { var commandQueue: any; }

globalThis.commandQueue = globalThis.commandQueue || {};

export const queue = {
  add: (userId: string, code: string) => {
    globalThis.commandQueue[userId] = code;
  },
  get: (userId: string) => {
    const code = globalThis.commandQueue[userId];
    // Una vez leído, lo borramos para no ejecutarlo 2 veces
    if (code) delete globalThis.commandQueue[userId];
    return code;
  }
};
