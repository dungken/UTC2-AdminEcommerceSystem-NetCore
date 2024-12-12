import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import OrderList from './OrderList';
import { Order } from './types';
import axios from 'axios'; // Axios for API requests (optional, you can use fetch)
import { DeleteOrderByIdService, GetOrdersService } from '../../services/OrderService';
import { toast } from 'react-toastify';

const OrderManagementPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [editingOrder, setEditingOrder] = useState<Order | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    // Function to fetch orders from the API
    const fetchOrders = async () => {
        setLoading(true); // Set loading to true while fetching data
        try {
            const response = await GetOrdersService();
            if (response.success) {
                setOrders(response.data);
            } else {
                console.log(response.message || 'Failed to fetch orders');
            }
        } catch (err: any) {
            console.log(err.message || 'Failed to fetch orders');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDeleteOrder = async (orderId: string) => {
        // Call API to delete the order
        try {
            const response = await DeleteOrderByIdService(orderId);
            if (response.success) {
                toast.success('Order deleted successfully');
                setOrders(orders.filter((order) => order.id !== orderId));
            } else {
                toast.error(response.message || 'Failed to delete order');
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to fetch orders');
        }
    };

    const handleEditOrder = (order: Order) => {
        setEditingOrder(order);
    }

    return (
        <Container>
            {loading && <p>Loading orders...</p>}
            <Row>
                <Col md={12}>
                    <OrderList
                        orders={orders}
                        onDelete={handleDeleteOrder}
                        onEdit={handleEditOrder}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default OrderManagementPage;
