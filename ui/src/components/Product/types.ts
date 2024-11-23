export interface ColorDTO {
    id?: string;
    name: string;
    colorCode: string;
}

export interface SizeDTO {
    id?: string;
    name: string;
}

export interface ImageDTO {
    id?: string;
    url: string;
    altText: string;
}

export interface DiscountDto {
    id?: string;
    percentage: number;
    startDate: string;
    endDate: string;
}

export interface FeedbackDTO {
    id?: string;
    userId: string;
    comment: string;
    rating: number;
}

export interface Product {
    id?: string;
    name: string;
    description: string;
    stock: number;
    price: number;
    createdAt: string;
    updatedAt: string;
    categoryId: string;
    colors: ColorDTO[];
    sizes: SizeDTO[];
    images: ImageDTO[];
    discounts: DiscountDto[];
    feedbacks: FeedbackDTO[];
    active: boolean;
}

export interface Transaction {
    id: number;
    productId: string;
    type: 'entry' | 'exit';
    quantity: number;
    note: string;
    date: string;
}

export interface StockFormProps {
    onSubmit: (transaction: Transaction) => void;
}

export interface InventoryTableProps {
    inventory: Product[];
    setInventory: React.Dispatch<React.SetStateAction<Product[]>>;
}

export interface TransactionListProps {
    transactions: Transaction[];
}

export interface LowStockAlertProps {
    inventory: Product[];
    lowStockLevel: number;
}

export interface LowStockSettingsProps {
    lowStockLevel: number;
    setLowStockLevel: React.Dispatch<React.SetStateAction<number>>;
}
