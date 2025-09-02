import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
export declare const client: Redis;
export declare const orderQueue: Queue<any, any, string, any, any, string>;
//# sourceMappingURL=redis.d.ts.map