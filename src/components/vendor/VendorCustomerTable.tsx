import React, { useState, useEffect } from 'react';
import { type VendorCustomer } from '../../api/vendorClient';
import { VendorCustomerRow } from './VendorCustomerRow';
import { Users } from 'lucide-react';

interface VendorCustomerTableProps {
    customers: VendorCustomer[];
    isLoading: boolean;
    onViewCustomer: (customer: VendorCustomer) => void;
}

export const VendorCustomerTable: React.FC<VendorCustomerTableProps> = ({ customers, isLoading, onViewCustomer }) => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isLaptop = width <= 1200;
    const isMobile = width <= 768;

    // Grid Template Logic
    let gridTemplate = '2fr 1.2fr 1.5fr 1fr 1.2fr 0.8fr 1fr 1fr 0.6fr'; // Desktop
    if (isLaptop) gridTemplate = '2fr 1.5fr 1fr 1fr 1fr 0.6fr'; // Laptop
    if (isMobile) gridTemplate = '1fr 1fr'; // Mobile

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '12px',
            width: '100%',
        },
        header: {
            display: isMobile ? 'none' : 'grid',
            gridTemplateColumns: gridTemplate,
            gap: '16px',
            padding: '14px 24px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
            alignItems: 'center',
        },
        thCell: {
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-text-secondary, #cbd5e1)',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
        },
        list: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '12px',
        },
        // Skeleton
        skeletonRow: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '14px',
            animation: 'pulse 1.5s infinite',
        },
        emptyState: {
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            color: 'var(--color-text-muted, #94a3b8)',
            textAlign: 'center' as const,
        },
        emptyIcon: {
            opacity: 0.5,
            marginBottom: '1rem',
        }
    };

    if (isLoading) {
        return (
            <div style={styles.list}>
                <style>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                `}</style>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="glass-panel" style={styles.skeletonRow}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                            <div style={{ height: 16, width: '30%', background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}></div>
                            <div style={{ height: 12, width: '20%', background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (customers.length === 0) {
        return (
            <div style={styles.emptyState}>
                <Users size={48} style={styles.emptyIcon} />
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-primary, #fff)' }}>No customers found</h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Try adjusting your filters or search.</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Table Header */}
            {!isMobile && (
                <div className="glass-panel" style={styles.header}>
                    <span style={styles.thCell}>Customer</span>
                    {/* Hide columns based on view mode (Laptop hides Contact, Location, Joined) */}
                    {!isLaptop && <span style={styles.thCell}>Contact</span>}
                    {!isLaptop && <span style={styles.thCell}>Location</span>}

                    <span style={styles.thCell}>Category</span>
                    <span style={styles.thCell}>Plan</span>
                    <span style={styles.thCell}>Meals/Day</span>
                    <span style={styles.thCell}>Status</span>

                    {!isLaptop && <span style={styles.thCell}>Joined</span>}
                    <span style={{ ...styles.thCell, textAlign: 'right' }}>Actions</span>
                </div>
            )}

            {/* Table Body */}
            <div style={styles.list}>
                {customers.map((customer, index) => (
                    <VendorCustomerRow
                        key={customer.id || `customer-${index}`}
                        customer={customer}
                        onClick={onViewCustomer}
                        isLaptop={isLaptop}
                        isMobile={isMobile}
                    />
                ))}
            </div>
        </div>
    );
};

