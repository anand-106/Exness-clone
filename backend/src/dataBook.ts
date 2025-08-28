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

        if(orders){
            Object.entries(orders).forEach(([id,order])=>{
                if(order.type=="buy" && order.status=="open"){
                    order.pnl = LatestPrices[order.asset]!*order.qty - order.price*order.qty;
                    order.position = LatestPrices[order.asset]!*order.qty;
                    if(-(order.pnl)>= (.9*order.margin))
                    {
                        closeOrder(id,"liquidated")
                        console.log("order liquidated with id ", id)
                    }
                    else if(order.stopLoss && order.stopLoss >= order.position){
                        closeOrder(id,"closed")
                        console.log("order closed by stoploss with id ", id)
                    }
                    else if(order.takeProfit && order.position >= order.takeProfit) {
                        closeOrder(id,"closed")
                        console.log("order closed by takeProfit with id ", id)
                    }
                }
                else if(order.type=="sell" && order.status=="open"){
                    order.pnl = order.price*order.qty - LatestPrices[order.asset]!*order.qty
                    order.position = LatestPrices[order.asset]!*order.qty
                    if(-(order.pnl)>= (.9*order.margin))
                    {
                        closeOrder(id,"liquidated")
                        console.log("order liquidated with id ", id)
                    }
                    else if(order.stopLoss && order.position >= order.stopLoss ){
                        closeOrder(id,"closed")
                        console.log("order closed by stoploss with id ", id)
                    }
                    else if(order.takeProfit && order.position <= order.takeProfit) {
                        closeOrder(id,"closed")
                        console.log("order closed by takeProfit with id ", id)
                    }
                }
            })
        }
    }
})


interface User {
    password: string;
    balance:  { 
        USD: number; 
        equity:number;
        marginUsed:number;
        usableBalance:number; };
    
  }


  interface Order {
    username:string;
    type : "buy" | "sell";
    asset:string;
    price:number;
    qty:number;
    leverage:number;
    margin:number;
    position:number;
    stopLoss?:number;
    takeProfit?:number;
    status: "open" | "closed" | "liquidated";
    pnl?:number;
  }
  

const users: Record<string, User> = { anand: { password: '12345678', balance: { USD :5000 ,equity:5000,marginUsed:0 ,usableBalance:5000 }} };

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
            USD: 5000,
            equity:5000,
            marginUsed:0,
            usableBalance:5000, 
        },
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
    // console.log(users)
    res.json({balance: user.balance})
})

app.get('/orders',(req,res)=>{
    const username = (req as any).username
    
    const activeOrders = Object.entries(orders).filter(([id,order])=>order.username==username).map(([id,order])=>({id,...order}))

    res.json({orders:activeOrders})
})

app.post("/order/open", (req,res)=>{

    const {type,qty,asset,leverage,stopLoss,takeProfit } = req.body;

    const username  =  (req as any).username

    const user = users[username];
    if (!user) return res.status(404).json({ message: "User not found" });

   

    const price=LatestPrices[asset]
    const margin = price!*parseFloat(qty)/parseInt(leverage)

    if(margin>user.balance.usableBalance){
        return res.status(400).json({message: "insufficient funds"})
    }
    user.balance.usableBalance -= margin;

    user.balance.marginUsed += margin

    const id  = Date.now().toString()

    orders[id]= {
        username:username,
        type:type,
        asset:asset,
        price:price!,
        qty:qty,
        leverage:leverage,
        margin:margin,
        position:0,
        status:"open",
        pnl:0,
        takeProfit:takeProfit,
        stopLoss:stopLoss
    }
  
    res.json({ message: "Order opened", order: orders[id],balance:user.balance});

})

app.post('/order/close',(req,res)=>{
        const {id} = req.body

        const username  =  (req as any).username

        const user = users[username];
        if (!user) return res.status(404).json({ message: "User not found" });

        

        const order  = orders[id]

        

        let pnl = 0

        if(!order) {
            res.status(404).json({message:"order not found"})
            return
        }

        if(order.type=="buy"){
            pnl =(LatestPrices[order.asset]|| 0)*order.qty - order.price*order.qty 
       }
       else{
           pnl = order.price*order.qty - (LatestPrices[order.asset]|| 0)*order.qty
       }

       user.balance.USD += pnl

        user.balance.marginUsed -= order.margin

        user.balance.usableBalance = user.balance.USD - user.balance.marginUsed

        order.status = "closed"

        res.json({message:"order closed"})

})

app.listen(PORT,()=>{
    console.log(`User Server running on ${PORT}`)
})


function closeOrder(id:string,status:"open"|"closed"|"liquidated"){


const order  = orders[id]

        

        let pnl = 0

        if(!order) {
            
            return
        }

        const user  = users[order.username]

        if(!user) return

        if(order.type=="buy"){
            pnl =(LatestPrices[order.asset]|| 0)*order.qty - order.price*order.qty 
       }
       else{
           pnl = order.price*order.qty - (LatestPrices[order.asset]|| 0)*order.qty
       }

       user.balance.USD += pnl

        user.balance.marginUsed -= order.margin

        user.balance.usableBalance = user.balance.USD - user.balance.marginUsed

        order.status = status

}

