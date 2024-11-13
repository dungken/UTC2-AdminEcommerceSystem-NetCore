import React, { useState } from 'react';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-top: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
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

interface LowStockSettingsProps {
    lowStockLevel: number;
    setLowStockLevel: React.Dispatch<React.SetStateAction<number>>;
}

const LowStockSettings: React.FC<LowStockSettingsProps> = ({ lowStockLevel, setLowStockLevel }) => {
    const [newLevel, setNewLevel] = useState<number>(lowStockLevel);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLowStockLevel(newLevel);
    };

    return (
        <SettingsContainer>
            <h3>Low Stock Alert Settings</h3>
            <Form onSubmit={handleSubmit}>
                <Label>
                    Low Stock Level:
                    <Input
                        type="number"
                        value={newLevel}
                        onChange={(e) => setNewLevel(Number(e.target.value))}
                    />
                </Label>
                <Button type="submit">Save</Button>
            </Form>
        </SettingsContainer>
    );
};

export default LowStockSettings;
