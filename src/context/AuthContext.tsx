import React, { createContext, useContext, useState, type ReactNode } from 'react';

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
    login: (email: string, pass: string) => boolean;
    logout: () => void;
    switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// MOCK CREDENTIALS
const CREDENTIALS = {
    'admin@aaharly.com': { role: 'SUPER_ADMIN', pass: 'admin123', name: 'Super Admin', avatar: 'SA' },
    'vendor@aaharly.com': { role: 'VENDOR_ADMIN', pass: 'vendor123', name: 'Vendor Manager', avatar: 'VM' },
    'staff@aaharly.com': { role: 'VENDOR_STAFF', pass: 'staff123', name: 'Staff User', avatar: 'ST' },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState<UserRole>('SUPER_ADMIN');
    const [user, setUser] = useState<User>({ name: '', avatar: '', email: '' });

    const login = (email: string, pass: string) => {
        const creds = CREDENTIALS[email as keyof typeof CREDENTIALS];
        if (creds && creds.pass === pass) {
            setIsAuthenticated(true);
            setRole(creds.role as UserRole);
            setUser({ name: creds.name, avatar: creds.avatar, email });
            // Simulate receiving a token from backend
            localStorage.setItem('admin_token', 'mock_admin_token_safe_for_dev');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setRole('SUPER_ADMIN'); // Reset default
        setUser({ name: '', avatar: '', email: '' });
        localStorage.removeItem('admin_token');
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
