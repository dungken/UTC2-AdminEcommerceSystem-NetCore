import React, { useEffect, useState } from 'react';
import { Card, Badge, Row, Col, Spinner, ListGroup, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { GetUserByIdService } from '../../services/UserService';
import { FaEnvelope, FaPhone, FaCheckCircle, FaTimesCircle, FaUser, FaUserTag, FaBirthdayCake, FaMapMarkerAlt } from 'react-icons/fa';

const UserInfo: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<any>(null);
    const [roles, setRoles] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getUserData = async () => {
            try {
                if (userId) {
                    const response = await GetUserByIdService(userId);
                    if (response.success) {
                        setUser(response.data.user);
                        setRoles(response.data.roles);
                    } else {
                        console.error(response.message || 'Failed to fetch user data');
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getUserData();
    }, [userId]);

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p>Loading user data...</p>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container className="text-center py-5">
                <p>User data not found.</p>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white text-center">
                    <h4>
                        <FaUser className="me-2" />
                        {user.firstName} {user.lastName}
                    </h4>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={6}>
                            <p>
                                <strong><FaBirthdayCake className="me-2 text-secondary" />Date of Birth:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}
                            </p>
                            <p>
                                <strong><FaEnvelope className="me-2 text-secondary" />Email:</strong> {user.email}{' '}
                                {user.isEmailVerified ? (
                                    <Badge bg="success">Verified</Badge>
                                ) : (
                                    <Badge bg="danger">Not Verified</Badge>
                                )}
                            </p>
                            <p>
                                <strong><FaPhone className="me-2 text-secondary" />Phone:</strong> {user.phoneNumber}{' '}
                                {user.isPhoneNumberVerified ? (
                                    <Badge bg="success">Verified</Badge>
                                ) : (
                                    <Badge bg="danger">Not Verified</Badge>
                                )}
                            </p>
                        </Col>
                        <Col md={6}>
                            <p>
                                <strong><FaMapMarkerAlt className="me-2 text-secondary" />Address:</strong> {user.fullAddress}
                            </p>
                            <p>
                                <strong>Status:</strong>{' '}
                                <Badge bg={user.status === 'Active' ? 'success' : 'secondary'}>{user.status}</Badge>
                            </p>
                            <p>
                                <strong><FaUserTag className="me-2 text-secondary" />Roles:</strong>{' '}
                                {roles.length > 0 ? roles.join(', ') : 'No roles assigned'}
                            </p>
                        </Col>
                    </Row>
                    <hr />
                    <ListGroup>
                        <ListGroup.Item>
                            <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}
                        </ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UserInfo;
