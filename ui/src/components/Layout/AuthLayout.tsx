// src/components/Layout/AuthLayout.tsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    return (
        <div className="authentication-wrapper authentication-basic container-p-y">
            <div className="authentication-inner">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;