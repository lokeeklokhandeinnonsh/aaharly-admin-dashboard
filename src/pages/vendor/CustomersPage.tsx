import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, Users, Filter, RefreshCw } from 'lucide-react';
import { vendorClient, type VendorCustomer } from '../../api/vendorClient';
import { VendorCustomerTable } from '../../components/vendor/VendorCustomerTable';
import toast, { Toaster } from 'react-hot-toast';

export const CustomersPage: React.FC = () => {
    const [customers, setCustomers] = useState<VendorCustomer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [term, setTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [refreshHover, setRefreshHover] = useState(false);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        setIsLoading(true);
        try {
            const data = await vendorClient.getCustomers();
            setCustomers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load customers');
        } finally {
            setIsLoading(false);
        }
    };

    const stats = useMemo(() => {
        const total = customers.length;
        const active = customers.filter(c => c.subscription.status === 'active').length;
        const paused = customers.filter(c => c.subscription.status === 'paused').length;
        const expired = customers.filter(c => c.subscription.status === 'expired').length;
        return { total, active, paused, expired };
    }, [customers]);

    const filteredCustomers = useMemo(() => {
        return customers.filter(c => {
            const searchMatch =
                c.name.toLowerCase().includes(term.toLowerCase()) ||
                c.email.toLowerCase().includes(term.toLowerCase()) ||
                c.phone.includes(term);

            const statusMatch = statusFilter === 'All' || c.subscription.status === statusFilter.toLowerCase();
            const categoryMatch = categoryFilter === 'All' || c.subscription.category === categoryFilter;

            return searchMatch && statusMatch && categoryMatch;
        });
    }, [customers, term, statusFilter, categoryFilter]);

    const handleExport = () => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1000)),
            {
                loading: 'Exporting...',
                success: 'Exported successfully!',
                error: 'Export failed'
            }
        );
    };

    // Styles
    const styles = {
        page: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '24px',
            padding: '24px',
            height: '100%',
            animation: 'fadeIn 0.5s ease-out',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '8px',
            flexWrap: 'wrap' as const,
            gap: '16px',
        },
        title: {
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--color-text-primary, #fff)',
            marginBottom: '4px',
            marginTop: 0,
        },
        subtitle: {
            fontSize: '0.95rem',
            color: 'var(--color-text-secondary, #cbd5e1)',
            margin: 0,
        },
        headerActions: {
            display: 'flex',
            gap: '12px',
        },
        btnRefresh: {
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            background: refreshHover ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: refreshHover ? 'var(--color-text-primary, #fff)' : 'var(--color-text-secondary, #cbd5e1)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
        },
        btnSecondary: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0 16px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--color-text-primary, #fff)',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
        },
        statsRow: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
        },
        statsCard: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(12px)',
        },
        statsIconWrapper: (color: string) => ({
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: color === 'blue' ? 'rgba(59, 130, 246, 0.1)' :
                color === 'green' ? 'rgba(34, 197, 94, 0.1)' :
                    'rgba(249, 115, 22, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color === 'blue' ? '#3b82f6' :
                color === 'green' ? '#22c55e' :
                    '#f97316',
        }),
        statsInfo: {
            display: 'flex',
            flexDirection: 'column' as const,
        },
        statsLabel: {
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary, #cbd5e1)',
            marginBottom: '4px',
        },
        statsValue: {
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--color-text-primary, #fff)',
        },
        controlsRow: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '16px 20px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '14px',
            flexWrap: 'wrap' as const,
        },
        searchWrapper: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '8px 12px',
            flex: 1,
            maxWidth: '400px',
        },
        searchInput: {
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '0.9rem',
            width: '100%',
            outline: 'none',
        },
        filtersGroup: {
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap' as const,
        },
        filterSelect: {
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '8px 12px',
            color: 'var(--color-text-secondary, #cbd5e1)',
            fontSize: '0.9rem',
            outline: 'none',
            cursor: 'pointer',
        },
        option: {
            background: '#0f172a',
            color: 'white',
        }
    };

    return (
        <div style={styles.page}>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            <Toaster position="top-right" />

            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>My Customers</h2>
                    <p style={styles.subtitle}>Manage your assigned customers and subscriptions.</p>
                </div>
                <div style={styles.headerActions}>
                    <button
                        style={styles.btnRefresh}
                        onClick={loadCustomers}
                        title="Refresh Data"
                        onMouseEnter={() => setRefreshHover(true)}
                        onMouseLeave={() => setRefreshHover(false)}
                    >
                        <RefreshCw size={18} />
                    </button>
                    <button style={styles.btnSecondary} onClick={handleExport}>
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div style={styles.statsRow}>
                <div style={styles.statsCard} className="glass-panel">
                    <div style={styles.statsIconWrapper('blue')}>
                        <Users size={24} />
                    </div>
                    <div style={styles.statsInfo}>
                        <span style={styles.statsLabel}>Total Assigned</span>
                        <div style={styles.statsValue}>{stats.total}</div>
                    </div>
                </div>

                <div style={styles.statsCard} className="glass-panel">
                    <div style={styles.statsIconWrapper('green')}>
                        <Filter size={24} />
                    </div>
                    <div style={styles.statsInfo}>
                        <span style={styles.statsLabel}>Active Plans</span>
                        <div style={styles.statsValue}>{stats.active}</div>
                    </div>
                </div>

                <div style={styles.statsCard} className="glass-panel">
                    <div style={styles.statsIconWrapper('orange')}>
                        <Users size={24} />
                    </div>
                    <div style={styles.statsInfo}>
                        <span style={styles.statsLabel}>Paused</span>
                        <div style={styles.statsValue}>{stats.paused}</div>
                    </div>
                </div>
            </div>

            {/* Filters Area */}
            <div style={styles.controlsRow}>
                <div style={styles.searchWrapper}>
                    <Search color="rgba(255,255,255,0.4)" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, phone..."
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>

                <div style={styles.filtersGroup}>
                    <select
                        style={styles.filterSelect}
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option style={styles.option} value="All">All Categories</option>
                        <option style={styles.option} value="Fat Loss">Fat Loss</option>
                        <option style={styles.option} value="Balance">Balance</option>
                        <option style={styles.option} value="Muscle Gain">Muscle Gain</option>
                    </select>

                    <select
                        style={styles.filterSelect}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option style={styles.option} value="All">All Status</option>
                        <option style={styles.option} value="active">Active</option>
                        <option style={styles.option} value="paused">Paused</option>
                        <option style={styles.option} value="expired">Expired</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <VendorCustomerTable
                customers={filteredCustomers}
                isLoading={isLoading}
                onViewCustomer={(c) => console.log('View customer', c)}
            />
        </div>
    );
};

