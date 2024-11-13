import React, { useState } from 'react';
import { Form, Button, Col, Row, Table } from 'react-bootstrap';

interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    id: string;
    customer: string;
    products: Product[];
    status: string;
}

interface OrderFormProps {
    onSave: (order: Order) => void;
    order?: Order;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSave, order }) => {
    const [customer, setCustomer] = useState(order?.customer || '');
    const [products, setProducts] = useState<Product[]>(order?.products || []);
    const [status, setStatus] = useState(order?.status || 'Pending');

    const handleProductChange = (id: string, key: keyof Product, value: any) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === id ? { ...product, [key]: value } : product
            )
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newOrder: Order = { id: order?.id || Date.now().toString(), customer, products, status };
        onSave(newOrder);
    };

    return (
        <div className="container mt-5">
            <h2>{order ? 'Edit Order' : 'Create New Order'}</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="customer">
                    <Form.Label>Customer</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter customer name"
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="status">
                    <Form.Label>Order Status</Form.Label>
                    <Form.Control
                        as="select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                    </Form.Control>
                </Form.Group>

                <h4>Products</h4>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        value={product.quantity}
                                        onChange={(e) =>
                                            handleProductChange(product.id, 'quantity', parseInt(e.target.value))
                                        }
                                    />
                                </td>
                                <td>{product.price}</td>
                                <td>{product.quantity * product.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button variant="primary" type="submit">
                    Save Order
                </Button>
            </Form>
        </div>
    );
};

export default OrderForm;
