import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Order } from './types'; // Assuming you have a TypeScript type for Order
import { Link, useParams } from 'react-router-dom';
import { GetOrderByIdService, UpdateOrderStatusService } from '../../services/OrderService';
import { toast } from 'react-toastify';


const OrderDetail: React.FC = () => {
    // Get orderId from the params
    const { orderId } = useParams<{ orderId: string }>();
    // Fetch order details from the API
    const [order, setOrder] = useState<Order | null>(null);
    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                console.error('Order ID is undefined');
                return;
            }
            try {
                const response = await GetOrderByIdService(orderId);
                if (response.success) {
                    setOrder(response.data);
                } else {
                    console.error('Failed to fetch order details');
                }
            } catch (error) {
                console.error('Failed to fetch order details:', error);
            }
        }
        fetchOrder();
    }, [orderId]);

    const handleUpdateStatus = async (newStatus: string) => {
        console.log('Updating order status to:', newStatus);

        if (!orderId || !order) {
            console.error('Order ID or order data is undefined');
            return;
        }
        try {
            const response = await UpdateOrderStatusService(orderId, newStatus);
            if (response.success) {
                setOrder({ ...order, status: newStatus });
                toast.success('Order updated successfully');
            } else {
                console.error('Failed to update order status');
            }
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    };

    if (!order) {
        return <p>No order details available.</p>;
    }

    return (
        <div>
            <h2>Order Details</h2>
            <div>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>User ID:</strong> {order.userId}</p>
                <p><strong>Order Date:</strong> {" "}
                    {new Date(order.orderDate).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })}
                </p>
                <p><strong>Status: </strong>
                    <span
                        className={`badge ${order.status === 'Completed' ? 'bg-success' :
                            order.status === 'Pending' ? 'bg-warning' :
                                order.status === 'Cancelled' ? 'bg-danger' : 'bg-info'}`
                        }
                    >
                        {order.status}
                    </span>
                </p>
                <p>
                    <label htmlFor="updateStatus"><strong>Update Status: </strong></label>
                    <select
                        id="updateStatus"
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(e.target.value)}
                        className="form-select"
                        style={{ width: '200px', display: 'inline-block', marginLeft: '10px' }}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </p>

                <p><strong>Total Amount:</strong> {order.totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'VND' })}</p>
            </div>
            <h3>Order Items</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product ID</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.orderDetails.map((detail, index) => (
                        <tr key={detail.id}>
                            <td>{index + 1}</td>
                            <td>
                                <Link to={`/product-detail/${detail.productId}`}>{detail.productId}</Link>
                            </td>
                            <td>{detail.quantity}</td>
                            <td>{detail.unitPrice.toLocaleString('en-US', { style: 'currency', currency: 'VND' })}</td>
                            <td>{detail.total.toLocaleString('en-US', { style: 'currency', currency: 'VND' })}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Link to="/order">
                <Button variant="primary">Back to Orders</Button>
            </Link>
        </div>
    );
};

export default OrderDetail;
