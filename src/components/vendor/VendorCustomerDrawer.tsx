
import React, { useEffect } from 'react';
import {
    X,
    User,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    ShoppingBag
} from 'lucide-react';
import { type VendorCustomer } from '../../api/vendorClient';
import { getSubscription } from '../../utils/vendorUtils';
import './VendorCustomerDrawer.css';

interface VendorCustomerDrawerProps {
    customer: VendorCustomer | null;
    isOpen: boolean;
    onClose: () => void;
}

export const VendorCustomerDrawer: React.FC<VendorCustomerDrawerProps> = ({ customer, isOpen, onClose }) => {
    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Escape listener
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!customer) return null;

    const sub = getSubscription(customer);
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getInitials = (name: string) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';
    };

    const styles = {
        deliveryCard: {
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '8px',
        },
        deliveryHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '0.9rem',
            color: '#e2e8f0',
            fontWeight: 500,
        },
        badge: {
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#cbd5e1',
        },
        addressRow: {
            display: 'flex',
            gap: '8px',
            fontSize: '0.85rem',
            color: '#94a3b8',
            marginTop: '4px',
        }
    };

    // Group deliveries
    const groupedDeliveries = {
        Today: [] as any[],
        Tomorrow: [] as any[],
        Upcoming: [] as any[]
    };

    customer.deliveries?.forEach(d => {
        const date = new Date(d.date);
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            groupedDeliveries.Today.push(d);
        } else if (date.toDateString() === tomorrow.toDateString()) {
            groupedDeliveries.Tomorrow.push(d);
        } else {
            groupedDeliveries.Upcoming.push(d);
        }
    });

    return (
        <>
            <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
            <div className={`vendor-customer-drawer ${isOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <div className="customer-header-info">
                        <div className="customer-avatar-large">
                            {getInitials(customer.name)}
                        </div>
                        <div className="customer-title-group">
                            <h2 className="customer-full-name">{customer.name || 'Unknown User'}</h2>
                            <p className="customer-id-badge">ID: {customer.id?.split('-')[0].toUpperCase() || 'N/A'}</p>
                            {sub ? (
                                <div className={`status-badge status-${sub.status} mt-1`}>
                                    {sub.status?.toUpperCase()}
                                </div>
                            ) : (
                                <span className="text-muted text-sm mt-1">No Active Plan</span>
                            )}
                        </div>
                    </div>
                    <button className="close-drawer-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="drawer-content">
                    {/* Account Info */}
                    <div className="drawer-section">
                        <h3 className="section-title">
                            <User size={18} />
                            Account Information
                        </h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Email Address</span>
                                <div className="info-value-wrapper">
                                    <Mail size={16} className="info-icon" />
                                    <span className="info-value">{customer.email || 'Not provided'}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Phone Number</span>
                                <div className="info-value-wrapper">
                                    <Phone size={16} className="info-icon" />
                                    <span className="info-value">{customer.mobile || 'Not provided'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Info */}
                    <div className="drawer-section">
                        <h3 className="section-title">
                            <CreditCard size={18} />
                            Subscription Plan
                        </h3>
                        {sub ? (
                            <div className="card-bg">
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Current Plan</span>
                                        <div className="info-value-wrapper">
                                            <ShoppingBag size={16} className="info-icon text-orange" />
                                            <span className="info-value font-bold">{sub.planName}</span>
                                        </div>
                                    </div>
                                    <div className="info-grid cols-2 mt-1">
                                        <div className="info-item">
                                            <span className="info-label">Start Date</span>
                                            <span className="info-value text-sm">{formatDate(sub.startDate)}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">End Date</span>
                                            <span className="info-value text-sm">{formatDate(sub.endDate)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="card-bg">
                                <span className="text-muted italic">No active subscription found.</span>
                            </div>
                        )}
                    </div>

                    {/* Scheduled Deliveries */}
                    <div className="drawer-section">
                        <h3 className="section-title">
                            <MapPin size={18} />
                            Scheduled Deliveries
                        </h3>

                        {(['Today', 'Tomorrow', 'Upcoming'] as const).map(group => (
                            groupedDeliveries[group].length > 0 && (
                                <div key={group} style={{ marginBottom: '16px' }}>
                                    <h4 style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {group}
                                    </h4>
                                    {groupedDeliveries[group].map((d: any) => (
                                        <div key={d.id} style={styles.deliveryCard}>
                                            <div style={styles.deliveryHeader}>
                                                <span>{d.mealType?.toUpperCase()} - {d.category}</span>
                                                <span style={styles.badge}>{d.status}</span>
                                            </div>
                                            <div style={styles.addressRow}>
                                                <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                                                <div>
                                                    <div style={{ color: '#fff' }}>{d.address?.type?.toUpperCase()} - {d.address?.pincode}</div>
                                                    <div style={{ fontSize: '0.8rem' }}>{d.address?.address}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        ))}

                        {!customer.deliveries?.length && (
                            <div className="card-bg">
                                <span className="text-muted italic">No upcoming deliveries scheduled.</span>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="drawer-footer" style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <button className="btn-secondary w-full" style={{ padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
                            View Order History
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
