import express from 'express';
import { Pool } from "pg";
import cors from 'cors'

const pool = new Pool(
    {
        user: "postgres",
        host: "localhost",
        database: "postgres",
        password: "password",
        port: 5433, 
    }
)

const app = express();
app.use(express.json())
app.use(cors())
const port = 4000;

app.get('/',(req,res)=>{
    res.send("hello world")
})

app.get('/candles',async (req,res)=>{
    try{
        console.log("handle hitted")
        const symbol = "SOLUSDT";
        const interval = 'trades_1m'
        const limit = 100
        
        
        const query = `SELECT timestamp , symbol ,open_price,close_price,high_price,low_price from ${interval} where symbol = '${symbol}' ORDER BY timestamp DESC LIMIT ${limit}`
        
        const result = await pool.query(query)
    const candles = result.rows.map((row)=>({
        time: Math.floor(new Date(row.timestamp).getTime() / 1000),
        open: parseFloat(row.open_price),
        high: parseFloat(row.high_price),
        low: parseFloat(row.low_price),
        close: parseFloat(row.close_price),
       
    })).reverse()
        
        res.json(candles)
    }
    catch(err){
        console.log(err)
    }

})

app.listen(port, () => {
    console.log(`Candle API running at http://localhost:${port}`);
  });