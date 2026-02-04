import React, { useState, useEffect } from 'react';
import {
    Truck,
    MapPin,
    CheckCircle,
    Phone
} from 'lucide-react';

const DELIVERY_TASKS = [
    { id: 'ORD-1209', time: '12:30 PM', address: 'Plot 45, Indiranagar, BLR', status: 'ready', items: 3 },
    { id: 'ORD-1215', time: '01:00 PM', address: 'Tech Park, Whitefield', status: 'pending', items: 5 },
    { id: 'ORD-1233', time: '01:15 PM', address: 'Apartment 402, Koramangala', status: 'delayed', items: 2 },
];

export const DispatchCenter: React.FC = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const [hoveredTask, setHoveredTask] = useState<string | null>(null);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = width <= 768;

    // Helpers for styles
    const getStatusColors = (status: string) => {
        switch (status) {
            case 'ready': return { border: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', text: '#34D399', badgeBorder: 'rgba(16, 185, 129, 0.2)' };
            case 'delayed': return { border: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', text: '#F87171', badgeBorder: 'rgba(239, 68, 68, 0.2)' };
            case 'pending': return { border: '#EAB308', bg: 'rgba(234, 179, 8, 0.1)', text: '#FBBF24', badgeBorder: 'rgba(234, 179, 8, 0.2)' };
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
            width: '80px',
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
        },
        orderDetails: {
            display: 'flex',
            flexDirection: 'column' as const,
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
        }
    };

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
                <div style={styles.statsContainer}>
                    <div style={styles.statCard}>
                        <span style={styles.statValue}>12</span>
                        <span style={styles.statLabel}>Ready</span>
                    </div>
                    <div style={styles.statCard}>
                        <span style={styles.statValue}>05</span>
                        <span style={styles.statLabel}>Pending</span>
                    </div>
                </div>
            </div>

            {/* Timeline View */}
            <div style={styles.timeline}>
                {DELIVERY_TASKS.map(task => (
                    <div
                        key={task.id}
                        style={styles.cardWrapper(task.id)}
                        onMouseEnter={() => setHoveredTask(task.id)}
                        onMouseLeave={() => setHoveredTask(null)}
                    >
                        <div style={styles.card(task.status, task.id)}>
                            <div style={styles.cardLeft}>
                                <div style={styles.timeSlot}>
                                    <span style={styles.time}>{task.time}</span>
                                    <span style={styles.statusLabel(task.status)}>
                                        {task.status}
                                    </span>
                                </div>

                                <div style={styles.divider}></div>

                                <div style={styles.orderDetails}>
                                    <h4 style={styles.orderTitle}>
                                        {task.id}
                                        <span style={styles.mealCount}>({task.items} meals)</span>
                                    </h4>
                                    <div style={styles.address}>
                                        <MapPin size={14} /> {task.address}
                                    </div>
                                </div>
                            </div>

                            <div style={styles.cardActions}>
                                {task.status === 'ready' ? (
                                    <button
                                        style={styles.btnHandover}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#047857'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#059669'}
                                    >
                                        <CheckCircle size={16} /> Handover Complete
                                    </button>
                                ) : (
                                    <button
                                        style={styles.btnReady}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                                    >
                                        <Truck size={16} /> Mark Ready
                                    </button>
                                )}
                                <button
                                    style={styles.btnCall}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = 'var(--color-text-muted, rgba(255,255,255,0.6))';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    }}
                                >
                                    <Phone size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

