import { WebSocket, isWebSocketCloseEvent } from 'https://deno.land/std/ws/mod.ts';
import { v4 } from 'https://deno.land/std/uuid/mod.ts';

let connectedClients = new Map<string, WebSocket>();
// @ts-ignore
const chatConnection = async (ws: WebSocket) => {
    console.log('Socket connected');

    // Add to clients
    const uid = v4.generate();
    connectedClients.set(uid, ws);

    for await (const wsEvent of ws) {
        if (isWebSocketCloseEvent(wsEvent)) {
            connectedClients.delete(uid)
        }

        if (typeof wsEvent === "string") {
            let ev = JSON.parse(wsEvent);
            broadcastEvent(ev);
        }
    }
}

interface Broadcast {
    name: string,
    msg: string
}

const broadcastEvent = (event: Broadcast) => {
    connectedClients.forEach((ws: WebSocket) => {
        ws.send(JSON.stringify(event))
    })
}

export { chatConnection };
