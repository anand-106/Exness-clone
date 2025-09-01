import { AskBid } from "./components/askBid"
import CandleChart from "./components/candleChart"
import { MakeOrder } from "./components/makeOrder"

import ExnessLogo from './assets/exness_logo.png'

import { LOGOS } from "./components/logos"
import { useEffect, useRef, useState } from "react"
import { SellAndBuy } from "./components/buyAndSell"


export function Home(){

  const [latestTrade,setLatestTarde] = useState(null)
  const totalPNL = useRef(0)


  useEffect(()=>{
    if(!latestTrade) return;
    const data = JSON.parse(latestTrade)
    const price = parseFloat(data.price);
      const askPrice = parseFloat(data.askPrice);
      const bidPrice = parseFloat(data.bidPrice);
      const symbol = data.symbol
      const time = data.trade_time


    setTrades(prev=>{

      const prevTrade = prev[symbol] || { prevPrice: 0, bid: 0, ask: 0, bidColor: "", askColor: "" };

        let bidColor = "";
        let askColor = "";

        if(price>prevTrade.prevPrice)
        {
            bidColor="bg-green-500 text-black";
            askColor = "bg-green-500 text-black";
        }
        else if(price==prevTrade.prevPrice){
          bidColor="";
            askColor = "";
        }
        else{
            bidColor="bg-red-500";
            askColor = "bg-red-500";
        }

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

        return {
          ...prev,
          [symbol]:{prevPrice:price,price:price,bidPrice:bidPrice,askPrice:askPrice,bidColor:bidColor,askColor:askColor,time:time}
      };
    })

    
    
    
},[latestTrade])



  const [selectedAsset,setSelectedAsset] = useState("SOLUSDT")
  const [balance, setBalance] = useState(0)
    const [firstBalance,setFirstBalance] = useState(0)
    const [orders,setOrders] = useState(null)
    const [trades,setTrades] = useState({})
    const [stopLoss,setStopLoss] = useState(null)
    const [takeProfit,setTakeProfit] = useState(null)

    

        useEffect(()=>{

          const ws = new WebSocket("ws://localhost:8080")

          ws.onopen = ()=>{
            console.log("websocket connected")
        }

        ws.onclose = ()=>{
            console.log("websocket disconnected")
        }

        ws.onmessage= (event) =>{
            const msg = event.data
            setLatestTarde(msg)
        }

        ws.onerror = (err)=>{
          if(ws){
            ws.close()
            console.log(err)
          }
        }


        },[])
    

    return (
        <div className=" w-full h-screen bg-[#141d22] text-white overflow-hidden">
          <div className="flex h-18 items-center px-2 ">
          <div className="w-[200px]">

          < img src={ExnessLogo} alt="exness logo"/>
          </div>
          <div className={`flex items-center justify-center gap-2 w-36 h-full cursor-pointer mr-10 hover:border-b-[6px] hover:mb-[-6px] ${selectedAsset=="SOLUSDT"?"border-b-[6px]":""}`}
          onClick={()=>{setSelectedAsset("SOLUSDT")}}
          >
            <img src={LOGOS["SOLUSDT"]} className="w-9" />
            <h1 className="text-xl">SOL</h1>
          </div>
          <div className={`flex items-center justify-center gap-2 w-36 h-full cursor-pointer mr-10 hover:border-b-[6px] hover:mb-[-6px] ${selectedAsset=="BTCUSDT"?"border-b-[6px]":""}`}
          onClick={()=>{setSelectedAsset("BTCUSDT")}}
          >
            <img src={LOGOS["BTCUSDT"]} className="w-9" />
            <h1 className="text-xl">BTC</h1>
          </div>
          <div className={`flex items-center justify-center gap-2 w-36 h-full cursor-pointer mr-10 hover:border-b-[6px] hover:mb-[-6px] ${selectedAsset=="ETHUSDT"?"border-b-[6px]":""}`}
          onClick={()=>{setSelectedAsset("ETHUSDT")}}
          >
            <img src={LOGOS["ETHUSDT"]} className="w-9" />
            <h1 className="text-xl">ETH</h1>
          </div>
          <div className="ml-[300px]">
            <h1 className="text-[13px] text-white/20">Standard</h1>
            <div className="flex gap-1 ">

            <h1 className="font-semibold">{balance.toFixed(2)}</h1> <h1> USD</h1>
            </div>
          </div>
          </div>
          <div className=" flex h-full w-full"  >
    <div className="flex h-[calc(100vh-72px)]">

          <AskBid trades={trades} />
          <div className="flex-1">

          <CandleChart symbolValue={selectedAsset} trades={trades}   />
          <MakeOrder setBalance={setBalance} balance={balance} setFirstBalance={setFirstBalance} firstBalance={firstBalance} setOrders={setOrders} orders={orders} trades={trades}  />
          </div>
          <SellAndBuy selectedAsset={selectedAsset} setOrders={setOrders} setTrades={setTrades} trades={trades} takeProfit={takeProfit} setStopLoss={setStopLoss} setTakeProfit={setTakeProfit} stopLoss={stopLoss} />
    </div>
          </div>
        </div>
      )
}