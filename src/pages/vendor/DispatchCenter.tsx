import React, { useState, useEffect } from 'react';
import {
    Truck,
    MapPin,
    CheckCircle,
    Phone,
    RefreshCw
} from 'lucide-react';
import { vendorClient } from '../../services/vendorClient';
import type { DispatchOrder } from '../../services/vendorClient';

export const DispatchCenter: React.FC = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const [hoveredTask, setHoveredTask] = useState<string | null>(null);
    const [orders, setOrders] = useState<DispatchOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // const { token } = useAuth(); // Token handled by vendorClient directly via localStorage for now

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await vendorClient.getDispatchOrders();
            setOrders(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch dispatch orders:', err);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, []);

    const handleStatusUpdate = async (orderId: string, status: 'READY_TO_DISPATCH' | 'HANDED_OVER') => {
        try {
            await vendorClient.updateDispatchStatus(orderId, status);
            // Optimistic update
            setOrders(prev => prev.map(o =>
                o.orderId === orderId
                    ? { ...o, status: status }
                    : o
            ));
        } catch (err) {
            console.error('Failed to update status:', err);
            alert('Failed to update status');
            fetchOrders(); // Revert on error
        }
    };

    const isMobile = width <= 768;

    // Helpers for styles
    const getStatusColors = (status: string) => {
        switch (status) {
            case 'READY_TO_DISPATCH': return { border: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', text: '#34D399', badgeBorder: 'rgba(16, 185, 129, 0.2)' };
            case 'HANDED_OVER': return { border: '#059669', bg: 'rgba(5, 150, 105, 0.1)', text: '#059669', badgeBorder: 'rgba(5, 150, 105, 0.2)' };
            case 'DELIVERED': return { border: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', text: '#60A5FA', badgeBorder: 'rgba(59, 130, 246, 0.2)' };
            case 'PENDING': return { border: '#EAB308', bg: 'rgba(234, 179, 8, 0.1)', text: '#FBBF24', badgeBorder: 'rgba(234, 179, 8, 0.2)' };
            default: return { border: '#9ca3af', bg: 'rgba(156, 163, 175, 0.1)', text: '#9ca3af', badgeBorder: 'rgba(156, 163, 175, 0.2)' };
        }
    };

    const styles = {
        container: {
            padding: '1.5rem',
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
        title: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 0.25rem 0',
        },
        subtitle: {
            color: 'var(--color-text-muted, rgba(255,255,255,0.6))',
            margin: 0,
        },
        statsContainer: {
            display: 'flex',
            gap: '1rem',
        },
        statCard: {
            padding: '0.5rem 1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            textAlign: 'center' as const,
            minWidth: '80px',
        },
        statValue: {
            display: 'block',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'white',
        },
        statLabel: {
            fontSize: '0.8rem',
            color: 'var(--color-text-muted, rgba(255,255,255,0.6))',
        },
        timeline: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '1rem',
        },
        cardWrapper: (id: string) => ({
            position: 'relative' as const,
            transition: 'transform 0.2s',
            transform: hoveredTask === id ? 'translateX(4px)' : 'none',
        }),
        card: (status: string, id: string) => {
            const colors = getStatusColors(status);
            const isHover = hoveredTask === id;
            return {
                padding: '1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                background: isHover ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: isMobile ? 'flex-start' : 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                borderLeft: `4px solid ${colors.border}`,
                flexDirection: isMobile ? 'column' as const : 'row' as const,
                gap: isMobile ? '1rem' : '0',
            };
        },
        cardLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            width: isMobile ? '100%' : 'auto',
        },
        timeSlot: {
            textAlign: 'center' as const,
            minWidth: '100px',
        },
        time: {
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'white',
            marginBottom: '0.25rem',
        },
        statusLabel: (status: string) => {
            const colors = getStatusColors(status);
            return {
                display: 'inline-block',
                fontSize: '0.65rem',
                textTransform: 'uppercase' as const,
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                border: `1px solid ${colors.badgeBorder}`,
                color: colors.text,
                background: colors.bg,
            };
        },
        divider: {
            width: '1px',
            height: '40px',
            background: 'rgba(255, 255, 255, 0.15)',
            display: isMobile ? 'none' : 'block',
        },
        orderDetails: {
            display: 'flex',
            flexDirection: 'column' as const,
            maxWidth: '400px',
        },
        orderTitle: {
            color: 'white',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
            margin: 0,
        },
        mealCount: {
            fontSize: '0.75rem',
            fontWeight: 400,
            color: 'var(--color-text-muted, rgba(255,255,255,0.6))',
        },
        address: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary, #cbd5e1)',
            marginTop: '0.25rem',
        },
        cardActions: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'flex-end' : 'flex-start',
        },
        btnHandover: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s',
        },
        btnReady: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s',
        },
        btnCall: {
            padding: '0.5rem',
            color: 'var(--color-text-muted, rgba(255,255,255,0.6))',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
        },
        loadingState: {
            display: 'flex',
            justifyContent: 'center',
            padding: '3rem',
            color: 'rgba(255,255,255,0.5)'
        }
    };

    const readyCount = orders.filter(o => o.status === 'READY_TO_DISPATCH').length;
    const pendingCount = orders.filter(o => o.status === 'PENDING' || o.status === 'PREPARING').length;

    return (
        <div style={styles.container}>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Dispatch Center</h2>
                    <p style={styles.subtitle}>Manage handovers and delivery partners.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={fetchOrders} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <RefreshCw size={18} />
                    </button>
                    <div style={styles.statsContainer}>
                        <div style={styles.statCard}>
                            <span style={styles.statValue}>{readyCount}</span>
                            <span style={styles.statLabel}>Ready</span>
                        </div>
                        <div style={styles.statCard}>
                            <span style={styles.statValue}>{pendingCount}</span>
                            <span style={styles.statLabel}>Pending</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline View */}
            <div style={styles.timeline}>
                {loading ? (
                    <div style={styles.loadingState}>Loading dispatch orders...</div>
                ) : error ? (
                    <div style={styles.loadingState}>{error}</div>
                ) : orders.length === 0 ? (
                    <div style={styles.loadingState}>No orders for today.</div>
                ) : (
                    orders.map(task => (
                        <div
                            key={task.orderId}
                            style={styles.cardWrapper(task.orderId)}
                            onMouseEnter={() => setHoveredTask(task.orderId)}
                            onMouseLeave={() => setHoveredTask(null)}
                        >
                            <div style={styles.card(task.status, task.orderId)}>
                                <div style={styles.cardLeft}>
                                    <div style={styles.timeSlot}>
                                        <span style={styles.time}>{task.slot}</span>
                                        <span style={styles.statusLabel(task.status)}>
                                            {task.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>

                                    <div style={styles.divider}></div>

                                    <div style={styles.orderDetails}>
                                        <h4 style={styles.orderTitle}>
                                            {task.customerName}
                                            <span style={styles.mealCount}>({task.mealName})</span>
                                        </h4>
                                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                                            {task.planName} • {task.type}
                                        </div>
                                        <div style={styles.address}>
                                            <MapPin size={14} /> {task.customerAddress} ({task.pincode})
                                        </div>
                                    </div>
                                </div>

                                <div style={styles.cardActions}>
                                    {task.status === 'READY_TO_DISPATCH' ? (
                                        <button
                                            style={styles.btnHandover}
                                            onClick={() => handleStatusUpdate(task.orderId, 'HANDED_OVER')}
                                        >
                                            <CheckCircle size={16} /> Handover Complete
                                        </button>
                                    ) : task.status === 'HANDED_OVER' ? (
                                        <span style={{ color: '#059669', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <CheckCircle size={16} /> Dispatched
                                        </span>
                                    ) : task.status === 'DELIVERED' ? (
                                        <span style={{ color: '#3B82F6', fontWeight: 600, fontSize: '0.9rem' }}>
                                            Delivered
                                        </span>
                                    ) : (
                                        <button
                                            style={styles.btnReady}
                                            onClick={() => handleStatusUpdate(task.orderId, 'READY_TO_DISPATCH')}
                                        >
                                            <Truck size={16} /> Mark Ready
                                        </button>
                                    )}
                                    {task.customerPhone && (
                                        <a
                                            href={`tel:${task.customerPhone}`}
                                            style={styles.btnCall}
                                            title="Call Customer"
                                        >
                                            <Phone size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

