"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const emailService_1 = require("./emailService");
const ioredis_1 = __importDefault(require("ioredis"));
const connection = new ioredis_1.default({
    maxRetriesPerRequest: null,
    enableReadyCheck: false
});
const worker = new bullmq_1.Worker('order-queue', async (job) => {
    const { name, data } = job;
    switch (name) {
        case 'ORDER_OPENED':
            await (0, emailService_1.sendEmail)(data.email, 'Your Order is opened');
            break;
        case 'ORDER_CLOSED':
            await (0, emailService_1.sendEmail)(data.email, 'Your Order is Closed');
            break;
        case 'ORDER_LIQUIDATED':
            await (0, emailService_1.sendEmail)(data.email, 'Your Order is Liquadated');
            break;
    }
}, { connection });
worker.on("completed", () => {
    console.log("email send to user");
});
worker.on("failed", () => {
    console.log("error sending email");
});
//# sourceMappingURL=notificationWorker.js.map