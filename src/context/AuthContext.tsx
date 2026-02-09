import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { vendorClient } from '../api/vendorClient';

export type UserRole = 'SUPER_ADMIN' | 'OPS' | 'VENDOR_ADMIN' | 'VENDOR_STAFF';

interface User {
    name: string;
    avatar: string;
    email: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    role: UserRole;
    user: User;
    login: (email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState<UserRole>('SUPER_ADMIN');
    const [user, setUser] = useState<User>({ name: '', avatar: '', email: '' });

    const login = async (email: string, pass: string): Promise<boolean> => {
        // 1. Super Admin Mock (Keep for now as per scope)
        if (email === 'admin@aaharly.com' && pass === 'admin123') {
            setIsAuthenticated(true);
            setRole('SUPER_ADMIN');
            setUser({ name: 'Super Admin', avatar: 'SA', email });
            localStorage.setItem('admin_token', 'mock_admin_token_safe_for_dev');
            return true;
        }

        // 2. Real Vendor API Login
        try {
            const response = await vendorClient.login({ email, password: pass });
            if (response.success) {
                setIsAuthenticated(true);
                // Map API role to Context Role
                // API returns 'VENDOR', we map to 'VENDOR_ADMIN' for now as primary vendor user
                setRole('VENDOR_ADMIN');
                setUser({
                    name: response.vendor.name,
                    avatar: response.vendor.name.substring(0, 2).toUpperCase(),
                    email: response.vendor.email
                });
                localStorage.setItem('vendor_token', response.accessToken);
                return true;
            }
        } catch (err: any) {
            console.error('Vendor login failed:', err);
            throw err; // Rethrow to allow component to handle specific errors (e.g. inactive)
        }

        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setRole('SUPER_ADMIN'); // Reset default
        setUser({ name: '', avatar: '', email: '' });
        localStorage.removeItem('admin_token');
        localStorage.removeItem('vendor_token');
    };

    const switchRole = (newRole: UserRole) => {
        // In a real app this would check if user HAS that role
        setRole(newRole);
        // Determine Mock Name based on role for smoother UI
        let newName = user.name;
        let newAvatar = user.avatar;
        if (newRole === 'SUPER_ADMIN') { newName = 'Super Admin'; newAvatar = 'SA'; }
        if (newRole === 'VENDOR_ADMIN') { newName = 'Vendor Manager'; newAvatar = 'VM'; }
        if (newRole === 'VENDOR_STAFF') { newName = 'Staff User'; newAvatar = 'ST'; }
        setUser(prev => ({ ...prev, name: newName, avatar: newAvatar }));
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, user, login, logout, switchRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
