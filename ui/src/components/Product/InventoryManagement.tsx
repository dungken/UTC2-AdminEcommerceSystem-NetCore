import React, { useState } from 'react';
import styled from 'styled-components';
import { Product, Transaction } from './types';
import StockForm from './StockForm';
import InventoryTable from './InventoryTable';
import TransactionList from './TransactionList';
import LowStockAlert from './LowStockAlert';
import LowStockSettings from './LowStockSettings';

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const InventoryManagement: React.FC = () => {
    const [inventory, setInventory] = useState<Product[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [lowStockLevel, setLowStockLevel] = useState<number>(10);

    const handleAddTransaction = (transaction: Transaction) => {
        setTransactions([...transactions, transaction]);
        updateInventory(transaction);
    };

    const updateInventory = (transaction: Transaction) => {
        const updatedInventory = inventory.map((item) =>
            item.id === transaction.productId
                ? { ...item, stock: item.stock + transaction.quantity }
                : item
        );
        setInventory(updatedInventory);
    };

    return (
        <Container>
            <Header>
                <h1>Inventory Management</h1>
            </Header>

            <LowStockAlert inventory={inventory} lowStockLevel={lowStockLevel} />
            <LowStockSettings lowStockLevel={lowStockLevel} setLowStockLevel={setLowStockLevel} />
            <StockForm onSubmit={handleAddTransaction} />
            <InventoryTable inventory={inventory} setInventory={setInventory} />
            <TransactionList transactions={transactions} />
        </Container>
    );
};

export default InventoryManagement;
