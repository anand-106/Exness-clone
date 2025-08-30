import { useEffect, useState } from "react";
// import { useWsStore } from "../utils/wsstore";
import { LOGOS } from "./logos";

export function AskBid({latestTrade}) {
  const [trades,setTrades] = useState({})


  // const latestTrade = useWsStore((state)=>state.latestTrade)
  // const connect  = useWsStore((state)=>state.connect)

  // useEffect(()=>{
  //   const ws = connect();
  //   return ()=>{
  //     if (ws) ws.close()
  //   }
  // },[])


  useEffect(() => {
    
    
    if(!latestTrade) return;
    
      const data = JSON.parse(latestTrade);
      const price = parseFloat(data.price);
      const askPrice = parseFloat(data.askPrice);
      const bidPrice = parseFloat(data.bidPrice);
      const symbol = data.symbol


      setTrades((prev)=>{
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

        

        return {
            ...prev,
            [symbol]:{prevPrice:price,bid:bidPrice,ask:askPrice,bidColor:bidColor,askColor:askColor}
        };
      })   
      
    }

    
  , [latestTrade]);

  return (
    <div className="flex flex-col w-[400px] h-full bg-[#3f474a] p-1 mt-1">
      <div className="bg-[#141d22] rounded-md w-full h-full">

      <table>

      <thead className="">
        <tr>

        <th className="px-2 py-1 font-medium text-sm text-white/50">Symbol</th>
        <th className="px-2 py-1 font-medium text-sm text-white/50">Bid</th>
        <th className="px-2 py-1 font-medium text-sm text-white/50">Ask</th>
        </tr>
      </thead>
      <tbody>

      {
        Object.entries(trades).map(([symbol,trade])=>{
          return <tr className="" >
                <td className="px-2 py-1 flex w-30 items-center"><img className="h-6 " src={LOGOS[symbol]} /><div className="p-1">{symbol}</div></td>
                <td className="px-2 py-1" ><div className={`p-1 ${trade.bidColor} rounded-md transition-colors duration-300 ease-out`}>{trade.bid.toFixed(2)}</div></td>
                <td className="px-2 py-1" > <div className={`p-1 ${trade.askColor} rounded-md transition-colors duration-300 ease-out`}>{trade.ask.toFixed(2)}</div></td>
            </tr>
        })
      }
      </tbody>
      </table>
      </div>
    </div>
  );
}
