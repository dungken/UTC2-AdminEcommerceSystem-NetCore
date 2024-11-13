import React, { useState } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import OrderForm from './OrderForm';
import OrderList from './OrderList';
import PaymentManagement from './PaymentManagement';
import OrderReport from './OrderReport';
import { Order } from './types';

const OrderManagementPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [editingOrder, setEditingOrder] = useState<Order | undefined>(undefined);

    const handleSaveOrder = (order: Order) => {
        if (editingOrder) {
            setOrders(orders.map((o) => (o.id === order.id ? order : o)));
        } else {
            setOrders([...orders, order]);
        }
        setEditingOrder(undefined); // Reset editing state after saving
    };

    const handleEditOrder = (order: Order) => {
        setEditingOrder(order);
    };

    const handleDeleteOrder = (orderId: string) => {
        setOrders(orders.filter((order) => order.id !== orderId));
    };

    const handleProcessPayment = (payment: any) => {
        // Process payment logic, could be an API call here
        console.log('Processing payment:', payment);
    };

    return (
        <Container>
            <h1>Order Management</h1>
            <Row>
                <Col md={6}>
                    <OrderForm onSave={handleSaveOrder} order={editingOrder} />
                </Col>
                <Col md={6}>
                    <OrderList
                        orders={orders}
                        onEdit={handleEditOrder}
                        onDelete={handleDeleteOrder}
                    />
                </Col>
            </Row>
            <Row className="mt-4">
                <Col md={6}>
                    <PaymentManagement onProcessPayment={handleProcessPayment} />
                </Col>
                <Col md={6}>
                    <OrderReport orders={orders} />
                </Col>
            </Row>
        </Container>
    );
};

export default OrderManagementPage;
