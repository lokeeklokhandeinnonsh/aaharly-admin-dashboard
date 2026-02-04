import React, { useState, useEffect } from 'react';
import {
    Calendar,
    RefreshCw,
    ChevronRight,
    TrendingUp,
    AlertTriangle,
    Clock,
    Truck,
    Package,
    AlertOctagon
} from 'lucide-react';

// --- MOCK DATA ---
const KPI_DATA = {
    planned: 450,
    prepared: 312,
    remaining: 138,
    dispatchReady: 280,
    delayed: 2
};

const MEAL_BREAKDOWN = [
    { id: 101, name: 'Keto Chicken Salad', plan: 120, done: 120, rem: 0, status: 'Completed' },
    { id: 102, name: 'Vegan Buddha Bowl', plan: 85, done: 60, rem: 25, status: 'In Progress' },
    { id: 103, name: 'Grilled Fish & Veg', plan: 100, done: 90, rem: 10, status: 'In Progress' },
    { id: 104, name: 'Protein Smoothie', plan: 145, done: 42, rem: 103, status: 'Derived' },
];

const PREP_STATUS = [
    { id: 'B-001', meal: 'Vegan Buddha Bowl', staff: 'Sarah J.', start: '10:00 AM', status: 'Active', delay: null },
    { id: 'B-002', meal: 'Grilled Fish', staff: 'Mike T.', start: '09:30 AM', status: 'Delayed', delay: 'Ingredient Shortage' },
    { id: 'B-003', meal: 'Protein Smoothie', staff: 'Unassigned', start: '-', status: 'Pending', delay: null },
];

const INVENTORY_SNAPSHOT = [
    { key: 'raw_chicken', name: 'Raw Chicken', open: '50kg', used: '35kg', rem: '15kg', status: 'ok', percent: 30 },
    { key: 'kale', name: 'Fresh Kale', open: '20kg', used: '18kg', rem: '2kg', status: 'critical', percent: 10 },
    { key: 'avocado', name: 'Avocados', open: '100u', used: '40u', rem: '60u', status: 'ok', percent: 60 },
];

const ALERTS = [
    { id: 1, type: 'critical', msg: 'Kale stock critical (2kg left). Restock needed for dinner.', action: 'Request Stock' },
    { id: 2, type: 'warn', msg: 'Batch B-002 is delayed by 20 mins.', action: 'View Batch' },
];

