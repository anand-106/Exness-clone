import axios from "axios"
import { useEffect } from "react"

export function MakeOrder(){

    useEffect(()=>{
        axios.get('http://localhost:3000/orders',{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        }).then(res=>{
            console.log(res)
        }).catch(err=>{
            console.error(err)
        })
    },[])

    return <div className="h-[300px] w-[300px] border border-black rounded-2xl" >
        <div>Balance: </div>
    </div>
}