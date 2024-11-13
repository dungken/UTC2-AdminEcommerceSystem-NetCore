export interface Product {
    id: string;
    name: string;
    description: string; // New property
    stock: number;
    price: number;
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
