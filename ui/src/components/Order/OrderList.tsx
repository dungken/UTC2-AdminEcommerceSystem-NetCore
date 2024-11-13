import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { Order } from './types';


interface OrderListProps {
    orders: Order[];
    onEdit: (order: Order) => void;
    onDelete: (orderId: string) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onEdit, onDelete }) => {
    return (
        <div className="container mt-5">
            <h2>Order List</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customer}</td>
                            <td>{order.status}</td>
                            <td>
                                <Button variant="info" onClick={() => onEdit(order)}>Edit</Button>{' '}
                                <Button variant="danger" onClick={() => onDelete(order.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default OrderList;
