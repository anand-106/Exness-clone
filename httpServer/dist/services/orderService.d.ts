import { Order } from "../models/models";
export declare function openOrderQ(order: Order, id: string, email: string): Promise<void>;
export declare function closeOrderQ(order: Order, id: string, email: string): Promise<void>;
export declare function liquidateOrderQ(order: Order, id: string, email: string): Promise<void>;
//# sourceMappingURL=orderService.d.ts.map