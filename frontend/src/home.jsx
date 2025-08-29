import { AskBid } from "./components/askBid"
import CandleChart from "./components/candleChart"
import { MakeOrder } from "./components/makeOrder"

import ExnessLogo from './assets/exness_logo.png'

import { LOGOS } from "./components/logos"
import { useState } from "react"


export function Home(){

  const [selectedAsset,setSelectedAsset] = useState("SOLUSDT")
  const [balance, setBalance] = useState(0)
    const [firstBalance,setFirstBalance] = useState(0)

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
    
          <AskBid />
          <div className="w-3xl">

          <CandleChart symbolValue={selectedAsset} />
          <MakeOrder setBalance={setBalance} balance={balance} setFirstBalance={setFirstBalance} firstBalance={firstBalance}/>
          </div>
          </div>
        </div>
      )
}