export interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    customer: string;
    products: Product[];
    status: string;
}
