import React from 'react';
import { Table } from 'react-bootstrap';
import { Order } from './types';

interface OrderReportProps {
    orders: Order[];
}

const OrderReport: React.FC<OrderReportProps> = ({ orders }) => {
    const revenue = orders.reduce((sum, order) => {
        return sum + order.products.reduce((productSum, product) => productSum + product.price * product.quantity, 0);
    }, 0);

    return (
        <div className="container mt-5">
            <h2>Order Report</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customer}</td>
                            <td>
                                {order.products.reduce(
                                    (total, product) => total + product.price * product.quantity,
                                    0
                                )}
                            </td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <h4>Total Revenue: {revenue}</h4>
        </div>
    );
};

export default OrderReport;
