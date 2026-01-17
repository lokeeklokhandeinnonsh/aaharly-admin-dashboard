import React, { useState } from 'react';
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
import './ProductionDashboard.css';

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

    return (
        <div className="production-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h2 className="title">Daily Operations</h2>
                    <p className="subtitle">Today's Kitchen & Dispatch Overview</p>
                </div>
                <div className="header-controls">
                    <div className="date-selector">
                        <Calendar size={16} />
                        <span>{dateRange}</span>
                        <ChevronRight size={14} />
                    </div>
                    <button className="btn-icon-glass" title="Refresh Data">
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* 1. KPI Summary Row */}
            <div className="kpi-row">
                <div className="kpi-card blue">
                    <span className="kpi-label">Meals Planned</span>
                    <span className="kpi-value">{KPI_DATA.planned}</span>
                    <div className="status-bar-tiny"></div>
                </div>
                <div className="kpi-card green">
                    <span className="kpi-label">Meals Prepared</span>
                    <span className="kpi-value">{KPI_DATA.prepared}</span>
                    <span className="kpi-hint good"><TrendingUp size={12} /> 69% Complete</span>
                    <div className="status-bar-tiny"></div>
                </div>
                <div className="kpi-card orange">
                    <span className="kpi-label">Remaining</span>
                    <span className="kpi-value">{KPI_DATA.remaining}</span>
                    <span className="kpi-hint warn">Target: 4:00 PM</span>
                    <div className="status-bar-tiny"></div>
                </div>
                <div className="kpi-card purple">
                    <span className="kpi-label">Ready for Dispatch</span>
                    <span className="kpi-value">{KPI_DATA.dispatchReady}</span>
                    <div className="status-bar-tiny"></div>
                </div>
                <div className="kpi-card red">
                    <span className="kpi-label">Delayed Batches</span>
                    <span className="kpi-value">{KPI_DATA.delayed}</span>
                    <span className="kpi-hint bad"><AlertTriangle size={12} /> Action Needed</span>
                    <div className="status-bar-tiny"></div>
                </div>
            </div>

            {/* 2. Progress Overview */}
            <div className="section-panel">
                <div className="progress-header">
                    <h3>Today's Progress</h3>
                    <span className="subtitle" style={{ color: 'var(--color-text-muted)' }}>Cutoff: 5:00 PM</span>
                </div>
                <div className="progress-track">
                    {/* 69% Prep, of which 62% is dispatched roughly */}
                    <div className="progress-segment done" style={{ width: '40%' }}>
                        {/* Dispatched */}
                    </div>
                    <div className="progress-segment prep" style={{ width: '29%' }}>
                        {/* Prepared but not dispatched */}
                    </div>
                    <div className="progress-segment" style={{ width: '31%', background: 'transparent' }}>
                        {/* Remaining */}
                    </div>

                    {/* Markers */}
                    <div className="milestone-marker" style={{ left: '20%' }}>10 AM</div>
                    <div className="milestone-marker" style={{ left: '50%' }}>1 PM</div>
                    <div className="milestone-marker" style={{ left: '80%' }}>4 PM</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                        <div style={{ width: 10, height: 10, background: '#10B981', borderRadius: 2 }}></div> Dispatched
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                        <div style={{ width: 10, height: 10, background: '#3B82F6', borderRadius: 2 }}></div> Prepared
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                        <div style={{ width: 10, height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}></div> Remaining
                    </div>
                </div>
            </div>

            {/* Main Content Split */}
            <div className="main-grid">
                {/* Left Column: Meal Breakdown & Prep Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* 3. Meal Production Breakdown */}
                    <div className="section-panel">
                        <div className="panel-header">
                            <h3>Meal Production Breakdown</h3>
                        </div>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Meal Name</th>
                                        <th style={{ textAlign: 'center' }}>Plan</th>
                                        <th style={{ textAlign: 'center' }}>Done</th>
                                        <th style={{ textAlign: 'center' }}>Rem</th>
                                        <th style={{ textAlign: 'right' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MEAL_BREAKDOWN.map(m => (
                                        <tr key={m.id}>
                                            <td>{m.name}</td>
                                            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{m.plan}</td>
                                            <td style={{ textAlign: 'center', color: '#10B981' }}>{m.done}</td>
                                            <td style={{ textAlign: 'center', color: m.rem > 0 ? '#F97316' : '#64748b' }}>{m.rem}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <span className={`chip ${m.status === 'Completed' ? 'green' : m.status === 'In Progress' ? 'blue' : 'orange'}`}>
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
                    <div className="section-panel">
                        <div className="panel-header">
                            <h3>Active Batches & Prep</h3>
                        </div>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Batch ID</th>
                                        <th>Meal</th>
                                        <th>Staff</th>
                                        <th>Start Time</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {PREP_STATUS.map(batch => (
                                        <tr key={batch.id}>
                                            <td style={{ fontFamily: 'monospace', color: '#94a3b8' }}>{batch.id}</td>
                                            <td>
                                                {batch.meal}
                                                {batch.delay && <div style={{ fontSize: '0.75rem', color: '#EF4444' }}>{batch.delay}</div>}
                                            </td>
                                            <td>{batch.staff}</td>
                                            <td>{batch.start}</td>
                                            <td>
                                                <span className={`chip ${batch.status === 'Active' ? 'blue' : batch.status === 'Delayed' ? 'red' : 'gray'}`}>
                                                    {batch.status}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button className="btn-sm-action">Manage</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Dispatch, Inventory, Alerts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* 7. Alerts (Moved up as per urgency visual hierarchy usually, but prompt said bottom. 
                        However, "Action Required" usually sits nicely at top or side. I'll put it top of side column) */}
                    <div className="section-panel" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                        <div className="panel-header">
                            <h3 style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlertOctagon size={18} /> Action Required
                            </h3>
                        </div>
                        <div className="alert-list">
                            {ALERTS.map(alert => (
                                <div key={alert.id} className={`alert-item ${alert.type}`}>
                                    <div style={{ paddingTop: '2px' }}>
                                        {alert.type === 'critical' ? <AlertTriangle size={16} color="#EF4444" /> : <Clock size={16} color="#F59E0B" />}
                                    </div>
                                    <div className="alert-content">
                                        <p>{alert.msg}</p>
                                        <span className="alert-action">{alert.action} &rarr;</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 5. Dispatch Readiness */}
                    <div className="section-panel">
                        <div className="panel-header">
                            <h3>Dispatch Readiness</h3>
                            <Truck size={18} className="text-muted" />
                        </div>
                        <div className="dispatch-stat-grid">
                            <div className="dispatch-stat-item">
                                <span className="val" style={{ color: '#10B981' }}>12</span>
                                <span className="lab">Ready</span>
                            </div>
                            <div className="dispatch-stat-item">
                                <span className="val" style={{ color: '#F59E0B' }}>5</span>
                                <span className="lab">Pending Prep</span>
                            </div>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.85rem', color: '#FCA5A5' }}>
                            <span style={{ fontWeight: 'bold' }}>Warning:</span> 5 orders pending for 1:00 PM slot.
                        </div>
                    </div>

                    {/* 6. Inventory Snapshot */}
                    <div className="section-panel">
                        <div className="panel-header">
                            <h3>Inventory Snapshot</h3>
                            <Package size={18} className="text-muted" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {INVENTORY_SNAPSHOT.map(inv => (
                                <div key={inv.key} className="inv-item">
                                    <div style={{ flex: 1 }}>
                                        <div className="inv-name">{inv.name}</div>
                                        <span style={{ fontSize: '0.75rem', color: inv.status === 'critical' ? '#EF4444' : '#64748b' }}>
                                            {inv.rem} Remaining
                                        </span>
                                    </div>
                                    <div className="inv-bar-bg">
                                        <div
                                            className="inv-bar-fill"
                                            style={{ width: `${inv.percent}%`, background: inv.status === 'critical' ? '#EF4444' : '#10B981' }}>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn-secondary w-full mt-4" style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                            Request Replenishment
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
