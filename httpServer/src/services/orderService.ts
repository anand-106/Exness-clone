import { Order } from "../models/models";
import { orderQueue } from "../utils/redis";

export async function openOrderQ(order:Order,id:string,email:string){

    await orderQueue.add('ORDER_OPENED',{
        email:email,
        orderId : id,
        userId : order.userId,
        asset : order.asset,
        openPrice : order.price,
        type : order.type,
        qty : order.qty,
        leverage  : order.leverage
    })

}

export async function closeOrderQ(order:Order,id:string,email:string){

    await orderQueue.add('ORDER_CLOSED',{
        email:email,
        orderId : id,
        userId : order.userId,
        asset : order.asset,
        openPrice : order.price,
        closePrice: order.position,
        type : order.type,
        qty : order.qty,
        pnl : order.pnl,
        leverage : order.leverage
    })

}

export async function liquidateOrderQ(order:Order,id:string,email:string){

    await orderQueue.add('ORDER_LIQUIDATED',{
        email:email,
        orderId : id,
        userId : order.userId,
        asset : order.asset,
        openPrice : order.price,
        closePrice: order.position,
        type : order.type,
        qty : order.qty,
        pnl : order.pnl,
        leverage : order.leverage
    })

}