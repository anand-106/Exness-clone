import express from 'express';
import cors from 'cors'
import {verifyJwt} from './jwt'
import { v4 as uuidv4 } from 'uuid';
import {Order,User} from './models/models'
import jwt from 'jsonwebtoken';
import { client } from './utils/redis'
import { pool } from './utils/psql';
import { closeOrder } from './services/closeOrder';
import { openOrderQ,closeOrderQ,liquidateOrderQ } from './services/orderService';
import './services/notificationWorker';



const app =express()
app.use(cors())
app.use(express.json())

const JWT_SECRET = "anand"
const PORT  =3000

export const LatestPrices :Record <string,number>={}
export const users: Record<string, User> = { 123456789: {username : "anandkvlm2003@gmail.com", password: '12345678', balance: { USD :5000 ,equity:5000,marginUsed:0 ,usableBalance:5000 }} };
export const orders : Record<string,Order>={}


client.subscribe("trades",(err,count)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log("Subscribed to trades")
    }
})


client.on("message",(channel,message)=>{
    if(channel=="trades"){

        const trade = JSON.parse(message)
        LatestPrices[trade.symbol] = trade.price

        if(orders){
            Object.entries(orders).forEach(async ([id,order])=>{
                if(order.type=="buy" && order.status=="open"){
                    order.pnl = LatestPrices[order.asset]!*order.qty - order.price*order.qty;
                    order.position = LatestPrices[order.asset]!*order.qty;
                    if(-(order.pnl)>= (.9*order.margin))
                    {
                        closeOrder(id,"liquidated")
                        await liquidateOrderQ(order,id,users[order.userId]!.username)
                        console.log("order liquidated with id ", id)
                    }
                    else if(order.stopLoss && order.stopLoss >= order.position){
                        closeOrder(id,"closed")
                        await closeOrderQ(order,id,users[id]!.username)
                        console.log("order closed by stoploss with id ", id)
                    }
                    else if(order.takeProfit && order.position >= order.takeProfit) {
                        closeOrder(id,"closed")
                        await closeOrderQ(order,id,users[id]!.username)
                        console.log("order closed by takeProfit with id ", id)
                    }
                }
                else if(order.type=="sell" && order.status=="open"){
                    order.pnl = order.price*order.qty - LatestPrices[order.asset]!*order.qty
                    order.position = LatestPrices[order.asset]!*order.qty
                    if(-(order.pnl)>= (.9*order.margin))
                    {
                        closeOrder(id,"liquidated")
                        await liquidateOrderQ(order,id,users[id]!.username)
                        console.log("order liquidated with id ", id)
                    }
                    else if(order.stopLoss && order.position >= order.stopLoss ){
                        closeOrder(id,"closed")
                        await closeOrderQ(order,id,users[id]!.username)
                        console.log("order closed by stoploss with id ", id)
                    }
                    else if(order.takeProfit && order.position <= order.takeProfit) {
                        closeOrder(id,"closed")
                        await closeOrderQ(order,id,users[id]!.username)
                        console.log("order closed by takeProfit with id ", id)
                    }
                }
            })
        }
    }
})

  



app.get('/',(req,res)=>{
    res.json({message:"hello world"})
})

app.post('/api/v1/user/signup',async (req,res)=>{
    const {username , password } = req.body;

    if(users[username]){
        return res.status(403).json({message:"Error while signing up"})
    }

    const id = uuidv4()

    users[id] = {
        username:username,
        password,
        balance: {
            USD: 5000,
            equity:5000,
            marginUsed:0,
            usableBalance:5000, 
        },
    };

    res.json({userId: id})
})

app.post('/api/v1/user/signin',async (req,res)=>{
    const {username , password } = req.body;

    const user  = Object.entries(users).filter(([userId,user])=>user.username == username)[0]

    if(!user){
        return res.status(403).json({message: "Incorrect credentials"})
    }

    const userId = user[0]

    console.log(userId)

    const token = jwt.sign({userId}, JWT_SECRET)
    
    res.json({token})
})

export const userSSEConnections :Record<string,any> = {}

app.get('/events',(req,res)=>{
    const jwtToken = req.query.jwt as string

    let userId:string;
    
    // Verify JWT from query parameter
    if (jwtToken) {
        try {
            const payload = jwt.verify(jwtToken, JWT_SECRET) as any;
            if (!payload.userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            userId = payload.userId
        } catch (err) {
            return res.status(401).json({ error: "Invalid token" });
        }
    } else {
        return res.status(401).json({ error: "No token provided" });
    }

    res.writeHead(200,{
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache", 
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
    })

    

    userSSEConnections[userId] = res

    res.write(`data: ${JSON.stringify({type:"CONNECTED",userId})}\n\n`)
    console.log(`User ${userId} connected to SSE`);

    res.on("close",()=>{
        delete userSSEConnections[userId]
        console.log(`User ${userId} disconnected from SSE`);
    })
})

app.get('/candles',async (req,res)=>{
    try{
        console.log("handle hitted")
        const symbol = req.query.symbol as string;
        const interval = req.query.interval as string
        const limit = parseInt(req.query.limit as string)
        
        
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

app.use(verifyJwt)

app.get('/balance',async (req,res)=>{
    const userId = (req as any).userId
   
    const user = users[userId];
    
    if(!user) {
        return res.status(404).json({message: "User not found"});
    }
    // console.log(users)
    res.json({balance: user.balance})
})

app.get('/orders',(req,res)=>{
    const userId = (req as any).userId
    
    const activeOrders = Object.entries(orders).filter(([id,order])=>order.userId==userId).map(([id,order])=>({id,...order}))

    res.json({orders:activeOrders})
})

app.post("/order/open", (req,res)=>{

    try{

        
        const {type,margin,asset,leverage,stopLoss,takeProfit } = req.body;
        
        const userId  =  (req as any).userId
        
        const user = users[userId];
        if (!user) return res.status(404).json({ message: "User not found" });
        
        
        
        const price=LatestPrices[asset]
        const qty = (parseInt(leverage)*parseFloat(margin))/price!
        
        if(margin>user.balance.usableBalance){
            return res.status(400).json({message: "insufficient funds"})
        }
        user.balance.usableBalance -= margin;
        
        user.balance.marginUsed += margin
        
        const id  = Date.now().toString()
        
        orders[id]= {
            userId:userId,
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
    }catch(err){
        res.status(500).json({error:err})
    }

})

app.post('/order/close',(req,res)=>{
        const {id} = req.body

        const userId  =  (req as any).userId

        const user = users[userId];
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


