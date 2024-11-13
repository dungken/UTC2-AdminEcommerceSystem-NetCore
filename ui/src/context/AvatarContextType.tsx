import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tạo kiểu dữ liệu cho context
interface AvatarContextType {
    avatar: string | null;
    setAvatarUrl: (url: string) => void;
}

// Khởi tạo AvatarContext
const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

// Component Provider
export const AvatarProvider = ({ children }: { children: ReactNode }) => {
    const [avatar, setAvatarUrl] = useState<string | null>(null);

    return (
        <AvatarContext.Provider value={{ avatar, setAvatarUrl }}>
            {children}
        </AvatarContext.Provider>
    );
};

// Hook để sử dụng AvatarContext
export const useAvatar = (): AvatarContextType => {
    const context = useContext(AvatarContext);
    if (!context) {
        throw new Error("useAvatar must be used within an AvatarProvider");
    }
    return context;
};
