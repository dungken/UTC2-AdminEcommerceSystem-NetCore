import React from 'react';
import styled from 'styled-components';
import { InventoryTableProps, Product } from './types';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  padding: 15px;
  background-color: #007bff;
  color: white;
  text-align: left;
`;

const Td = styled.td`
  padding: 15px;
  border-bottom: 1px solid #ddd;
`;

const Button = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const InventoryTable: React.FC<InventoryTableProps> = ({ inventory, setInventory }) => {
    const handleEditProduct = (updatedProduct: Product) => {
        setInventory(
            inventory.map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
            )
        );
    };

    const handleDeleteProduct = (id: string) => {
        setInventory(inventory.filter((product) => product.id !== id));
    };

    return (
        <Table>
            <thead>
                <tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th>Description</Th> {/* New column */}
                    <Th>Stock</Th>
                    <Th>Price</Th>
                    <Th>Actions</Th>
                </tr>
            </thead>
            <tbody>
                {inventory.map((product) => (
                    <tr key={product.id}>
                        <Td>{product.id}</Td>
                        <Td>{product.name}</Td>
                        <Td>{product.description}</Td> {/* New column */}
                        <Td>{product.stock}</Td>
                        <Td>{product.price}</Td>
                        <Td>
                            <Button onClick={() => handleEditProduct(product)}>Edit</Button>
                            {/* <Button onClick={() => handleDeleteProduct(product.id)}>Delete</Button> */}
                        </Td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default InventoryTable;
