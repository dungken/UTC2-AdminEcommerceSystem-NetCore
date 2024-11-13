import React, { useState } from 'react';
import styled from 'styled-components';
import { StockFormProps, Transaction } from './types';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const StockForm: React.FC<StockFormProps> = ({ onSubmit }) => {
    const [productId, setProductId] = useState<string>('');
    const [type, setType] = useState<'entry' | 'exit'>('entry');
    const [quantity, setQuantity] = useState<number>(0);
    const [note, setNote] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const transaction: Transaction = {
            id: Date.now(),
            productId,
            type,
            quantity: type === 'entry' ? quantity : -quantity,
            note,
            date: new Date().toISOString(),
        };
        onSubmit(transaction);
        setProductId('');
        setType('entry');
        setQuantity(0);
        setNote('');
    };

    return (
        <FormContainer onSubmit={handleSubmit}>
            <h3>Stock Entry/Exit</h3>
            <Input
                type="text"
                placeholder="Product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
            />
            <Select value={type} onChange={(e) => setType(e.target.value as 'entry' | 'exit')}>
                <option value="entry">Stock Entry</option>
                <option value="exit">Stock Exit</option>
            </Select>
            <Input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
            />
            <Input
                type="text"
                placeholder="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />
            <Button type="submit">Add Transaction</Button>
        </FormContainer>
    );
};

export default StockForm;
