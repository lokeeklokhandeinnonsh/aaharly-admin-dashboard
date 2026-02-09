
import React from 'react';
import {
    X,
    Store,
    MapPin,
    Phone,
    Calendar,
    Activity,
    Users,
    Star,
    CheckCircle,
    ShieldAlert,
    Briefcase
} from 'lucide-react';
import { type Vendor } from '../../api/adminClient';
import './VendorDetailsDrawer.css';

interface VendorDetailsDrawerProps {
    vendor: Vendor | null;
    isOpen: boolean;
    onClose: () => void;
}

export const VendorDetailsDrawer: React.FC<VendorDetailsDrawerProps> = ({ vendor, isOpen, onClose }) => {
    // Lock body scroll when open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close on escape key
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!vendor) return null;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
            <div className={`vendor-details-drawer ${isOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <div className="vendor-header-info">
                        <div className="vendor-avatar-large">
                            {vendor.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="vendor-title-group">
                            <h2 className="vendor-full-name">{vendor.name}</h2>
                            <p className="vendor-id-badge">ID: {vendor.id.split('-')[0].toUpperCase()}</p>
                            <div className={`status-badge status-${vendor.status} mt-1`}>
                                {vendor.status}
                            </div>
                        </div>
                    </div>
                    <button className="close-drawer-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="drawer-content">
                    {/* Business Information */}
                    <div className="drawer-section">
                        <h3 className="section-title">
                            <Briefcase size={18} />
                            Business Information
                        </h3>
                        <div className="info-grid cols-2">
                            <div className="info-item">
                                <span className="info-label">Daily Capacity</span>
                                <div className="info-value-wrapper">
                                    <Activity size={16} className="info-icon" />
                                    <span className="info-value">{vendor.dailyCapacity} Meals</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Current Rating</span>
                                <div className="info-value-wrapper">
                                    <Star size={16} className="text-orange-400 fill-current" fill="orange" color="orange" />
                                    <span className="info-value">{vendor.rating.toFixed(1)} / 5.0</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Joined Date</span>
                                <div className="info-value-wrapper">
                                    <Calendar size={16} className="info-icon" />
                                    <span className="info-value">{formatDate(vendor.createdAt)}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Kitchen Type</span>
                                <div className="info-value-wrapper">
                                    <Store size={16} className="info-icon" />
                                    <span className="info-value">Cloud Kitchen</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="drawer-section">
                        <h3 className="section-title">
                            <Activity size={18} />
                            Performance
                        </h3>
                        <div className="stats-grid-card">
                            <div className="stat-card">
                                <span className="label">Active Subs</span>
                                <span className="value">{vendor.activeSubscribers}</span>
                            </div>
                            <div className="stat-card">
                                <span className="label">Total Orders</span>
                                <span className="value">{vendor.totalOrders}</span>
                            </div>
                            <div className="stat-card">
                                <span className="label">Completed</span>
                                <span className="value text-green">{(vendor.totalOrders * 0.95).toFixed(0)}</span>
                            </div>
                            <div className="stat-card">
                                <span className="label">Cancelled</span>
                                <span className="value text-red">{(vendor.totalOrders * 0.05).toFixed(0)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Address */}
                    <div className="drawer-section">
                        <h3 className="section-title">
                            <MapPin size={18} />
                            Contact & Location
                        </h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Phone Number</span>
                                <div className="info-value-wrapper">
                                    <Phone size={16} className="info-icon" />
                                    <span className="info-value">{vendor.contact || 'Not provided'}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Address</span>
                                <div className="info-value-wrapper">
                                    <MapPin size={16} className="info-icon" />
                                    <span className="info-value">{vendor.address || 'Not provided'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Areas */}
                    <div className="drawer-section">
                        <h3 className="section-title">
                            <MapPin size={18} />
                            Service Areas
                        </h3>
                        {vendor.pincodes && vendor.pincodes.length > 0 ? (
                            <div className="pincodes-grid">
                                {vendor.pincodes.map((pin) => (
                                    <span key={pin} className="pincode-pill">{pin}</span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-muted text-sm italic">No service areas assigned</span>
                        )}
                    </div>

                    {/* Vendor Users */}
                    <div className="drawer-section">
                        <h3 className="section-title">
                            <Users size={18} />
                            Team Members
                        </h3>
                        <div className="vendor-users-list">
                            {vendor.users && vendor.users.length > 0 ? (
                                vendor.users.map((user) => (
                                    <div key={user.id} className="user-list-item">
                                        <div className="user-list-info">
                                            <h4>{user.name}</h4>
                                            <p>{user.email}</p>
                                        </div>
                                        <span className="user-role-badge">{user.role}</span>
                                    </div>
                                ))
                            ) : (
                                <span className="text-muted text-sm italic">No users found</span>
                            )}
                        </div>
                    </div>

                    {/* Compliance (Placeholder) */}
                    <div className="drawer-section">
                        <h3 className="section-title">
                            <ShieldAlert size={18} />
                            Compliance
                        </h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">FSSAI License</span>
                                <div className="info-value-wrapper text-green">
                                    <CheckCircle size={16} />
                                    <span className="info-value">Verified (Active)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="drawer-footer">
                        <button className="btn-secondary w-full" onClick={() => { }}>
                            View Order History
                        </button>
                        <button className="btn-outline-danger w-full text-red" style={{ background: 'transparent', border: '1px solid #ef4444', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>
                            Deactivate Vendor
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
