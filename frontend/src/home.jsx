import { AskBid } from "./components/askBid"
import CandleChart from "./components/candleChart"
import { MakeOrder } from "./components/makeOrder"

export function Home(){
    return (
        <div>
          Exness
          <div className="flex " >
    
          <AskBid />
          <CandleChart />
          <MakeOrder />
          </div>
        </div>
      )
}