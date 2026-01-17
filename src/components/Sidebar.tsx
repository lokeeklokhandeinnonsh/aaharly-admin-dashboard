import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    Users,
    Shield,
    Store,
    CreditCard,
    Utensils,
    List,
    ShoppingBag,
    BarChart2,
    Settings,
    ChevronDown,
    ChevronRight,
    Truck,
    ClipboardList,
    Package,
    Activity
} from 'lucide-react';
import { useAuth, type UserRole } from '../context/AuthContext';
import './Sidebar.css';

interface NavItem {
    icon: React.ElementType;
    label: string;
    path: string;
    allowedRoles?: UserRole[];
}

interface NavGroup {
    title: string;
    allowedRoles: UserRole[]; // Who can see this group
    items: NavItem[];
}

const ALL_ROLES: UserRole[] = ['SUPER_ADMIN', 'OPS', 'VENDOR_ADMIN', 'VENDOR_STAFF'];
const INTERNAL_ONLY: UserRole[] = ['SUPER_ADMIN', 'OPS'];
const VENDOR_ONLY: UserRole[] = ['VENDOR_ADMIN', 'VENDOR_STAFF'];

const navGroups: NavGroup[] = [
    {
        title: 'Overview',
        allowedRoles: ALL_ROLES,
        items: [
            { icon: Home, label: 'Dashboard', path: '/' },
        ]
    },
    {
        title: 'Management',
        allowedRoles: INTERNAL_ONLY,
        items: [
            { icon: Users, label: 'All Users', path: '/users' },
            { icon: Shield, label: 'Admins', path: '/admins' },
            { icon: Store, label: 'Vendors', path: '/vendors' },
        ]
    },
    {
        title: 'Vendor Team',
        allowedRoles: VENDOR_ONLY,
        items: [
            { icon: Users, label: 'My Staff', path: '/vendor/staff' },
        ]
    },
    {
        title: 'Subscriptions',
        allowedRoles: ALL_ROLES, // Vendors see read-only view
        items: [
            { icon: CreditCard, label: 'Plans & Subs', path: '/subscriptions' },
        ]
    },
    {
        title: 'Production',
        allowedRoles: VENDOR_ONLY,
        items: [
            { icon: Utensils, label: 'Daily Production', path: '/vendor/production' },
            { icon: ClipboardList, label: 'Kitchen Prep', path: '/vendor/kitchen' },
        ]
    },
    {
        title: 'Content & Food',
        allowedRoles: INTERNAL_ONLY,
        items: [
            { icon: Utensils, label: 'Meals', path: '/meals' },
            { icon: List, label: 'Categories', path: '/categories' },
            { icon: ShoppingBag, label: 'Offers', path: '/offers' },
            { icon: ShoppingBag, label: 'Orders', path: '/orders' },
        ]
    },
    {
        title: 'Operations',
        allowedRoles: VENDOR_ONLY,
        items: [
            { icon: Truck, label: 'Dispatch Center', path: '/vendor/dispatch' },
            { icon: Package, label: 'Inventory', path: '/vendor/inventory' },
            { icon: Activity, label: 'QA & Safety', path: '/vendor/qa' },
        ]
    },
    {
        title: 'System',
        allowedRoles: ALL_ROLES,
        items: [
            { icon: BarChart2, label: 'Reports', path: '/reports', allowedRoles: ALL_ROLES },
            { icon: Settings, label: 'Settings', path: '/settings', allowedRoles: INTERNAL_ONLY },
        ]
    }
];

export const Sidebar: React.FC = () => {
    const { role, user } = useAuth();

    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        'Overview': true,
        'Management': true,
        'Subscriptions': true,
        'Production': true,
        'Content & Food': false,
        'Operations': false,
        'System': true,
        'Vendor Team': true
    });

    const toggleGroup = (title: string) => {
        setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }));
    };

    // Filter groups
    const visibleGroups = navGroups.map(group => {
        // Check if group is allowed
        if (!group.allowedRoles.includes(role)) return null;

        // Filter items within the group
        const visibleItems = group.items.filter(item =>
            !item.allowedRoles || item.allowedRoles.includes(role)
        );

        if (visibleItems.length === 0) return null;

        return { ...group, items: visibleItems };
    }).filter(Boolean);

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-container">
                    <img src="/logo.svg" alt="Aaharly" className="logo-img" />
                    <span className="logo-text">{role.includes('VENDOR') ? 'Vendor' : 'Admin'}</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {visibleGroups.map((group) => {
                    if (!group) return null;
                    return (
                        <div key={group.title} className="nav-group">
                            <div
                                className="nav-group-header"
                                onClick={() => toggleGroup(group.title)}
                            >
                                <span>{group.title}</span>
                                {openGroups[group.title] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </div>

                            {openGroups[group.title] && (
                                <div className="nav-group-items">
                                    {group.items.map((item) => (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                        >
                                            <item.icon size={18} />
                                            <span>{item.label}</span>
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile-mini">
                    <div className="avatar">{user.avatar}</div>
                    <div className="info">
                        <span className="name">{user.name}</span>
                        <span className="role">{role.replace('_', ' ')}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};
