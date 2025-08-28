import { create } from 'zustand'


export const useWsStore = create((set)=>({
    latestTrade:null,
    connect:()=>{
        const ws = new WebSocket("ws://localhost:8080")

        ws.onopen = ()=>{
            console.log("websocket connected")
        }

        ws.onclose = ()=>{
            console.log("websocket disconnected")
        }

        ws.onmessage= (event) =>{
            const msg = event.data
            set({latestTrade:msg})
        }

        return ws
    }
}))