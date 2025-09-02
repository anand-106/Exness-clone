"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeOrder = closeOrder;
const server_1 = require("../server");
function closeOrder(id, status) {
    const order = server_1.orders[id];
    let pnl = 0;
    if (!order) {
        return;
    }
    const user = server_1.users[order.userId];
    if (!user)
        return;
    if (order.type == "buy") {
        pnl = (server_1.LatestPrices[order.asset] || 0) * order.qty - order.price * order.qty;
    }
    else {
        pnl = order.price * order.qty - (server_1.LatestPrices[order.asset] || 0) * order.qty;
    }
    user.balance.USD += pnl;
    user.balance.marginUsed -= order.margin;
    user.balance.usableBalance = user.balance.USD - user.balance.marginUsed;
    order.status = status;
    const sse = server_1.userSSEConnections[order.userId];
    if (sse) {
        const orderUpdate = {
            type: "ORDER_UPDATE",
            asset: order.asset,
            orderId: id,
            status: status,
            pnl: pnl
        };
        sse.write(`data: ${JSON.stringify(orderUpdate)}\n\n`);
        console.log(`Sent SSE to user ${order.userId}:`, orderUpdate);
    }
}
//# sourceMappingURL=closeOrder.js.map