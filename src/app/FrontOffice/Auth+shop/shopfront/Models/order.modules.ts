import { Product } from "./product.module";

// order.model.ts
export interface Order {
    id: number;
    productName: string;
    quantite: number;
    totalPrice: number;
    orderstatus:string;
    price: number; // Add price property

    product?: Product; // Include a property of type Product

  }