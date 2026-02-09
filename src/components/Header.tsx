import React, { useState, useRef, useEffect } from 'react';
import {
    Bell,
    Search,
    User,
    LogOut,
    ChevronDown,
    Shield,
    Store,
    Check,
    Settings,
    CreditCard,
    Sparkles
} from 'lucide-react';
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
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Simple breadcrumb logic
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumb = pathSegments.length > 0
        ? pathSegments.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ')
        : 'Overview';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRoleSwitch = (newRole: UserRole) => {
        if (role === newRole) return;
        switchRole(newRole);
        setIsDropdownOpen(false);
        navigate('/');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getRoleDetails = (r: UserRole) => {
        switch (r) {
            case 'SUPER_ADMIN':
                return {
                    label: 'Super Admin',
                    desc: 'Full system control & oversight',
                    icon: <Shield size={16} />
                };
            case 'VENDOR_ADMIN':
                return {
                    label: 'Vendor Admin',
                    desc: 'Manage kitchen, menu & orders',
                    icon: <Store size={16} />
                };
            case 'VENDOR_STAFF':
                return {
                    label: 'Vendor Staff',
                    desc: 'Process orders & dispatch',
                    icon: <User size={16} />
                };
            default:
                return {
                    label: r,
                    desc: 'Standard User',
                    icon: <User size={16} />
                };
        }
    };

    const currentRoleDetails = getRoleDetails(role);

    return (
        <header className="header">
            <div className="header-left">
                <h1 className="page-title">{title || (location.pathname === '/' ? 'Dashboard' : breadcrumb)}</h1>
                <div className="breadcrumb">
                    <span>Aaharly {currentRoleDetails.label}</span>
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

                <div className="profile-container" ref={dropdownRef}>
                    <div
                        className={`profile-dropdown-trigger ${isDropdownOpen ? 'active' : ''}`}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="avatar-med">{user.avatar}</div>
                        <div className="trigger-info">
                            <span className="trigger-name">{user.name}</span>
                            <span className="trigger-role">{currentRoleDetails.label}</span>
                        </div>
                        <ChevronDown size={14} className={`trigger-chevron ${isDropdownOpen ? 'rotate' : ''}`} />
                    </div>

                    {isDropdownOpen && (
                        <div className="role-switcher-dropdown">

                            {/* Header Section */}
                            <div className="dropdown-profile-header">
                                <div className="profile-header-content">
                                    <div className="avatar-large">
                                        {user.avatar}
                                        <span className="status-indicator online"></span>
                                    </div>
                                    <div className="profile-header-text">
                                        <div className="user-name-row">
                                            <h3>{user.name}</h3>
                                            <span className="role-badge">{currentRoleDetails.label}</span>
                                        </div>
                                        <span className="user-email">{role.toLowerCase().replace('_', ' ')}@aaharly.com</span>
                                    </div>
                                </div>
                            </div>

                            <div className="dropdown-scroll-area">
                                {/* Role Switcher Section */}
                                <div className="dropdown-section">
                                    <h4 className="section-title">Switch Profile</h4>
                                    <div className="role-list">
                                        {(['SUPER_ADMIN', 'VENDOR_ADMIN', 'VENDOR_STAFF'] as UserRole[]).map((r) => {
                                            const details = getRoleDetails(r);
                                            const isActive = role === r;
                                            return (
                                                <div
                                                    key={r}
                                                    className={`role-card ${isActive ? 'active' : ''}`}
                                                    onClick={() => handleRoleSwitch(r)}
                                                >
                                                    <div className="role-icon-wrapper">
                                                        {details.icon}
                                                    </div>
                                                    <div className="role-info">
                                                        <span className="role-label">{details.label}</span>
                                                        <span className="role-desc">{details.desc}</span>
                                                    </div>
                                                    {isActive && <Check size={16} className="active-check" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="dropdown-divider"></div>

                                {/* Footer Actions */}
                                <div className="dropdown-section">
                                    <button className="menu-item">
                                        <Settings size={16} />
                                        <span>Account Settings</span>
                                    </button>
                                    <button className="menu-item">
                                        <CreditCard size={16} />
                                        <span>Billing & Plans</span>
                                    </button>
                                    <button className="menu-item">
                                        <Sparkles size={16} />
                                        <span>Feature Requests</span>
                                    </button>
                                </div>
                            </div>

                            <div className="dropdown-footer">
                                <button className="logout-btn" onClick={handleLogout}>
                                    <LogOut size={16} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
