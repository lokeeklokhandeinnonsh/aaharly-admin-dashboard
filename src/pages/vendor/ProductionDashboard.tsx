import React, { useState, useEffect } from 'react';
import {
    Calendar,
    RefreshCw,
    ChevronRight,
    TrendingUp,
    AlertTriangle,
    Truck,
    Package
} from 'lucide-react';
import { vendorClient } from '../../services/vendorClient';
import type { DashboardSummary } from '../../services/vendorClient';

export const ProductionDashboard: React.FC = () => {
    const [dateRange] = useState('Today, Jan 11');
    const [width, setWidth] = useState(window.innerWidth);
    const [hoveredKpi, setHoveredKpi] = useState<number | null>(null);
    const [data, setData] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const summary = await vendorClient.getDashboardSummary();
            setData(summary);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch dashboard summary:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // 1 min poll
        return () => clearInterval(interval);
    }, []);

    const isLaptop = width <= 1024;
    const isMobile = width <= 768;

    // Helper for KPI styling
    const getKpiColor = (color: string) => {
        switch (color) {
            case 'blue': return '#3B82F6';
            case 'green': return '#10B981';
            case 'orange': return '#F97316';
            case 'purple': return '#8B5CF6';
            case 'red': return '#EF4444';
            default: return '#3B82F6';
        }
    };

    const styles = {
        page: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '2rem',
            padding: isMobile ? '1rem' : '1.5rem',
            animation: 'fadeIn 0.5s ease-out',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '1rem',
            flexWrap: 'wrap' as const,
            gap: '1rem',
        },
        title: {
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'white',
            marginBottom: '0.25rem',
            letterSpacing: '-0.02em',
        },
        subtitle: {
            fontSize: '0.95rem',
            color: 'var(--color-text-muted, rgba(255,255,255,0.6))',
            margin: 0,
        },
        headerControls: {
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
        },
        dateSelector: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.6rem 1.2rem',
            borderRadius: '9999px',
            color: 'white',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
        },
        btnIconGlass: {
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            color: 'var(--color-text-secondary, #cbd5e1)',
            cursor: 'pointer',
            transition: 'all 0.2s',
        },
        // KPI Row
        kpiRow: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
        },
        kpiCard: (_color: string, index: number) => ({
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '1.25rem',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column' as const,
            position: 'relative' as const,
            overflow: 'hidden',
            transition: 'transform 0.2s',
            transform: hoveredKpi === index ? 'translateY(-3px)' : 'none',
        }),
        kpiLabel: {
            fontSize: '0.8rem',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
            color: 'var(--color-text-muted, rgba(255,255,255,0.6))',
            marginBottom: '0.5rem',
            fontWeight: 600,
        },
        kpiValue: {
            fontSize: '2.2rem',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1,
        },
        kpiHint: (type: 'good' | 'bad' | 'warn') => ({
            fontSize: '0.75rem',
            color: type === 'good' ? '#10B981' : type === 'bad' ? '#EF4444' : '#F59E0B',
            marginTop: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
        }),
        statusBarTiny: (color: string) => ({
            position: 'absolute' as const,
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: getKpiColor(color),
        }),
        // Section Panel
        sectionPanel: {
            padding: '1.5rem',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column' as const,
        },
        panelHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
        },
        panelTitle: {
            fontSize: '1.1rem',
            color: 'white',
            fontWeight: 600,
            margin: 0,
        },
        // Progress
        progressTrack: {
            height: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            position: 'relative' as const,
            display: 'flex',
            margin: '2rem 0 1rem',
        },
        progressSegment: (color: string, width: string, isFirst: boolean, isLast: boolean) => ({
            height: '100%',
            width,
            background: color === 'done' ? '#10B981' : color === 'prep' ? '#3B82F6' : 'transparent',
            borderTopLeftRadius: isFirst ? '6px' : 0,
            borderBottomLeftRadius: isFirst ? '6px' : 0,
            borderTopRightRadius: isLast ? '6px' : 0,
            borderBottomRightRadius: isLast ? '6px' : 0,
            position: 'relative' as const,
        }),
        milestoneMarker: (left: string) => ({
            position: 'absolute' as const,
            top: '-30px',
            left,
            transform: 'translateX(-50%)',
            background: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.25rem 0.75rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
            color: 'white',
            whiteSpace: 'nowrap' as const,
        }),
        markerTriangle: {
            position: 'absolute' as const,
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            borderWidth: '6px 6px 0',
            borderStyle: 'solid',
            borderColor: 'rgba(255, 255, 255, 0.1) transparent transparent transparent',
        },
        legend: {
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '0.5rem',
            flexWrap: 'wrap' as const,
        },
        legendItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8rem',
            color: '#cbd5e1',
        },
        // Main Grid
        mainGrid: {
            display: 'grid',
            gridTemplateColumns: isLaptop ? '1fr' : '2fr 1fr',
            gap: '1.5rem',
        },
        col: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '1.5rem',
        },
        // Table
        table: {
            width: '100%',
            borderCollapse: 'collapse' as const,
        },
        th: {
            textAlign: 'left' as const,
            padding: '1rem',
            fontSize: '0.75rem',
            textTransform: 'uppercase' as const,
            color: 'var(--color-text-muted, rgba(255,255,255,0.6))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        },
        td: {
            padding: '1rem',
            fontSize: '0.9rem',
            color: 'white',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        },
        chip: (status: string) => {
            let bg = 'rgba(249, 115, 22, 0.1)', color = '#F97316';
            if (status === 'Completed' || status === 'Active') { bg = 'rgba(16, 185, 129, 0.1)'; color = '#34D399'; }
            if (status === 'In Progress' || status === 'Pending') { bg = 'rgba(59, 130, 246, 0.1)'; color = '#60A5FA'; }
            if (status === 'Delayed') { bg = 'rgba(239, 68, 68, 0.1)'; color = '#F87171'; }
            // Correction for blue active
            if (status === 'Active') { bg = 'rgba(59, 130, 246, 0.1)'; color = '#60A5FA'; }

            return {
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                background: bg,
                color: color,
                whiteSpace: 'nowrap' as const,
            };
        },
        btnSmAction: {
            background: 'transparent',
            color: 'var(--color-accent, #FF7A18)',
            border: '1px solid var(--color-accent, #FF7A18)',
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
        },
        // Alerts
        alertList: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '0.75rem',
        },
        alertItem: (type: string) => ({
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
            padding: '1rem',
            borderRadius: '12px',
            fontSize: '0.9rem',
            background: type === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `1px solid ${type === 'critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
        }),
        alertAction: (type: string) => ({
            display: 'inline-block',
            marginTop: '0.5rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            textDecoration: 'underline',
            cursor: 'pointer',
            color: type === 'critical' ? '#F87171' : '#FBBF24',
        }),
        // Dispatch
        dispatchGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            marginBottom: '1rem',
        },
        dispatchItem: {
            background: 'rgba(0,0,0,0.2)',
            padding: '0.75rem',
            borderRadius: '8px',
            textAlign: 'center' as const,
        },
        // Inventory
        invItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        },
        barBg: {
            width: '60px',
            height: '4px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '2px',
            margin: '0 0.5rem',
        },
        loadingState: {
            display: 'flex',
            justifyContent: 'center',
            padding: '3rem',
            color: 'rgba(255,255,255,0.5)'
        }
    };

    if (loading) return <div style={styles.loadingState}>Loading dashboard...</div>;
    if (error) return <div style={styles.loadingState}>{error}</div>;
    if (!data) return <div style={styles.loadingState}>No data available</div>;

    const { kpi, productionBreakdown, dispatchReadiness, inventorySnapshot } = data;
    const completeness = Math.round((kpi.prepared / kpi.planned) * 100) || 0;

    const handleGenerate = async () => {
        try {
            setLoading(true);
            await vendorClient.generateDailyBatches();
            await fetchData(); // Refresh data
        } catch (err) {
            console.error('Failed to generate batches:', err);
            setError('Failed to generate batches');
            setLoading(false);
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
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Daily Operations</h2>
                    <p style={styles.subtitle}>Today's Kitchen & Dispatch Overview</p>
                </div>
                <div style={styles.headerControls}>
                    <button
                        onClick={handleGenerate}
                        style={{
                            ...styles.btnIconGlass,
                            width: 'auto',
                            padding: '0 1rem',
                            gap: '0.5rem',
                            fontSize: '0.9rem',
                            borderRadius: '9999px',
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: '#60A5FA',
                            border: '1px solid rgba(59, 130, 246, 0.3)'
                        }}
                        title="Generate Today's Batches"
                    >
                        <RefreshCw size={16} /> Generate Batches
                    </button>
                    <div style={styles.dateSelector}>
                        <Calendar size={16} />
                        <span>{dateRange}</span>
                        <ChevronRight size={14} />
                    </div>
                    <button onClick={fetchData} style={styles.btnIconGlass} title="Refresh Data">
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* 1. KPI Summary Row */}
            <div style={styles.kpiRow}>
                {[
                    { l: 'Meals Planned', v: kpi.planned, c: 'blue', h: null },
                    { l: 'Meals Prepared', v: kpi.prepared, c: 'green', h: { t: 'good', i: <TrendingUp size={12} />, tx: `${completeness}% Complete` } },
                    { l: 'Remaining', v: kpi.remaining, c: 'orange', h: { t: 'warn', i: null, tx: 'Target: 4:00 PM' } },
                    { l: 'Ready for Dispatch', v: kpi.dispatchReady, c: 'purple', h: null },
                    { l: 'Delayed Batches', v: kpi.delayed, c: 'red', h: { t: 'bad', i: <AlertTriangle size={12} />, tx: 'Action Needed' } }
                ].map((k, idx) => (
                    <div
                        key={idx}
                        style={styles.kpiCard(k.c, idx)}
                        onMouseEnter={() => setHoveredKpi(idx)}
                        onMouseLeave={() => setHoveredKpi(null)}
                    >
                        <span style={styles.kpiLabel}>{k.l}</span>
                        <span style={styles.kpiValue}>{k.v}</span>
                        {k.h && (
                            <span style={styles.kpiHint(k.h.t as any)}>
                                {k.h.i} {k.h.tx}
                            </span>
                        )}
                        <div style={styles.statusBarTiny(k.c)}></div>
                    </div>
                ))}
            </div>

            {/* 2. Progress Overview */}
            <div style={styles.sectionPanel}>
                <div style={styles.panelHeader}>
                    <h3 style={styles.panelTitle}>Today's Progress</h3>
                    <span style={styles.subtitle}>Cutoff: 5:00 PM</span>
                </div>
                <div style={styles.progressTrack}>
                    <div style={styles.progressSegment('done', `${completeness}%`, true, false)}></div>
                    {/* Simplified progress bar for now */}
                    <div style={styles.progressSegment('bg', `${100 - completeness}%`, false, true)}></div>

                    {[
                        { l: '20%', t: '10 AM' },
                        { l: '50%', t: '1 PM' },
                        { l: '80%', t: '4 PM' }
                    ].map((m, i) => (
                        <div key={i} style={styles.milestoneMarker(m.l)}>
                            {m.t}
                            <div style={styles.markerTriangle}></div>
                        </div>
                    ))}
                </div>
                <div style={styles.legend}>
                    <div style={styles.legendItem}>
                        <div style={{ width: 10, height: 10, background: '#10B981', borderRadius: 2 }}></div> Completed
                    </div>
                    <div style={styles.legendItem}>
                        <div style={{ width: 10, height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}></div> Remaining
                    </div>
                </div>
            </div>

            {/* Main Content Split */}
            <div style={styles.mainGrid}>
                {/* Left Column */}
                <div style={styles.col}>
                    {/* 3. Meal Production Breakdown */}
                    <div style={styles.sectionPanel}>
                        <div style={styles.panelHeader}>
                            <h3 style={styles.panelTitle}>Meal Production Breakdown</h3>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Meal Name</th>
                                        <th style={{ ...styles.th, textAlign: 'center' }}>Plan</th>
                                        <th style={{ ...styles.th, textAlign: 'center' }}>Done</th>
                                        <th style={{ ...styles.th, textAlign: 'center' }}>Rem</th>
                                        <th style={{ ...styles.th, textAlign: 'right' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productionBreakdown.map(m => (
                                        <tr key={m.mealId}>
                                            <td style={styles.td}>{m.mealName}</td>
                                            <td style={{ ...styles.td, textAlign: 'center', fontWeight: 'bold' }}>{m.plan}</td>
                                            <td style={{ ...styles.td, textAlign: 'center', color: '#10B981' }}>{m.done}</td>
                                            <td style={{ ...styles.td, textAlign: 'center', color: m.remaining > 0 ? '#F97316' : '#64748b' }}>{m.remaining}</td>
                                            <td style={{ ...styles.td, textAlign: 'right' }}>
                                                <span style={styles.chip(m.status)}>
                                                    {m.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 4. Kitchen Prep Status - Placeholder for now as integration is on separate page */}
                    {/* Could import the table from KitchenPrepPage if needed, or just link to it */}
                </div>

                {/* Right Column */}
                <div style={styles.col}>
                    {/* Dispatch Readiness */}
                    <div style={styles.sectionPanel}>
                        <div style={styles.panelHeader}>
                            <h3 style={styles.panelTitle}>Dispatch Readiness</h3>
                            <Truck size={18} className="text-muted" style={{ color: 'rgba(255,255,255,0.6)' }} />
                        </div>
                        <div style={styles.dispatchGrid}>
                            <div style={styles.dispatchItem}>
                                <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 700, color: '#10B981' }}>{dispatchReadiness.ready}</span>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Ready</span>
                            </div>
                            <div style={styles.dispatchItem}>
                                <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 700, color: '#F59E0B' }}>{dispatchReadiness.pending}</span>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Pending Prep</span>
                            </div>
                        </div>
                        {dispatchReadiness.alertMessage && (
                            <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.85rem', color: '#FCA5A5' }}>
                                <span style={{ fontWeight: 'bold' }}>Warning:</span> {dispatchReadiness.alertMessage}
                            </div>
                        )}
                    </div>

                    {/* Inventory Snapshot */}
                    <div style={styles.sectionPanel}>
                        <div style={styles.panelHeader}>
                            <h3 style={styles.panelTitle}>Inventory Snapshot</h3>
                            <Package size={18} className="text-muted" style={{ color: 'rgba(255,255,255,0.6)' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {inventorySnapshot.map(inv => (
                                <div key={inv.key} style={styles.invItem}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>{inv.name}</div>
                                        <span style={{ fontSize: '0.75rem', color: inv.status === 'critical' ? '#EF4444' : '#64748b' }}>
                                            {inv.remaining} Remaining
                                        </span>
                                    </div>
                                    <div style={styles.barBg}>
                                        <div
                                            style={{
                                                height: '100%',
                                                borderRadius: '2px',
                                                width: `${inv.percent}%`,
                                                background: inv.status === 'critical' ? '#EF4444' : '#10B981'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }}>
                            Request Replenishment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


