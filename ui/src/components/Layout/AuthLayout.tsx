// src/components/Layout/AuthLayout.tsx
import React from 'react';

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