import { Worker } from "bullmq";
import { sendEmail } from "./emailService";

import Redis from "ioredis";

const connection = new Redis(
    {
        maxRetriesPerRequest:null,
        enableReadyCheck:false
        }
)

const worker = new Worker('order-queue',async job =>{

    const {name,data} = job

    switch (name){
        case 'ORDER_OPENED':
            await sendEmail(data.email,'Your Order is opened')
            break;
        
            case 'ORDER_CLOSED':
            await sendEmail(data.email,'Your Order is Closed')
            break;

            case 'ORDER_LIQUIDATED':
            await sendEmail(data.email,'Your Order is Liquadated')
            break;
    }

},{connection})

worker.on("completed",()=>{
    console.log("email send to user")
})

worker.on("failed",()=>{
    console.log("error sending email")
})
