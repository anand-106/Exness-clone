import { createClient } from "redis";
import { WebSocketServer } from "ws";

async function sub() {

    const wss = new WebSocketServer({port:8080})

    wss.on("connection",()=>{
        console.log("web socket connected")
    })

    console.log("WebSocket server running on ws://localhost:8080");

  const sub = createClient({ url: "redis://localhost:6379" });
  await sub.connect();

  await sub.subscribe("trades", (message:string) => {
    console.log("Received from Redis:", message);

    wss.clients.forEach(client=>{
        if(client.readyState === 1){
            client.send(message)
        }
    })
  });
}

sub();
