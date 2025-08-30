import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useWsStore } from "../utils/wsstore"

export function MakeOrder({setBalance,balance,firstBalance,setFirstBalance,orders,setOrders}){

    const latestTrade = useWsStore((state)=>state.latestTrade)
    const [trades,setTrades] = useState({})
   
    

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



    return <div className="h-[300px] w-full " >
        <table className="table-auto">
        <thead>

        <tr className="" > <th className="px-4 py-2 font-medium text-sm text-white/50">Symbol</th> <th className="px-4 py-2 font-medium text-sm text-white/50">Type</th> <th className="px-4 py-2 font-medium text-sm text-white/50">qty</th> <th className="px-4 py-2 font-medium text-sm text-white/50">Open price</th> <th className="px-4 py-2 font-medium text-sm text-white/50">Current Price</th> <th className="px-4 py-2 font-medium text-sm text-white/50">P/L</th> <th className="px-4 py-2 font-medium text-sm text-white/50">Action</th></tr>
        </thead>
        <tbody>
        {
          orders &&  (orders.filter(order=>order && order.status === "open").map(order=>(
                <tr className="" key={order.id}>
                         <td className="px-4 py-2">{order.asset}</td> <td className="px-4 py-2">{order.type}</td> <td className="px-4 py-2">{order.qty}</td> <td className="px-4 py-2">{order.price}</td> <td className="px-4 py-2">{trades[order.asset]?.price}</td> <td className="px-4 py-2">{order.pnl.toFixed(2)}</td><td className="px-2 py-1"><button className="w-full h-full p-1 bg-white/30 rounded-md flex justify-center items-center cursor-pointer text-sm" onClick={()=>{closeOrder(order.id)}} >Close</button></td>
                    </tr>
            )))
        }
        </tbody>
        </table>
    </div>
}