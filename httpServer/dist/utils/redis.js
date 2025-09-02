"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderQueue = exports.client = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = require("ioredis");
const connection = new ioredis_1.Redis({
    maxRetriesPerRequest: null,
    enableReadyCheck: false
});
exports.client = new ioredis_1.Redis();
exports.orderQueue = new bullmq_1.Queue('order-queue', { connection });
//# sourceMappingURL=redis.js.map