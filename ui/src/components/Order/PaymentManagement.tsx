import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

interface Payment {
    orderId: string;
    amount: number;
    method: string;
    status: string;
}

interface PaymentManagementProps {
    onProcessPayment: (payment: Payment) => void;
}

const PaymentManagement: React.FC<PaymentManagementProps> = ({ onProcessPayment }) => {
    const [orderId, setOrderId] = useState('');
    const [amount, setAmount] = useState(0);
    const [method, setMethod] = useState('');
    const [status, setStatus] = useState('Pending');

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payment: Payment = { orderId, amount, method, status };
        onProcessPayment(payment);
    };

    return (
        <div className="container mt-5">
            <h2>Process Payment</h2>
            <Form onSubmit={handlePaymentSubmit}>
                <Form.Group controlId="orderId">
                    <Form.Label>Order ID</Form.Label>
                    <Form.Control
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="amount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                    />
                </Form.Group>

                <Form.Group controlId="method">
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Control
                        type="text"
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="status">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                        as="select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Refunded">Refunded</option>
                    </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Process Payment
                </Button>
            </Form>
        </div>
    );
};

export default PaymentManagement;
