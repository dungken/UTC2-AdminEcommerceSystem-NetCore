import React from 'react';
import styled from 'styled-components';
import { TransactionListProps } from './types';

const TransactionContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const TransactionItem = styled.li`
  margin-bottom: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
  span {
    font-weight: bold;
    color: #007bff;
  }
  strong {
    color: #28a745;
  }
`;

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => (
    <TransactionContainer>
        <h3>Transaction History</h3>
        <ul>
            {transactions.map((transaction) => (
                <TransactionItem key={transaction.id}>
                    <span>{transaction.date}</span> - <strong>{transaction.type}</strong>: {transaction.quantity} - {transaction.note}
                </TransactionItem>
            ))}
        </ul>
    </TransactionContainer>
);

export default TransactionList;
