import React, { useState, useEffect } from 'react';
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

interface DiscountFormProps {
    onSubmit: (discount: Discount) => void;
    selectedDiscount?: Discount | null;
    onClearSelection: () => void;
}

const DiscountForm: React.FC<DiscountFormProps> = ({ onSubmit, selectedDiscount, onClearSelection }) => {
    const [code, setCode] = useState('');
    const [type, setType] = useState('percentage'); // hoặc 'fixed'
    const [value, setValue] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [linkedProducts, setLinkedProducts] = useState<string[]>([]);
    const [linkedCategories, setLinkedCategories] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (selectedDiscount) {
            setCode(selectedDiscount.code);
            setType(selectedDiscount.type);
            setValue(selectedDiscount.value);
            setStartDate(selectedDiscount.startDate);
            setEndDate(selectedDiscount.endDate);
            setLinkedProducts(selectedDiscount.linkedProducts);
            setLinkedCategories(selectedDiscount.linkedCategories);
        }
    }, [selectedDiscount]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!code) newErrors.code = 'Code is required';
        if (!value) newErrors.value = 'Value is required';
        if (!startDate) newErrors.startDate = 'Start date is required';
        if (!endDate) newErrors.endDate = 'End date is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit({
            id: selectedDiscount ? selectedDiscount.id : Date.now(),
            code,
            type,
            value,
            startDate,
            endDate,
            linkedProducts,
            linkedCategories,
        });
        onClearSelection();
    };

    return (
        <FormContainer onSubmit={handleSubmit}>
            <Input
                type="text"
                placeholder="Discount Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
            />
            {errors.code && <Error>{errors.code}</Error>}
            <Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
            </Select>
            <Input
                type="number"
                placeholder="Value"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                required
            />
            {errors.value && <Error>{errors.value}</Error>}
            <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
            />
            {errors.startDate && <Error>{errors.startDate}</Error>}
            <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
            />
            {errors.endDate && <Error>{errors.endDate}</Error>}
            <Input
                type="text"
                placeholder="Linked Products (comma-separated IDs)"
                value={linkedProducts.join(',')}
                onChange={(e) => setLinkedProducts(e.target.value.split(','))}
            />
            <Input
                type="text"
                placeholder="Linked Categories (comma-separated IDs)"
                value={linkedCategories.join(',')}
                onChange={(e) => setLinkedCategories(e.target.value.split(','))}
            />
            <Button type="submit">
                {selectedDiscount ? 'Update Discount' : 'Add Discount'}
            </Button>
        </FormContainer>
    );
};

export default DiscountForm;

const Error = styled.div`
  color: red;
  font-size: 0.8rem;
  margin-top: -10px;
  margin-bottom: 10px;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 25px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
`;