import React, { useState, useEffect } from 'react';
import {
    AlertTriangle,
    Plus,
    History,
    Search,
    ArrowDownCircle,
    ArrowUpCircle
} from 'lucide-react';

const MOCK_INVENTORY = [
    { id: 1, name: 'Basmati Rice', unit: 'kg', stock: 120, min: 50, status: 'ok' },
    { id: 2, name: 'Chicken Breast', unit: 'kg', stock: 12, min: 20, status: 'low' },
    { id: 3, name: 'Broccoli', unit: 'kg', stock: 5, min: 8, status: 'low' },
    { id: 4, name: 'Olive Oil', unit: 'L', stock: 45, min: 10, status: 'ok' },
    { id: 5, name: 'Packaging Containers', unit: 'units', stock: 2500, min: 500, status: 'ok' },
];

export const InventoryPage: React.FC = () => {
    // In a real app, useAuth() to check if VENDOR_ADMIN (can log waste/request) vs STAFF (log usage)
    const [width, setWidth] = useState(window.innerWidth);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isLaptop = width <= 1024;
    const isMobile = width <= 768;

    const styles = {
        page: {
            padding: isMobile ? '1rem' : '1.5rem',
            animation: 'fadeIn 0.5s ease-out',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2rem',
            flexWrap: 'wrap' as const,
            gap: '1rem',
        },
        titleSection: {
            marginBottom: isMobile ? '0.5rem' : 0,
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'white',
            margin: '0 0 0.25rem 0',
        },
        subtitle: {
            color: 'var(--color-text-muted, rgba(255,255,255,0.6))',
            fontSize: '0.9rem',
            margin: 0,
        },
        actionButtons: {
            display: 'flex',
            gap: '0.75rem',
        },
        btnWastage: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '0.875rem',
        },
        btnRequest: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'var(--color-accent, #FF7A18)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '0.875rem',
        },
        alertBanner: {
            marginBottom: '1.5rem',
            padding: '1rem',
            background: 'rgba(249, 115, 22, 0.1)',
            border: '1px solid rgba(249, 115, 22, 0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap' as const,
            gap: '1rem',
        },
        alertContent: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
        },
        alertIcon: {
            color: '#F97316',
        },
        alertTitle: {
            color: 'white',
            fontWeight: 600,
            fontSize: '0.95rem',
            margin: 0,
        },
        alertText: {
            color: '#FDBA74',
            fontSize: '0.85rem',
            margin: 0,
        },
        btnViewItems: {
            color: '#F97316',
            fontWeight: 600,
            fontSize: '0.85rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: isLaptop ? '1fr' : '2fr 1fr',
            gap: '1.5rem',
        },
        // Table
        tableContainer: {
            overflow: 'hidden',
        },
        tableHeader: {
            padding: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        tableTitle: {
            color: 'white',
            fontWeight: 600,
            margin: 0,
        },
        searchWrapper: {
            position: 'relative' as const,
        },
        searchIcon: {
            position: 'absolute' as const,
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted, rgba(255,255,255,0.6))',
        },
        searchInput: {
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            borderRadius: '9999px',
            padding: '0.4rem 1rem 0.4rem 2.2rem',
            color: 'white',
            fontSize: '0.85rem',
            outline: 'none',
            minWidth: isMobile ? '120px' : '200px',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse' as const,
        },
        th: {
            padding: '1rem',
            textAlign: 'left' as const,
            background: 'rgba(255, 255, 255, 0.02)',
            color: 'var(--color-text-muted, rgba(255,255,255,0.6))',
            fontSize: '0.75rem',
            textTransform: 'uppercase' as const,
            fontWeight: 600,
        },
        td: {
            padding: '1rem',
            color: 'white',
            fontSize: '0.9rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        },
        row: (hover: boolean) => ({
            background: hover ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
            transition: 'background 0.2s',
        }),
        statusBadge: (status: string) => {
            const isLow = status === 'low';
            return {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: isLow ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: isLow ? '#F87171' : '#34D399',
                border: isLow ? '1px solid rgba(239, 68, 68, 0.1)' : '1px solid rgba(16, 185, 129, 0.1)',
            };
        },
        unit: {
            color: 'var(--color-text-secondary, #cbd5e1)',
            fontSize: '0.75rem',
            marginLeft: '0.25rem',
        },
        btnLogUsage: {
            background: 'none',
            border: 'none',
            color: 'var(--color-accent, #FF7A18)',
            fontWeight: 600,
            fontSize: '0.75rem',
            cursor: 'pointer',
        },
        // Side Panel
        sidePanel: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '1.5rem',
        },
        summaryCard: {
            padding: '1.25rem',
        },
        summaryHeader: {
            color: 'white',
            marginBottom: '1rem',
            fontSize: '1rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        },
        summaryItem: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '8px',
            marginBottom: '0.75rem',
        },
        summaryIconBox: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
        },
        iconBg: (color: 'blue' | 'green') => ({
            padding: '0.5rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: color === 'blue' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            color: color === 'blue' ? '#60A5FA' : '#34D399',
        }),
        summaryLabel: {
            fontSize: '0.75rem',
            color: 'var(--color-text-muted, rgba(255,255,255,0.6))',
            display: 'block',
        },
        summaryValue: {
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'white',
            display: 'block',
        },
        // History
        historyList: {
            position: 'relative' as const,
            paddingLeft: '0.5rem',
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '1rem',
        },
        historyLine: {
            position: 'absolute' as const,
            left: '0.4rem',
            top: '0.5rem',
            bottom: '0.5rem',
            width: '2px',
            background: 'rgba(255, 255, 255, 0.1)',
        },
        historyItem: {
            position: 'relative' as const,
            paddingLeft: '1.5rem',
        },
        historyDot: {
            position: 'absolute' as const,
            left: 0,
            top: '0.35rem',
            width: '10px',
            height: '10px',
            background: '#475569',
            border: '2px solid rgba(15, 23, 42, 1)', // Using dark background color to simulate border cutout
            borderRadius: '50%',
            zIndex: 1,
        },
        historyText: {
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary, #cbd5e1)',
            marginBottom: '0.2rem',
            margin: 0,
        },
        highlight: {
            color: 'white',
            fontWeight: 500,
        },
        time: {
            fontSize: '0.75rem',
            color: 'var(--color-text-muted, rgba(255,255,255,0.6))',
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
            <div style={styles.header}>
                <div style={styles.titleSection}>
                    <h2 style={styles.title}>Inventory Management</h2>
                    <p style={styles.subtitle}>Real-time stock levels and usage logging.</p>
                </div>
                <div style={styles.actionButtons}>
                    <button
                        style={styles.btnWastage}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                    >
                        <AlertTriangle size={18} /> Log Wastage
                    </button>
                    <button
                        style={styles.btnRequest}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                        <Plus size={18} /> Request Stock
                    </button>
                </div>
            </div>

            {/* Low Stock Alert Banner */}
            <div style={styles.alertBanner}>
                <div style={styles.alertContent}>
                    <AlertTriangle style={styles.alertIcon} />
                    <div>
                        <h4 style={styles.alertTitle}>Low Stock Alert</h4>
                        <p style={styles.alertText}>2 items are below minimum quantity. Replenishment recommended.</p>
                    </div>
                </div>
                <button style={styles.btnViewItems}>View Items</button>
            </div>

            <div style={styles.grid}>
                <div className="main-column">
                    {/* Inventory List */}
                    <div className="glass-panel" style={styles.tableContainer}>
                        <div style={styles.tableHeader}>
                            <h3 style={styles.tableTitle}>Current Stock</h3>
                            <div style={styles.searchWrapper}>
                                <Search size={14} style={styles.searchIcon} />
                                <input
                                    type="text"
                                    placeholder="Search item..."
                                    style={styles.searchInput}
                                />
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Item Name</th>
                                        <th style={styles.th}>Status</th>
                                        <th style={{ ...styles.th, textAlign: 'right' }}>Current Stock</th>
                                        <th style={{ ...styles.th, textAlign: 'right' }}>Min. Level</th>
                                        <th style={{ ...styles.th, textAlign: 'right' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MOCK_INVENTORY.map((item) => (
                                        <tr
                                            key={item.id}
                                            style={styles.row(hoveredRow === item.id)}
                                            onMouseEnter={() => setHoveredRow(item.id)}
                                            onMouseLeave={() => setHoveredRow(null)}
                                        >
                                            <td style={styles.td}>{item.name}</td>
                                            <td style={styles.td}>
                                                <span style={styles.statusBadge(item.status)}>
                                                    {item.status === 'low' ? 'Low Stock' : 'Adequate'}
                                                </span>
                                            </td>
                                            <td style={{ ...styles.td, textAlign: 'right' }}>{item.stock} <span style={styles.unit}>{item.unit}</span></td>
                                            <td style={{ ...styles.td, textAlign: 'right' }}>{item.min}</td>
                                            <td style={{ ...styles.td, textAlign: 'right' }}>
                                                <button
                                                    style={styles.btnLogUsage}
                                                    onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-accent, #FF7A18)'}
                                                >
                                                    Log Usage
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div style={styles.sidePanel}>
                    {/* Quick Stats */}
                    <div className="glass-panel" style={styles.summaryCard}>
                        <h3 style={styles.summaryHeader}>Daily Summary</h3>
                        <div>
                            <div style={styles.summaryItem}>
                                <div style={styles.summaryIconBox}>
                                    <div style={styles.iconBg('blue')}>
                                        <ArrowDownCircle size={18} />
                                    </div>
                                    <div className="summary-text">
                                        <span style={styles.summaryLabel}>Stock Used</span>
                                        <span style={styles.summaryValue}>45 Items</span>
                                    </div>
                                </div>
                            </div>
                            <div style={styles.summaryItem}>
                                <div style={styles.summaryIconBox}>
                                    <div style={styles.iconBg('green')}>
                                        <ArrowUpCircle size={18} />
                                    </div>
                                    <div className="summary-text">
                                        <span style={styles.summaryLabel}>Restocked</span>
                                        <span style={styles.summaryValue}>12 Items</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="glass-panel" style={styles.summaryCard}>
                        <h3 style={styles.summaryHeader}>
                            <History size={16} className="text-muted" style={{ marginRight: '0.5rem' }} /> Recent Logs
                        </h3>
                        <div style={styles.historyList}>
                            {/* Timeline line */}
                            <div style={styles.historyLine}></div>

                            {[1, 2, 3].map(i => (
                                <div key={i} style={styles.historyItem}>
                                    <div style={styles.historyDot}></div>
                                    <p style={styles.historyText}>Logged <span style={styles.highlight}>5kg Chicken</span> usage.</p>
                                    <span style={styles.time}>10:30 AM • by Staff John</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

