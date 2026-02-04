import React, { useState } from 'react';
import { type VendorCustomer } from '../../api/vendorClient';
import { CustomerStatusBadge } from './CustomerStatusBadge';
import { Phone, Eye, MapPin } from 'lucide-react';

interface VendorCustomerRowProps {
    customer: VendorCustomer;
    onClick: (customer: VendorCustomer) => void;
    isLaptop?: boolean; // max-width: 1200px
    isMobile?: boolean; // max-width: 768px
}

export const VendorCustomerRow: React.FC<VendorCustomerRowProps> = ({
    customer,
    onClick,
    isLaptop = false,
    isMobile = false
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Helpers
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    // Columns Configuration based on screen size
    let gridTemplate = '2fr 1.2fr 1.5fr 1fr 1.2fr 0.8fr 1fr 1fr 0.6fr'; // Desktop
    if (isLaptop) gridTemplate = '2fr 1.5fr 1fr 1fr 1fr 0.6fr'; // Laptop (hide contact, location, joined)
    if (isMobile) gridTemplate = '1fr 1fr'; // Mobile

    const styles = {
        row: {
            display: 'grid',
            gridTemplateColumns: gridTemplate,
            gap: isMobile ? '12px' : '16px',
            padding: '16px 24px',
            alignItems: 'center',
            background: isHovered ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(12px)',
            border: isHovered ? '1px solid rgba(255, 122, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '14px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            transform: isHovered ? 'translateY(-2px)' : 'none',
            boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.15)' : 'none',
        },
        // Columns
        colCustomer: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
        },
        avatar: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-accent, #FF7A00), #FF4D00)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.9rem',
            flexShrink: 0,
        },
        customerInfo: {
            display: 'flex',
            flexDirection: 'column' as const,
            minWidth: 0,
        },
        name: {
            fontWeight: 600,
            color: 'var(--color-text-primary, #fff)',
            whiteSpace: 'nowrap' as const,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        email: {
            fontSize: '0.8rem',
            color: 'var(--color-text-muted, #94a3b8)',
            whiteSpace: 'nowrap' as const,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        // Contact
        contactBadge: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary, #cbd5e1)',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '6px 10px',
            borderRadius: '8px',
        },
        // Location
        locationStack: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '2px',
        },
        addressLine: {
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
        },
        pincode: {
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--color-text-primary, #fff)',
        },
        addressText: {
            fontSize: '0.75rem',
            color: 'var(--color-text-muted, #94a3b8)',
        },
        // Category
        categoryPill: {
            display: 'inline-block',
            padding: '4px 10px',
            fontSize: '0.8rem',
            color: '#A78BFA',
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '6px',
            whiteSpace: 'nowrap' as const,
        },
        planText: {
            fontSize: '0.9rem',
            color: 'var(--color-text-primary, #fff)',
            fontWeight: 500,
        },
        mealsBadge: {
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--color-text-secondary, #cbd5e1)',
        },
        joinedDate: {
            fontSize: '0.85rem',
            color: 'var(--color-text-muted, #94a3b8)',
        },
        colActions: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
        actionBtn: {
            width: '32px',
            height: '32px',
            display: 'flex', // Corrected flex property syntax
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            background: 'transparent',
            border: '1px solid transparent',
            color: 'var(--color-text-muted, #94a3b8)',
            cursor: 'pointer',
            transition: 'all 0.2s',
        }
    };

    return (
        <div
            style={styles.row}
            onClick={() => onClick(customer)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Customer Name + Email */}
            <div style={styles.colCustomer}>
                <div style={styles.avatar}>
                    {getInitials(customer.name)}
                </div>
                <div style={styles.customerInfo}>
                    <span style={styles.name}>{customer.name}</span>
                    <span style={styles.email}>{customer.email}</span>
                </div>
            </div>

            {/* Contact - Hide on Laptop/Mobile */}
            {!isLaptop && !isMobile && (
                <div>
                    <div style={styles.contactBadge}>
                        <Phone size={12} />
                        <span>{customer.phone}</span>
                    </div>
                </div>
            )}

            {/* Location - Hide on Laptop/Mobile */}
            {!isLaptop && !isMobile && (
                <div>
                    <div style={styles.locationStack}>
                        <div style={styles.addressLine}>
                            <MapPin size={12} color="#94a3b8" />
                            <span style={styles.pincode}>{customer.pincode}</span>
                        </div>
                        <span style={styles.addressText} title={customer.address}>
                            {customer.address.length > 20 ? customer.address.substring(0, 20) + '...' : customer.address}
                        </span>
                    </div>
                </div>
            )}

            {/* Meal Category */}
            <div>
                <span style={styles.categoryPill}>{customer.subscription.category}</span>
            </div>

            {/* Plan */}
            <div>
                <span style={styles.planText}>{customer.subscription.planName}</span>
            </div>

            {/* Meals/Day */}
            {!isMobile && (
                <div>
                    <span style={styles.mealsBadge}>{customer.mealPlan.mealsPerDay} Meals</span>
                </div>
            )}

            {/* Status */}
            <div>
                <CustomerStatusBadge status={customer.subscription.status} />
            </div>

            {/* Joined - Hide on Laptop/Mobile */}
            {!isLaptop && !isMobile && (
                <div>
                    <span style={styles.joinedDate}>{formatDate(customer.createdAt)}</span>
                </div>
            )}

            {/* Actions */}
            <div style={styles.colActions}>
                <button
                    style={{ ...styles.actionBtn, background: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent', color: isHovered ? 'white' : styles.actionBtn.color }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick(customer);
                    }}
                >
                    <Eye size={16} />
                </button>
            </div>
        </div>
    );
};

