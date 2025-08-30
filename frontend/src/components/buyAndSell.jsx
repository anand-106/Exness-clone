import { useState } from "react";
import { LOGOS } from "./logos";
import axios from "axios";


export function SellAndBuy({selectedAsset,setOrders,trades}){

    
    // const selectedAsset = useSelectedAsset(state=>state.selectedAsset)
    
    const [margin,setMargin] = useState("")
    const [leverage,setLeverage] = useState("")
    const [selectedType,setSelectedType]= useState(null)

    

    const handleOrder = ()=>{
        axios.post('http://localhost:3000/order/open',{
            type:selectedType,
            asset:selectedAsset,
            margin:parseFloat(margin),
            leverage:parseFloat(leverage)
        },{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        }).then(()=>{
            axios.get('http://localhost:3000/orders',{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            }).then(res=>{
               setOrders(res.data.orders)
               
            }).catch(err=>{
                console.error(err)
            })

            setMargin("")
            setLeverage("")


        }).catch(err=>{
            console.error(err)
        })
    }

    return<div className="h-full w-full p-1 bg-[#3f474a] mt-1 ">
        <div className="h-full w-full bg-[#141d22] p-2 rounded-md">
            <div className="flex gap-2 mb-4">
                <img src={LOGOS[selectedAsset]} alt="logo" className="w-[25px]" />
                <h1>{selectedAsset}</h1>
            </div>
        <div className="h-20 flex gap-2">
            <button className={`h-full w-1/2 border-[2px] cursor-pointer rounded-md border-[#eb483f] ${selectedType=="sell"?"bg-[#eb483f]":""}`}
            onClick={()=>{setSelectedType("sell")}}
            >
            Sell
            <h1>{trades[selectedAsset]?.bidPrice|| "Loading"}</h1>
            </button>
            <button className={`h-full w-1/2 border-[2px] cursor-pointer rounded-md border-[#158bf9] ${selectedType=="buy"?"bg-[#158bf9]":""}`}
            onClick={()=>{setSelectedType("buy")}}
            >Buy
            <h1>{trades[selectedAsset]?.askPrice|| "Loading"}</h1>
            </button>
        </div>
        <div className="mt-7">
            <h1 className="text-white/80 text-base">Margin</h1>
            <input
            className="outline-0 border border-white/30 pl-2 h-10 w-full rounded-md mb-4"
             value={margin} onChange={(e)=>{setMargin(e.target.value)}} placeholder="Not Set" />
             <h1 className="text-white/80 text-base">Leverage</h1>
            <input
            className="outline-0 border border-white/30 pl-2 h-10 w-full rounded-md"
             value={leverage} onChange={(e)=>{setLeverage(e.target.value)}} placeholder="Not Set" />
        </div>
        {

           selectedType&& (<div className="flex flex-col">
                <button onClick={handleOrder} className={`h-12 my-3 font-semibold cursor-pointer rounded-md w-full ${selectedType=="sell"?"bg-[#eb483f]":"bg-[#158bf9]"}`} >Confirm {selectedType=="sell"?"sell":"buy"}</button>
                <button className="h-12 mb-3 font-semibold cursor-pointer rounded-md w-full bg-white/10" onClick={()=>{setSelectedType(null)}}>Cancel</button>
            </div>)
         }
        </div>

    </div>
}