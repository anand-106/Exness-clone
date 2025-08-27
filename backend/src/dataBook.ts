import express from 'express';
import cors from 'cors'
import {verifyJwt} from './jwt'
import {Redis} from 'ioredis'

import jwt from 'jsonwebtoken';
import { channel } from 'diagnostics_channel';

const app =express()
const PORT  =3000

const JWT_SECRET = "anand"

app.use(cors())
app.use(express.json())

const client = new Redis()

client.subscribe("trades",(err,count)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log("Subscribed to trades")
    }
})

const LatestPrices :Record <string,number>={}

client.on("message",(channel,message)=>{
    if(channel=="trades"){

        const trade = JSON.parse(message)
        LatestPrices[trade.symbol] = trade.price
    }
})


interface User {
    password: string;
    balance: Record<string, { qty: number; type?: string }>;
    equity:number;
    marginUsed:number;
  }


  interface Order {
    username:string;
    type : "buy" | "sell";
    asset:string;
    price:number;
    qty:number;
    leverage:number;
    margin:number;
    stopLoss?:number;
    takeProfit?:number;
    status: "open" | "closed" | "liquidated";
    pnl?:number;
  }
  

const users: Record<string, User> = { anand: { password: '12345678', balance: { USD: {qty:5000} },equity:5000,marginUsed:0 } };

const orders : Record<string,Order>={}

app.get('/',(req,res)=>{
    res.json({message:"hello world"})
})

app.post('/signup',async (req,res)=>{
    const {username , password } = req.body;

    if(users[username]){
        return res.status(400).json({message:"user already exists"})
    }

    users[username] = {
        password,
        balance: {
            USD: { qty: 5000.00 },
            
        },
        equity:5000,
        marginUsed:0 
    };

    res.json({message:"User Created Successfully"})
})

app.post('/signin',async (req,res)=>{
    const {username , password } = req.body;

    if(!users[username]){
        return res.status(400).json({message:"username not found"})
    }

    if(users[username].password !== password){
        return res.json({message:"password incorrect"})
    }

    const token = jwt.sign({username}, JWT_SECRET)
    
    res.json({token})
})

app.use(verifyJwt)

app.get('/balance',async (req,res)=>{
    const username = (req as any).username
    const user = users[username];
    
    if(!user) {
        return res.status(404).json({message: "User not found"});
    }
    console.log(users)
    res.json({balance: user.balance})
})

app.get('/orders',(req,res)=>{
    const username = (req as any).username
    
    const activeOrders = Object.entries(orders).filter(([id,order])=>order.username==username).map(([id,order])=>({id,...order}))

    res.json({orders:activeOrders})
})

app.post("/order/open",async (req,res)=>{

    const {type,qty,asset,leverage,stopLoss,takeProfit } = req.body;

    const username  =  (req as any).username

    const user = users[username];
    if (!user) return res.status(404).json({ message: "User not found" });

   

    const price=LatestPrices[asset]
    const margin = price!*parseFloat(qty)/parseInt(leverage)


  
    user.balance[asset] = { type, qty };

    const id  = Date.now().toString()

    orders[id]= {
        username:username,
        type:"buy",
        asset:asset,
        price:price!,
        qty:qty,
        leverage:leverage,
        margin:margin,
        status:"open"
    }
  
    res.json({ message: "Order opened", order: orders[id],balance:user.balance});

})

app.listen(PORT,()=>{
    console.log(`User Server running on ${PORT}`)
})


