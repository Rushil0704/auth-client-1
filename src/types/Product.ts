import { Category } from "./Category";

export interface Product {
    _id: string;
    name: string;
    description?: string;
    price: number;
    category: Category["_id"]; // Ensure it's an ObjectId
    stock: number;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}
