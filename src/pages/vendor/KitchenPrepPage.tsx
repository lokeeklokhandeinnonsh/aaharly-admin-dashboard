import React, { useState, useEffect } from 'react';
import {
    Users,
    Utensils,
    CheckSquare,
    AlertCircle,
    RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { vendorClient } from '../../services/vendorClient';
import type { KitchenBatch } from '../../services/vendorClient';

export const KitchenPrepPage: React.FC = () => {
    const { role } = useAuth();
    const isManager = role === 'VENDOR_ADMIN';
    const [hoveredTask, setHoveredTask] = useState<string | null>(null);
    const [batches, setBatches] = useState<KitchenBatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const data = await vendorClient.getDailyProduction();
            setBatches(data.batches);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch kitchen batches:', err);
            setError('Failed to load kitchen tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches();
        const interval = setInterval(fetchBatches, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkComplete = async (batchId: string) => {
        if (!batchId) return;
        try {
            await vendorClient.updateBatchStatus(batchId, 'COMPLETED');
            setBatches(prev => prev.map(b => b.id === batchId ? { ...b, status: 'COMPLETED' } : b));
        } catch (err) {
            console.error('Failed to update batch:', err);
            alert('Status update failed');
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'COMPLETED': return { color: '#34D399', bg: 'rgba(16, 185, 129, 0.1)' };
            case 'IN_PROGRESS': return { color: '#60A5FA', bg: 'rgba(59, 130, 246, 0.1)' };
            default: return { color: '#94A3B8', bg: 'rgba(51, 65, 85, 0.3)' }; // PENDING
        }
    };

    const styles = {
        page: {
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
        alertPill: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.75rem',
            background: 'rgba(234, 179, 8, 0.1)',
            color: '#EAB308',
            border: '1px solid rgba(234, 179, 8, 0.2)',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
        },
        card: (isHover: boolean) => ({
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'space-between',
            minHeight: '200px',
            background: isHover ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s',
            transform: isHover ? 'translateY(-4px)' : 'none',
        }),
        cardTop: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '0.5rem',
        },
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        stationLabel: {
            fontSize: '0.75rem',
            color: 'var(--color-text-muted, rgba(255,255,255,0.6))',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
            fontWeight: 600,
        },
        statusBadge: (status: string) => {
            const s = getStatusStyles(status);
            return {
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                color: s.color,
                background: s.bg,
            };
        },
        prepTitle: {
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'white',
            margin: '0 0 0.25rem 0',
            lineHeight: 1.3,
        },
        meta: {
            display: 'flex',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary, #cbd5e1)',
            marginTop: '0.5rem',
        },
        metaItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
        },
        actions: {
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            marginTop: 'auto',
            paddingTop: '1rem',
            display: 'flex',
            gap: '0.5rem',
        },
        btnSecondary: {
            flex: 1,
            padding: '0.4rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'white',
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background 0.2s',
        },
        btnGhost: {
            flex: 1,
            padding: '0.4rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--color-accent, #FF7A18)',
            background: 'transparent',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background 0.2s',
        },
        btnPrimary: {
            width: '100%',
            padding: '0.5rem',
            background: 'var(--color-accent, #FF7A18)',
            color: 'white',
            fontWeight: 600,
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
        },
        loadingState: {
            gridColumn: '1 / -1',
            textAlign: 'center' as const,
            padding: '3rem',
            color: 'rgba(255,255,255,0.5)'
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
                <div className="title-section">
                    <h2 style={styles.title}>Kitchen Prep</h2>
                    <p style={styles.subtitle}>
                        {isManager ? 'Monitor station status and reassign staff.' : 'Your assigned tasks for today.'}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={fetchBatches} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <RefreshCw size={18} />
                    </button>
                    {isManager && (
                        <div className="header-actions">
                            <span style={styles.alertPill}>
                                <AlertCircle size={14} /> Live
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div style={styles.grid}>
                {loading ? (
                    <div style={styles.loadingState}>Loading production batches...</div>
                ) : error ? (
                    <div style={styles.loadingState}>{error}</div>
                ) : batches.length === 0 ? (
                    <div style={styles.loadingState}>No production batches generated yet.</div>
                ) : (
                    batches.map(task => (
                        <div
                            key={task.id || task.mealId}
                            style={styles.card(hoveredTask === (task.id || task.mealId))}
                            onMouseEnter={() => setHoveredTask(task.id || task.mealId)}
                            onMouseLeave={() => setHoveredTask(null)}
                        >
                            <div style={styles.cardTop}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.stationLabel}>Batch #{task.id?.substring(0, 6) || 'N/A'}</span>
                                    <span style={styles.statusBadge(task.status)}>
                                        {task.status}
                                    </span>
                                </div>
                                <h3 style={styles.prepTitle}>{task.mealName}</h3>
                                <div style={styles.meta}>
                                    <span style={styles.metaItem}><Utensils size={14} /> {task.completedQuantity} / {task.targetQuantity} units</span>
                                    {isManager && (
                                        <span style={styles.metaItem}><Users size={14} /> auto-assigned</span>
                                    )}
                                </div>
                            </div>

                            <div style={styles.actions}>
                                {task.status !== 'COMPLETED' ? (
                                    <button
                                        style={styles.btnPrimary}
                                        onClick={() => task.id && handleMarkComplete(task.id)}
                                        disabled={!task.id}
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                    >
                                        <CheckSquare size={16} /> Mark Complete
                                    </button>
                                ) : (
                                    <div style={{ ...styles.btnPrimary, background: '#10B981' }}>
                                        <CheckSquare size={16} /> Done
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

