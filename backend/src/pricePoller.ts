import { Redis} from 'ioredis'
import { Pool } from 'pg'
import { WebSocket } from 'ws'

const pool = new Pool({
    host:'localhost',
    database:'postgres',
    password:'password',
    user:'postgres',
    port:5433
})


const redis  = new Redis("redis://localhost:6379")

redis.on("connect",()=>{
    console.log("connected to redis")
})

redis.on("error",()=>{
    console.log("Error connection to redis")
})

const ws =  new WebSocket("wss://stream.binance.com:9443/stream?streams=solusdt@trade/ethusdt@trade/btcusdt@trade")


ws.on("open",()=>{
    console.log("connected to binance websocket")
})

ws.on("error",()=>{
    console.log("error connecting to binance websocket")
    ws.close()
})

 interface Trade {
    price: number;
    asset : string;
    time: Date;
}



ws.on("message",async (event)=>{
    const data = JSON.parse(event.toString())

    console.log(data.data)
})