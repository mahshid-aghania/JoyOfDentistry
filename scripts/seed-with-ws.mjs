// Wrapper: polyfill global WebSocket (Node 20 lacks it) then run the seed.
// supabase-js initializes a realtime client that needs WebSocket at construct
// time. Local Node is 20; production (Vercel) runs 24 and is unaffected.
import ws from "ws";
if (!globalThis.WebSocket) globalThis.WebSocket = ws;
await import("./seed.mjs");
