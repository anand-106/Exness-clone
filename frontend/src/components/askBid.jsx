
import { LOGOS } from "./logos";

export function AskBid({trades}) {
  

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
                <td className="px-2 py-1" ><div className={`p-1 ${trade.bidColor} rounded-md transition-colors duration-300 ease-out`}>{trade.bidPrice.toFixed(2)}</div></td>
                <td className="px-2 py-1" > <div className={`p-1 ${trade.askColor} rounded-md transition-colors duration-300 ease-out`}>{trade.askPrice.toFixed(2)}</div></td>
            </tr>
        })
      }
      </tbody>
      </table>
      </div>
    </div>
  );
}
