import { Queue } from 'bullmq'
import {Redis} from 'ioredis'

 const connection = new Redis(
{
maxRetriesPerRequest:null,
enableReadyCheck:false
}
 )

export const client = new Redis()


export const orderQueue = new Queue('order-queue',{connection})