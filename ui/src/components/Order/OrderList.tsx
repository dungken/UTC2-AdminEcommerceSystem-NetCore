import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { Order } from './types';
import { Link } from 'react-router-dom';
import OrderDetail from './OrderDetail';


interface OrderListProps {
    orders: Order[];
    onDelete: (orderId: string) => void;
    onEdit: (order: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onDelete }) => {
    return (
        <div className="mt-5">
            <h2>Order List</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total Amount</th>
                        <th>Order Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>
                                <Link to={`/order/${order.id}`}>{order.id}</Link>
                            </td>
                            <td>
                                <Link to={`/customer/${order.userId}`}>{order.userId}</Link>
                            </td>
                            <td>{order.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                            <td>{new Date(order.orderDate).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            })}</td>
                            <td>
                                <span
                                    className={`badge ${order.status === 'Completed' ? 'bg-success' :
                                        order.status === 'Pending' ? 'bg-warning' :
                                            order.status === 'Cancelled' ? 'bg-danger' : 'bg-info'}`
                                    }
                                >
                                    {order.status}
                                </span>
                            </td>
                            <td>
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
