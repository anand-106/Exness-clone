import { orders,users,userSSEConnections,LatestPrices } from "../server"

 
export function closeOrder(id:string,status:"open"|"closed"|"liquidated"){


    const order  = orders[id]
    
            
    
            let pnl = 0
    
            if(!order) {
                
                return
            }
    
            const user  = users[order.userId]
    
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
    
            const sse = userSSEConnections[order.userId]
    
            if(sse){
                const orderUpdate = {
                    type:"ORDER_UPDATE",
                    asset:order.asset,
                    orderId: id,
                    status:status,
                    pnl:pnl
                }
    
                sse.write(`data: ${JSON.stringify(orderUpdate)}\n\n`)
                console.log(`Sent SSE to user ${order.userId}:`, orderUpdate);
            }
    
    }
    
    