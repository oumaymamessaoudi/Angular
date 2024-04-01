export interface Product {
    productId?: number; 
   
    prodDesc?: string;
    price?: number;
    prodCapacity?: number;
    archProd?: string;
    productName?: string;
    imageUrl?: string; // Represents the URL of the image
    [key: string]: any; // Index signature

}
