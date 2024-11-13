import React from 'react';
import styled from 'styled-components';

interface Discount {
    id: number;
    code: string;
    type: string;
    value: number;
    startDate: string;
    endDate: string;
    linkedProducts: string[];
    linkedCategories: string[];
}

interface DiscountListProps {
    discounts: Discount[];
    onEdit: (discount: Discount) => void;
    onDelete: (id: number) => void;
}

const DiscountList: React.FC<DiscountListProps> = ({ discounts, onEdit, onDelete }) => (
    <ListContainer>
        {discounts.map((discount) => (
            <DiscountCard
                key={discount.id}
                discount={discount}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        ))}
    </ListContainer>
);

interface DiscountCardProps {
    discount: Discount;
    onEdit: (discount: Discount) => void;
    onDelete: (id: number) => void;
}

const DiscountCard: React.FC<DiscountCardProps> = ({ discount, onEdit, onDelete }) => (
    <Card>
        <h3>{discount.code}</h3>
        <p>Type: {discount.type}</p>
        <p>Value: {discount.value}</p>
        <p>Start Date: {discount.startDate}</p>
        <p>End Date: {discount.endDate}</p>
        <p>Linked Products: {discount.linkedProducts.join(', ')}</p>
        <p>Linked Categories: {discount.linkedCategories.join(', ')}</p>
        <Button onClick={() => onEdit(discount)}>Edit</Button>
        <Button onClick={() => onDelete(discount.id)}>Delete</Button>
    </Card>
);

export default DiscountList;

// ...existing styled components...

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;

  h3 {
    color: #333;
    margin-bottom: 10px;
  }

  p {
    margin: 5px 0;
  }
`;

const Button = styled.button`
  padding: 10px;
  margin-top: 10px;
  color: #007bff;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: bold;
`;