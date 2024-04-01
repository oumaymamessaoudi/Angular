import { Order } from "./order.modules";

// cart.model.ts
export interface Cart {
    id: number;
    orders: Order[];
  }
  
  
  