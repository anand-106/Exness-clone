import { useEffect, useState } from "react";

export function AskBid() {
  const [trades,setTrades] = useState({})

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => console.log("WebSocket connected");
    ws.onclose = () => console.log("WebSocket disconnected");

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
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
            bidColor="text-green-500";
            askColor = "text-green-500";
        }
        else{
            bidColor="text-red-500";
            askColor = "text-red-500";
        }

        

        return {
            ...prev,
            [symbol]:{prevPrice:price,bid:bidPrice,ask:askPrice,bidColor:bidColor,askColor:askColor}
        };
      })   
      
    };

    return () => ws.close();
  }, []);

  return (
    <div className="flex flex-col w-[400px]">
      <div className="flex justify-between">
        <h1>Symbol</h1>
        <h1>Bid</h1>
        <h1>Ask</h1>
      </div>
      {
        Object.entries(trades).map(([symbol,trade])=>{
            return <div className="flex justify-between" >
                <h1>{symbol}</h1>
                <h1 className={trade.bidColor} >{trade.bid.toFixed(2)}</h1>
                <h1 className={trade.askColor} >{trade.ask.toFixed(2)}</h1>
            </div>
        })
      }
    </div>
  );
}
