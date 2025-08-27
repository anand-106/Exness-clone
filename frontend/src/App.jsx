import { AskBid } from "./components/askBid"
import CandleChart from "./components/candleChart"


function App() {
  

  return (
    <div>
      Exness
      <div className="flex " >

      <AskBid />
      <CandleChart />
      </div>
    </div>
  )
}

export default App
