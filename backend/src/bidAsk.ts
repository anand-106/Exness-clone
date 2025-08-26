import { createClient } from "redis";
import { WebSocket } from "ws";


const redis = createClient({url:"redis://localhost:6379"})

const ws = new WebSocket("wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade/solusdt@trade")

ws.on("open",()=>{
    console.log("websocket Connected")
})

ws.on("close",()=>{
    console.log("Websocket Disconnected")
})

ws.on("message",(msg)=>{
    
})