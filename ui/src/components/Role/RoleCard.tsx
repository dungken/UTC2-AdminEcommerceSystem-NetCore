import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card } from 'react-bootstrap';
import avatarImage from '../../assets/img/avatars/1.png';

interface RoleCardProps {
    roleId: string;
    roleName: string;
    totalUser: number;
    avatars: string[];
    onEditRole: (roleId: string) => void;
    onDeleteRole: () => void;
}


const RoleCard: React.FC<RoleCardProps> = ({ roleId, roleName, totalUser, avatars, onDeleteRole, onEditRole }) => {
    return (
        <div className="col-xl-4 col-lg-6 col-md-6">
            <Card className="h-100">
                <Card.Body>
                    <h5 className='fw-bold'>{roleName}</h5>
                    <p>Total Users: {totalUser}</p>
                    <div className="avatars">
                        {avatars.map((avatar, index) => (
                            <img key={index} src={avatar || avatarImage} alt="Avatar" width="30" className="rounded-circle" />
                        ))}
                    </div>
                    <div className="mt-2">
                        <Button variant="outline-primary" className="me-2" onClick={() => onEditRole(roleId)}>
                            Edit
                        </Button>
                        <Button variant="outline-danger" onClick={onDeleteRole}>
                            Delete
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default RoleCard;
