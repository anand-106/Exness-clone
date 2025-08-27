import express from 'express';
import { WebSocket } from 'ws';
import { createClient } from 'redis';
import { Pool } from 'pg';



const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "password",
    port: 5433,
  });


  export interface Trade {
    symbol: string;
    price: number;     
    trade_time: Date;
  }


async function main(){
    
    const redis = createClient({url:"redis://localhost:6379"})
    await redis.connect();
    const ws = new WebSocket("wss://stream.binance.com:9443/stream?streams=solusdt@trade/ethusdt@trade/btcusdt@trade")

    let tradeBuffer:Trade[] = []

    async function insertTrades() {
        if (tradeBuffer.length === 0) return;
        
        try {
            
            const tradesToInsert = [...tradeBuffer];
            tradeBuffer.length = 0;
            
            
            const query = `
                INSERT INTO trades (symbol, price, trade_time) 
                VALUES ${tradesToInsert.map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(', ')}
            `;
            
           
            const values = tradesToInsert.flatMap(trade => [trade.symbol, trade.price, trade.trade_time]);
            
           
            await pool.query(query, values);
            
            console.log(`Successfully inserted ${tradesToInsert.length} trades`);
        } catch (error) {
            console.error('Error inserting trades:', error);
            
        }
    }
    
    ws.on("message",async (msg)=>{
        const data = JSON.parse(msg.toString())

        const trade =  {
            symbol:data.data.s,
            price:data.data.p,
            trade_time: new Date(data.data.T),
        }
        const price = parseFloat(data.data.p)

        const redisData = {
            symbol:data.data.s,
            price: price ,
            askPrice:Math.round(((.005*price)+price)*100)/100,
            bidPrice: Math.round(price * 100) / 100,
            trade_time: new Date(data.data.T),
        }

        await redis.publish('trades',JSON.stringify(redisData))

        tradeBuffer.push(trade)

        
        if (tradeBuffer.length >= 100) {
            await insertTrades();
        }

        console.log(data)
        
    })

    ws.on("open", () => console.log("Connected to Binance WS"));
    ws.on("close", () => console.log("Binance WS closed"));

    
    setInterval(async () => {
        if (tradeBuffer.length > 0) {
            await insertTrades();
        }
    }, 5000);
}

main();