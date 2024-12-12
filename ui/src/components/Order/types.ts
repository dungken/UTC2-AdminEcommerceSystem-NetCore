export interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    customer: string;
    totalAmount: number;
    orderDate: string;
    userId: string;
    products: Product[];
    status: string;
    orderDetails: OrderDetail[];
}

export interface OrderDetail {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    total: number;
}


