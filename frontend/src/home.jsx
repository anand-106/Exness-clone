import { AskBid } from "./components/askBid"
import CandleChart from "./components/candleChart"
import { MakeOrder } from "./components/makeOrder"

import ExnessLogo from './assets/exness_logo.png'

import { LOGOS } from "./components/logos"
import { useEffect, useState } from "react"
import { SellAndBuy } from "./components/buyAndSell"


export function Home(){

  const [latestTrade,setLatestTarde] = useState(null)

  useEffect(()=>{
    if(!latestTrade) return;
    const data = JSON.parse(latestTrade)

    setTrades(prev=>{
        return {...prev,[data.symbol]:{price:data.price,askPrice:data.askPrice,bidPrice:data.bidPrice,time:data.trade_time}}
    })

    
    
    
},[latestTrade])



  const [selectedAsset,setSelectedAsset] = useState("SOLUSDT")
  const [balance, setBalance] = useState(0)
    const [firstBalance,setFirstBalance] = useState(0)
    const [orders,setOrders] = useState(null)
    const [trades,setTrades] = useState({})

    

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
        <div className=" w-full h-screen bg-[#141d22] text-white">
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
    
          <AskBid latestTrade={latestTrade} />
          <div className="">

          <CandleChart symbolValue={selectedAsset} trades={trades} />
          <MakeOrder setBalance={setBalance} balance={balance} setFirstBalance={setFirstBalance} firstBalance={firstBalance} setOrders={setOrders} orders={orders} latestTrade={latestTrade} />
          </div>
          <SellAndBuy selectedAsset={selectedAsset} setOrders={setOrders} setTrades={setTrades} trades={trades} />
          </div>
        </div>
      )
}