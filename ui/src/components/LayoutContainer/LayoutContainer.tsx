
import React, { ReactNode } from 'react';

interface LayoutContainerProps {
    children: ReactNode;
}

const LayoutContainer: React.FC<LayoutContainerProps> = ({ children }) => {
    return (
        <div className="layout-content">
            {children}
        </div>
    );
};


export default LayoutContainer;