export const ProductionDashboard: React.FC = () => {
    const [dateRange] = useState('Today, Jan 11');
    const [width, setWidth] = useState(window.innerWidth);
    const [hoveredKpi, setHoveredKpi] = useState<number | null>(null);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
        kpiCard: (color: string, index: number) => ({
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
                    <div style={styles.dateSelector}>
                        <Calendar size={16} />
                        <span>{dateRange}</span>
                        <ChevronRight size={14} />
                    </div>
                    <button style={styles.btnIconGlass} title="Refresh Data">
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* 1. KPI Summary Row */}
            <div style={styles.kpiRow}>
                {[
                    { l: 'Meals Planned', v: KPI_DATA.planned, c: 'blue', h: null },
                    { l: 'Meals Prepared', v: KPI_DATA.prepared, c: 'green', h: { t: 'good', i: <TrendingUp size={12} />, tx: '69% Complete' } },
                    { l: 'Remaining', v: KPI_DATA.remaining, c: 'orange', h: { t: 'warn', i: null, tx: 'Target: 4:00 PM' } },
                    { l: 'Ready for Dispatch', v: KPI_DATA.dispatchReady, c: 'purple', h: null },
                    { l: 'Delayed Batches', v: KPI_DATA.delayed, c: 'red', h: { t: 'bad', i: <AlertTriangle size={12} />, tx: 'Action Needed' } }
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
                    <div style={styles.progressSegment('done', '40%', true, false)}></div>
                    <div style={styles.progressSegment('prep', '29%', false, false)}></div>
                    <div style={styles.progressSegment('bg', '31%', false, true)}></div>

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
                        <div style={{ width: 10, height: 10, background: '#10B981', borderRadius: 2 }}></div> Dispatched
                    </div>
                    <div style={styles.legendItem}>
                        <div style={{ width: 10, height: 10, background: '#3B82F6', borderRadius: 2 }}></div> Prepared
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
                                    {MEAL_BREAKDOWN.map(m => (
                                        <tr key={m.id}>
                                            <td style={styles.td}>{m.name}</td>
                                            <td style={{ ...styles.td, textAlign: 'center', fontWeight: 'bold' }}>{m.plan}</td>
                                            <td style={{ ...styles.td, textAlign: 'center', color: '#10B981' }}>{m.done}</td>
                                            <td style={{ ...styles.td, textAlign: 'center', color: m.rem > 0 ? '#F97316' : '#64748b' }}>{m.rem}</td>
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

                    {/* 4. Kitchen Prep Status */}
                    <div style={styles.sectionPanel}>
                        <div style={styles.panelHeader}>
                            <h3 style={styles.panelTitle}>Active Batches & Prep</h3>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Batch ID</th>
                                        <th style={styles.th}>Meal</th>
                                        <th style={styles.th}>Staff</th>
                                        <th style={styles.th}>Start Time</th>
                                        <th style={styles.th}>Status</th>
                                        <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {PREP_STATUS.map(batch => (
                                        <tr key={batch.id}>
                                            <td style={{ ...styles.td, fontFamily: 'monospace', color: '#94a3b8' }}>{batch.id}</td>
                                            <td style={styles.td}>
                                                {batch.meal}
                                                {batch.delay && <div style={{ fontSize: '0.75rem', color: '#EF4444' }}>{batch.delay}</div>}
                                            </td>
                                            <td style={styles.td}>{batch.staff}</td>
                                            <td style={styles.td}>{batch.start}</td>
                                            <td style={styles.td}>
                                                <span style={styles.chip(batch.status)}>
                                                    {batch.status}
                                                </span>
                                            </td>
                                            <td style={{ ...styles.td, textAlign: 'right' }}>
                                                <button
                                                    style={styles.btnSmAction}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#FF7A18'; e.currentTarget.style.color = 'white'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FF7A18'; }}
                                                >
                                                    Manage
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div style={styles.col}>
                    {/* Alerts */}
                    <div style={{ ...styles.sectionPanel, borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                        <div style={styles.panelHeader}>
                            <h3 style={{ ...styles.panelTitle, color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlertOctagon size={18} /> Action Required
                            </h3>
                        </div>
                        <div style={styles.alertList}>
                            {ALERTS.map(alert => (
                                <div key={alert.id} style={styles.alertItem(alert.type)}>
                                    <div style={{ paddingTop: '2px' }}>
                                        {alert.type === 'critical' ? <AlertTriangle size={16} color="#EF4444" /> : <Clock size={16} color="#F59E0B" />}
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)' }}>{alert.msg}</p>
                                        <span style={styles.alertAction(alert.type)}>{alert.action} &rarr;</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dispatch Readiness */}
                    <div style={styles.sectionPanel}>
                        <div style={styles.panelHeader}>
                            <h3 style={styles.panelTitle}>Dispatch Readiness</h3>
                            <Truck size={18} className="text-muted" style={{ color: 'rgba(255,255,255,0.6)' }} />
                        </div>
                        <div style={styles.dispatchGrid}>
                            <div style={styles.dispatchItem}>
                                <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 700, color: '#10B981' }}>12</span>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Ready</span>
                            </div>
                            <div style={styles.dispatchItem}>
                                <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 700, color: '#F59E0B' }}>5</span>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Pending Prep</span>
                            </div>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.85rem', color: '#FCA5A5' }}>
                            <span style={{ fontWeight: 'bold' }}>Warning:</span> 5 orders pending for 1:00 PM slot.
                        </div>
                    </div>

                    {/* Inventory Snapshot */}
                    <div style={styles.sectionPanel}>
                        <div style={styles.panelHeader}>
                            <h3 style={styles.panelTitle}>Inventory Snapshot</h3>
                            <Package size={18} className="text-muted" style={{ color: 'rgba(255,255,255,0.6)' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {INVENTORY_SNAPSHOT.map(inv => (
                                <div key={inv.key} style={styles.invItem}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>{inv.name}</div>
                                        <span style={{ fontSize: '0.75rem', color: inv.status === 'critical' ? '#EF4444' : '#64748b' }}>
                                            {inv.rem} Remaining
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

