"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSSEConnections = exports.orders = exports.users = exports.LatestPrices = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jwt_1 = require("./jwt");
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("./utils/redis");
const psql_1 = require("./utils/psql");
const closeOrder_1 = require("./services/closeOrder");
const orderService_1 = require("./services/orderService");
require("./services/notificationWorker");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const JWT_SECRET = "anand";
const PORT = 3000;
exports.LatestPrices = {};
exports.users = { 123456789: { username: "anandkvlm2003@gmail.com", password: '12345678', balance: { USD: 5000, equity: 5000, marginUsed: 0, usableBalance: 5000 } } };
exports.orders = {};
redis_1.client.subscribe("trades", (err, count) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Subscribed to trades");
    }
});
redis_1.client.on("message", (channel, message) => {
    if (channel == "trades") {
        const trade = JSON.parse(message);
        exports.LatestPrices[trade.symbol] = trade.price;
        if (exports.orders) {
            Object.entries(exports.orders).forEach(async ([id, order]) => {
                if (order.type == "buy" && order.status == "open") {
                    order.pnl = exports.LatestPrices[order.asset] * order.qty - order.price * order.qty;
                    order.position = exports.LatestPrices[order.asset] * order.qty;
                    if (-(order.pnl) >= (.9 * order.margin)) {
                        (0, closeOrder_1.closeOrder)(id, "liquidated");
                        await (0, orderService_1.liquidateOrderQ)(order, id, exports.users[order.userId].username);
                        console.log("order liquidated with id ", id);
                    }
                    else if (order.stopLoss && order.stopLoss >= order.position) {
                        (0, closeOrder_1.closeOrder)(id, "closed");
                        await (0, orderService_1.closeOrderQ)(order, id, exports.users[id].username);
                        console.log("order closed by stoploss with id ", id);
                    }
                    else if (order.takeProfit && order.position >= order.takeProfit) {
                        (0, closeOrder_1.closeOrder)(id, "closed");
                        await (0, orderService_1.closeOrderQ)(order, id, exports.users[id].username);
                        console.log("order closed by takeProfit with id ", id);
                    }
                }
                else if (order.type == "sell" && order.status == "open") {
                    order.pnl = order.price * order.qty - exports.LatestPrices[order.asset] * order.qty;
                    order.position = exports.LatestPrices[order.asset] * order.qty;
                    if (-(order.pnl) >= (.9 * order.margin)) {
                        (0, closeOrder_1.closeOrder)(id, "liquidated");
                        await (0, orderService_1.liquidateOrderQ)(order, id, exports.users[id].username);
                        console.log("order liquidated with id ", id);
                    }
                    else if (order.stopLoss && order.position >= order.stopLoss) {
                        (0, closeOrder_1.closeOrder)(id, "closed");
                        await (0, orderService_1.closeOrderQ)(order, id, exports.users[id].username);
                        console.log("order closed by stoploss with id ", id);
                    }
                    else if (order.takeProfit && order.position <= order.takeProfit) {
                        (0, closeOrder_1.closeOrder)(id, "closed");
                        await (0, orderService_1.closeOrderQ)(order, id, exports.users[id].username);
                        console.log("order closed by takeProfit with id ", id);
                    }
                }
            });
        }
    }
});
app.get('/', (req, res) => {
    res.json({ message: "hello world" });
});
app.post('/api/v1/user/signup', async (req, res) => {
    const { username, password } = req.body;
    if (exports.users[username]) {
        return res.status(403).json({ message: "Error while signing up" });
    }
    const id = (0, uuid_1.v4)();
    exports.users[id] = {
        username: username,
        password,
        balance: {
            USD: 5000,
            equity: 5000,
            marginUsed: 0,
            usableBalance: 5000,
        },
    };
    res.json({ userId: id });
});
app.post('/api/v1/user/signin', async (req, res) => {
    const { username, password } = req.body;
    const user = Object.entries(exports.users).filter(([userId, user]) => user.username == username)[0];
    if (!user) {
        return res.status(403).json({ message: "Incorrect credentials" });
    }
    const userId = user[0];
    console.log(userId);
    const token = jsonwebtoken_1.default.sign({ userId }, JWT_SECRET);
    res.json({ token });
});
exports.userSSEConnections = {};
app.get('/events', (req, res) => {
    const jwtToken = req.query.jwt;
    let userId;
    // Verify JWT from query parameter
    if (jwtToken) {
        try {
            const payload = jsonwebtoken_1.default.verify(jwtToken, JWT_SECRET);
            if (!payload.userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            userId = payload.userId;
        }
        catch (err) {
            return res.status(401).json({ error: "Invalid token" });
        }
    }
    else {
        return res.status(401).json({ error: "No token provided" });
    }
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
    });
    exports.userSSEConnections[userId] = res;
    res.write(`data: ${JSON.stringify({ type: "CONNECTED", userId })}\n\n`);
    console.log(`User ${userId} connected to SSE`);
    res.on("close", () => {
        delete exports.userSSEConnections[userId];
        console.log(`User ${userId} disconnected from SSE`);
    });
});
app.get('/candles', async (req, res) => {
    try {
        console.log("handle hitted");
        const symbol = req.query.symbol;
        const interval = req.query.interval;
        const limit = parseInt(req.query.limit);
        const query = `SELECT timestamp , symbol ,open_price,close_price,high_price,low_price from ${interval} where symbol = '${symbol}' ORDER BY timestamp DESC LIMIT ${limit}`;
        const result = await psql_1.pool.query(query);
        const candles = result.rows.map((row) => ({
            time: Math.floor(new Date(row.timestamp).getTime() / 1000),
            open: parseFloat(row.open_price),
            high: parseFloat(row.high_price),
            low: parseFloat(row.low_price),
            close: parseFloat(row.close_price),
        })).reverse();
        res.json(candles);
    }
    catch (err) {
        console.log(err);
    }
});
app.use(jwt_1.verifyJwt);
app.get('/balance', async (req, res) => {
    const userId = req.userId;
    const user = exports.users[userId];
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    // console.log(users)
    res.json({ balance: user.balance });
});
app.get('/orders', (req, res) => {
    const userId = req.userId;
    const activeOrders = Object.entries(exports.orders).filter(([id, order]) => order.userId == userId).map(([id, order]) => ({ id, ...order }));
    res.json({ orders: activeOrders });
});
app.post("/order/open", (req, res) => {
    try {
        const { type, margin, asset, leverage, stopLoss, takeProfit } = req.body;
        const userId = req.userId;
        const user = exports.users[userId];
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const price = exports.LatestPrices[asset];
        const qty = (parseInt(leverage) * parseFloat(margin)) / price;
        if (margin > user.balance.usableBalance) {
            return res.status(400).json({ message: "insufficient funds" });
        }
        user.balance.usableBalance -= margin;
        user.balance.marginUsed += margin;
        const id = Date.now().toString();
        exports.orders[id] = {
            userId: userId,
            type: type,
            asset: asset,
            price: price,
            qty: qty,
            leverage: leverage,
            margin: margin,
            position: 0,
            status: "open",
            pnl: 0,
            takeProfit: takeProfit,
            stopLoss: stopLoss
        };
        res.json({ message: "Order opened", order: exports.orders[id], balance: user.balance });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});
app.post('/order/close', (req, res) => {
    const { id } = req.body;
    const userId = req.userId;
    const user = exports.users[userId];
    if (!user)
        return res.status(404).json({ message: "User not found" });
    const order = exports.orders[id];
    let pnl = 0;
    if (!order) {
        res.status(404).json({ message: "order not found" });
        return;
    }
    if (order.type == "buy") {
        pnl = (exports.LatestPrices[order.asset] || 0) * order.qty - order.price * order.qty;
    }
    else {
        pnl = order.price * order.qty - (exports.LatestPrices[order.asset] || 0) * order.qty;
    }
    user.balance.USD += pnl;
    user.balance.marginUsed -= order.margin;
    user.balance.usableBalance = user.balance.USD - user.balance.marginUsed;
    order.status = "closed";
    res.json({ message: "order closed" });
});
app.listen(PORT, () => {
    console.log(`User Server running on ${PORT}`);
});
//# sourceMappingURL=server.js.map