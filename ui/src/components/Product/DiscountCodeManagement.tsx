import React, { useState } from 'react';
import styled from 'styled-components';
import DiscountForm from './DiscountForm';
import DiscountList from './DiscountList';
import { discounts as initialDiscounts } from './data';

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

const DiscountCodeManagement: React.FC = () => {
    const [discounts, setDiscounts] = useState<Discount[]>(initialDiscounts);
    const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);

    const handleAddDiscount = (discount: Discount) => {
        setDiscounts([...discounts, discount]);
        setSelectedDiscount(null);
    };

    const handleEditDiscount = (updatedDiscount: Discount) => {
        setDiscounts(
            discounts.map((discount) =>
                discount.id === updatedDiscount.id ? updatedDiscount : discount
            )
        );
        setSelectedDiscount(null);
    };

    const handleDeleteDiscount = (id: number) => {
        setDiscounts(discounts.filter((discount) => discount.id !== id));
    };

    return (
        <Container>
            <Header>
                <h1>Discount Code Management</h1>
            </Header>

            <FormWrapper>
                <DiscountForm
                    onSubmit={selectedDiscount ? handleEditDiscount : handleAddDiscount}
                    selectedDiscount={selectedDiscount}
                    onClearSelection={() => setSelectedDiscount(null)}
                />
            </FormWrapper>

            <ListWrapper>
                <DiscountList
                    discounts={discounts}
                    onEdit={setSelectedDiscount}
                    onDelete={handleDeleteDiscount}
                />
            </ListWrapper>
        </Container>
    );
};

export default DiscountCodeManagement;

// ...existing styled components...

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f5f5f5;
  border-radius: 8px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h1 {
    font-size: 2rem;
    color: #333;
  }
`;

const FormWrapper = styled.div`
  margin-bottom: 30px;
`;

const ListWrapper = styled.div`
  margin-top: 30px;
`;
