import React, { useState } from 'react';
import { Bell, Search, User, LogOut, ChevronDown, Shield } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';
import './Header.css';

interface HeaderProps {
    title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
    const location = useLocation();
    const { user, role, switchRole, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Simple breadcrumb logic
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumb = pathSegments.length > 0
        ? pathSegments.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ')
        : 'Overview';

    const handleRoleSwitch = (newRole: UserRole) => {
        switchRole(newRole);
        setIsDropdownOpen(false);
        // Optional: Toast message here
        navigate('/'); // Return to dashboard on role switch to avoid permission errors on current page
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-left">
                <h1 className="page-title">{title || (location.pathname === '/' ? 'Dashboard' : breadcrumb)}</h1>
                <div className="breadcrumb">
                    <span>Aaharly {role.includes('VENDOR') ? 'Vendor' : 'Admin'}</span>
                    <span className="separator">/</span>
                    <span>{breadcrumb || 'Home'}</span>
                </div>
            </div>

            <div className="header-right">
                <div className="search-bar">
                    <Search size={16} />
                    <input type="text" placeholder="Search anything..." />
                </div>

                <button className="icon-btn notification-btn">
                    <Bell size={20} />
                    <span className="badge-dot"></span>
                </button>

                <div className="profile-container" style={{ position: 'relative' }}>
                    <div
                        className="profile-dropdown-trigger"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="avatar-small">{user.avatar}</div>
                        <div className="profile-meta">
                            {/* <span className="profile-name">{user.name}</span> */}
                            {/* Name only visible on larger screens usually, keeping minimal as per design */}
                            <ChevronDown size={14} className="text-muted" />
                        </div>
                    </div>

                    {isDropdownOpen && (
                        <div className="role-dropdown-menu">
                            <div className="dropdown-header">
                                <span className="dropdown-user-name">{user.name}</span>
                                <span className="dropdown-user-email">{role.replace('_', ' ')}</span>
                            </div>
                            <div className="dropdown-divider" />
                            <div className="dropdown-section-title">Switch Role (Dev Mode)</div>

                            <button
                                className={`dropdown-item ${role === 'SUPER_ADMIN' ? 'active' : ''}`}
                                onClick={() => handleRoleSwitch('SUPER_ADMIN')}
                            >
                                <Shield size={14} /> Super Admin
                            </button>
                            <button
                                className={`dropdown-item ${role === 'VENDOR_ADMIN' ? 'active' : ''}`}
                                onClick={() => handleRoleSwitch('VENDOR_ADMIN')}
                            >
                                <User size={14} /> Vendor Admin
                            </button>
                            <button
                                className={`dropdown-item ${role === 'VENDOR_STAFF' ? 'active' : ''}`}
                                onClick={() => handleRoleSwitch('VENDOR_STAFF')}
                            >
                                <User size={14} className="opacity-75" /> Vendor Staff
                            </button>

                            <div className="dropdown-divider" />
                            <button className="dropdown-item text-danger" onClick={handleLogout}>
                                <LogOut size={14} /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
