"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const ws_1 = require("ws");
async function sub() {
    const wss = new ws_1.WebSocketServer({ port: 8080 });
    wss.on("connection", () => {
        console.log("web socket connected");
    });
    console.log("WebSocket server running on ws://localhost:8080");
    const sub = (0, redis_1.createClient)({ url: "redis://localhost:6379" });
    await sub.connect();
    await sub.subscribe("trades", (message) => {
        console.log("Received from Redis:", message);
        wss.clients.forEach(client => {
            if (client.readyState === 1) {
                client.send(message);
            }
        });
    });
}
sub();
//# sourceMappingURL=server.js.map