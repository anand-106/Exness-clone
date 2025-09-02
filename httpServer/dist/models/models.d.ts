export interface User {
    username: string;
    password: string;
    balance: {
        USD: number;
        equity: number;
        marginUsed: number;
        usableBalance: number;
    };
}
export interface Order {
    userId: string;
    type: "buy" | "sell";
    asset: string;
    price: number;
    qty: number;
    leverage: number;
    margin: number;
    position: number;
    stopLoss?: number;
    takeProfit?: number;
    status: "open" | "closed" | "liquidated";
    pnl?: number;
}
//# sourceMappingURL=models.d.ts.map