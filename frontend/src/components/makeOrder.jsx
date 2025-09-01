import axios from "axios"
import { useEffect, useRef, useState } from "react"

export function MakeOrder({setBalance,balance,firstBalance,setFirstBalance,orders,setOrders,latestTrade}){

    
    const [trades,setTrades] = useState({})
    const [showOrderStatus,setShowOrderStatus] = useState(false)
    const [orderStatus,setOrderStatus] = useState({})
   
    

    const totalPNL = useRef(0)

    useEffect(()=>{
        if(!latestTrade) return;
        const data = JSON.parse(latestTrade)

        setTrades(prev=>{
            return {...prev,[data.symbol]:{price:data.price}}
        })

        if(!orders) return;

        // console.log(trades)
        
        orders.map((order)=>{
            if(trades[order.asset] && order.status == "open"){

                const startPrice = order.price*order.qty

                if(order.type=="buy")
                {
                    const currentPNL =  trades[order.asset]?.price*order.qty - startPrice
                    order.pnl = currentPNL
                    totalPNL.current += currentPNL
                }
                else{
                    const currentPNL =    startPrice - trades[order.asset]?.price*order.qty
                    order.pnl = currentPNL
                    totalPNL.current += currentPNL
                }
                
                

            }
        })
        
        setBalance(firstBalance+totalPNL.current)
        totalPNL.current =0
        // console.log(trades)
    },[latestTrade,orders])

    useEffect(()=>{
        axios.get('http://localhost:3000/balance',{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        }).then(res=>{
            setBalance(res.data.balance.USD);
            setFirstBalance(res.data.balance.USD)

            console.log("the first balace is ",balance)
        }).catch(err=>{
            console.error(err)
        })


        axios.get('http://localhost:3000/orders',{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        }).then(res=>{
           setOrders(res.data.orders)
           
        }).catch(err=>{
            console.error(err)
        })

        try{

            
            const eventSource = new EventSource(`http://localhost:3000/events/?jwt=${localStorage.getItem('token')}`)
            
            eventSource.onmessage = (event)=>{const data = JSON.parse(event.data)
                
            if(data.type=="ORDER_UPDATE"){
                // if(data.status == "liquidated"){

                    setOrders(orders=>orders.filter(order=>order && order.id !== data.orderId))
                    setOrderStatus({
                        asset: data.asset,
                        status:data.status,
                        pnl:data.pnl,
                    })
                    setShowOrderStatus(true)
                    setTimeout(()=>{
                        setShowOrderStatus(false)
                    },4000)
                // }
            }
            
            eventSource.onerror = (error) => {
                console.error("SSE error:", error);
                console.log("SSE readyState:", eventSource.readyState);
                
                
                if (eventSource.readyState === EventSource.CLOSED) {
                    console.log("SSE connection closed permanently");
                }
            };
        }
        }catch(err){
            console.error(err)
        }

    },[])


    const closeOrder = (id)=>{
        axios.post('http://localhost:3000/order/close',{
            id
        },{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        }).then(res=>{
           setOrders(orders=>orders.filter(order=>order && order.id !== id))
            console.log(res)
           
        }).catch(err=>{
            console.error(err)
        })
    }



    return <div className="h-[300px] w-full relative">
        <table className="table-auto">
        <thead>

        <tr className="" > <th className="px-4 py-2 font-medium text-sm text-white/50">Symbol</th> <th className="px-4 py-2 font-medium text-sm text-white/50">Type</th> <th className="px-4 py-2 font-medium text-sm text-white/50">qty</th> <th className="px-4 py-2 font-medium text-sm text-white/50">Open price</th> <th className="px-4 py-2 font-medium text-sm text-white/50">Current Price</th> <th className="px-4 py-2 font-medium text-sm text-white/50">P/L</th> <th className="px-4 py-2 font-medium text-sm text-white/50">Action</th></tr>
        </thead>
        <tbody>
        {
          orders &&  (orders.filter(order=>order && order.status === "open").map(order=>(
                <tr className="" key={order.id}>
                         <td className="px-4 py-2">{order.asset}</td> <td className="px-4 py-2">{order.type}</td> <td className="px-4 py-2">{order.qty.toFixed(2)}</td> <td className="px-4 py-2">{order.price}</td> <td className="px-4 py-2">{trades[order.asset]?.price}</td> <td className="px-4 py-2">{order.pnl.toFixed(2)}</td><td className="px-2 py-1"><button className="w-full h-full p-1 bg-white/30 rounded-md flex justify-center items-center cursor-pointer text-sm" onClick={()=>{closeOrder(order.id)}} >Close</button></td>
                    </tr>
            )))
        }
        </tbody>
        </table>
        {
            showOrderStatus&&
        (<div className="absolute bottom-25 w-full flex justify-center items-center">
            <OrderStatus orderStatus={orderStatus} />
        </div>)}
    </div>
}

function OrderStatus({orderStatus}){
    return <div className="h-16 w-[400px] bg-white/10 border border-white/50 rounded-md transition-all duration-300 ease-out flex items-center p-5">
        <h1>{`The Order for ${orderStatus.asset} is ${orderStatus.status} at ${orderStatus.pnl}`}</h1>
    </div>
}