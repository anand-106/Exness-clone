import { useEffect, useRef, useState } from "react";

export function AskBid() {
  const [bid, setBid] = useState(0);
  const [ask, setAsk] = useState(0);
  const [askColor, setAskColor] = useState("");
  const [bidColor, setBidColor] = useState("");
  const prevPriceRef = useRef(0);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => console.log("WebSocket connected");
    ws.onclose = () => console.log("WebSocket disconnected");

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      const price = parseFloat(data.price);

      
      if (price > prevPriceRef.current) 
      {
          setAskColor("text-green-500");
          setBidColor("text-green-500")

      }
      else if (price < prevPriceRef.current)
      {
        setBidColor("text-red-500")
          setAskColor("text-red-500");
        }
    //   else setAskColor(""); // neutral

     
      const askPrice = Math.round((price + 0.05 * price) * 100) / 100;
      const bidPrice = Math.round(price * 100) / 100;

      setAsk(askPrice);
      setBid(bidPrice);

      prevPriceRef.current = price;
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
      <div className="flex justify-between">
        <h1>SOL</h1>
        <h1 className={bidColor} >{bid.toFixed(2)}</h1>
        <h1 className={askColor}>{ask.toFixed(2)}</h1>
      </div>
    </div>
  );
}
