"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openOrderQ = openOrderQ;
exports.closeOrderQ = closeOrderQ;
exports.liquidateOrderQ = liquidateOrderQ;
const redis_1 = require("../utils/redis");
async function openOrderQ(order, id, email) {
    await redis_1.orderQueue.add('ORDER_OPENED', {
        email: email,
        orderId: id,
        userId: order.userId,
        asset: order.asset,
        openPrice: order.price,
        type: order.type,
        qty: order.qty,
        leverage: order.leverage
    });
}
async function closeOrderQ(order, id, email) {
    await redis_1.orderQueue.add('ORDER_CLOSED', {
        email: email,
        orderId: id,
        userId: order.userId,
        asset: order.asset,
        openPrice: order.price,
        closePrice: order.position,
        type: order.type,
        qty: order.qty,
        pnl: order.pnl,
        leverage: order.leverage
    });
}
async function liquidateOrderQ(order, id, email) {
    await redis_1.orderQueue.add('ORDER_LIQUIDATED', {
        email: email,
        orderId: id,
        userId: order.userId,
        asset: order.asset,
        openPrice: order.price,
        closePrice: order.position,
        type: order.type,
        qty: order.qty,
        pnl: order.pnl,
        leverage: order.leverage
    });
}
//# sourceMappingURL=orderService.js.map