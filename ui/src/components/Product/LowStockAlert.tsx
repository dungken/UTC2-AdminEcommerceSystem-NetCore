import React from 'react';
import styled from 'styled-components';
import { Product } from './types';

const AlertContainer = styled.div`
  padding: 20px;
  background-color: #ffe4e1;
  border: 1px solid #ff0000;
  border-radius: 8px;
  color: #ff0000;
  margin-bottom: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

interface LowStockAlertProps {
    inventory: Product[];
    lowStockLevel: number;
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ inventory, lowStockLevel }) => {
    const lowStockItems = inventory.filter((product) => product.stock < lowStockLevel);

    return (
        <>
            {lowStockItems.length > 0 && (
                <AlertContainer>
                    <h4>Low Stock Alert</h4>
                    <ul>
                        {lowStockItems.map((item) => (
                            <li key={item.id}>
                                {item.name}: Only {item.stock} left!
                            </li>
                        ))}
                    </ul>
                </AlertContainer>
            )}
        </>
    );
};

export default LowStockAlert;
