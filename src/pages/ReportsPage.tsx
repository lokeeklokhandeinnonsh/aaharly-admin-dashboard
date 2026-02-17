import React, { useState, useEffect, useCallback } from 'react';
import {
    BarChart2,
    TrendingUp,
    TrendingDown,
    PieChart,
    DollarSign,
    Calendar,
    Package,
    Truck,
    RefreshCw,
    Loader2,
    AlertCircle
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    LineChart,
    Line,
    Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { reportClient, type AdminReportsResponse } from '../api/reportClient';
import { vendorClient, type ReportResponse } from '../api/vendorClient';
import toast from 'react-hot-toast';
import './Reports.css';

// ============ TYPES ============
type VendorReportTab = 'production' | 'delivery' | 'inventory' | 'finance';

interface ProductionData {
    total: number;
    completed: number;
    pending: number;
}

interface DeliveryData {
    delivered: number;
    pending: number;
    cancelled: number;
}

interface InventoryData {
    usage: number;
    wastage: number;
    restock: number;
}

interface FinanceData {
    totalAmount: number;
    netAmount: number;
    deductions: number;
}

// ============ HELPERS ============
const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
};

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
};

const getDateRange = (days: number): { start: string; end: string } => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
    };
};

const CHART_COLORS = {
    primary: '#FF7A00',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    purple: '#8B5CF6',
    secondary: '#64748B'
};

const PIE_COLORS = [CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger];

// ============ VENDOR REPORTS COMPONENT ============
const VendorReports: React.FC = () => {
    const [activeTab, setActiveTab] = useState<VendorReportTab>('production');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [datePreset, setDatePreset] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
    const [startDate, setStartDate] = useState(() => getDateRange(30).start);
    const [endDate, setEndDate] = useState(() => getDateRange(30).end);

    // Report data
    const [productionData, setProductionData] = useState<ReportResponse[]>([]);
    const [deliveryData, setDeliveryData] = useState<ReportResponse[]>([]);
    const [inventoryData, setInventoryData] = useState<ReportResponse[]>([]);
    const [financeData, setFinanceData] = useState<ReportResponse[]>([]);

    const fetchReports = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [prod, del, inv, fin] = await Promise.all([
                vendorClient.getProductionReports(startDate, endDate),
                vendorClient.getDeliveryReports(startDate, endDate),
                vendorClient.getInventoryReports(startDate, endDate),
                vendorClient.getFinanceReports(startDate, endDate),
            ]);
            setProductionData(prod);
            setDeliveryData(del);
            setInventoryData(inv);
            setFinanceData(fin);
        } catch (err: any) {
            console.error('Failed to fetch vendor reports:', err);
            setError(err.message || 'Failed to load reports');
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handlePreset = (preset: '7d' | '30d' | '90d') => {
        const days = preset === '7d' ? 7 : preset === '30d' ? 30 : 90;
        const range = getDateRange(days);
        setStartDate(range.start);
        setEndDate(range.end);
        setDatePreset(preset);
    };

    // ============ COMPUTE SUMMARIES ============
    const productionSummary = productionData.reduce(
        (acc, r) => {
            const d = r.data as ProductionData;
            acc.total += d.total || 0;
            acc.completed += d.completed || 0;
            return acc;
        },
        { total: 0, completed: 0 }
    );
    const productionRate = productionSummary.total > 0
        ? Math.round((productionSummary.completed / productionSummary.total) * 100)
        : 0;

    const deliverySummary = deliveryData.reduce(
        (acc, r) => {
            const d = r.data as DeliveryData;
            acc.delivered += d.delivered || 0;
            acc.pending += d.pending || 0;
            acc.cancelled += d.cancelled || 0;
            return acc;
        },
        { delivered: 0, pending: 0, cancelled: 0 }
    );
    const deliveryTotal = deliverySummary.delivered + deliverySummary.pending + deliverySummary.cancelled;
    const deliveryRate = deliveryTotal > 0
        ? Math.round((deliverySummary.delivered / deliveryTotal) * 100)
        : 0;

    const inventorySummary = inventoryData.reduce(
        (acc, r) => {
            const d = r.data as InventoryData;
            acc.usage += d.usage || 0;
            acc.wastage += d.wastage || 0;
            acc.restock += d.restock || 0;
            return acc;
        },
        { usage: 0, wastage: 0, restock: 0 }
    );

    const financeSummary = financeData.reduce(
        (acc, r) => {
            const d = r.data as FinanceData;
            acc.totalAmount += d.totalAmount || 0;
            acc.netAmount += d.netAmount || 0;
            acc.deductions += d.deductions || 0;
            return acc;
        },
        { totalAmount: 0, netAmount: 0, deductions: 0 }
    );

    // ============ CHART DATA ============
    const productionChartData = productionData.map(r => ({
        date: formatDate(r.date),
        target: (r.data as ProductionData).total,
        completed: (r.data as ProductionData).completed,
    }));

    const deliveryChartData = deliveryData.map(r => ({
        date: formatDate(r.date),
        delivered: (r.data as DeliveryData).delivered,
        pending: (r.data as DeliveryData).pending,
        cancelled: (r.data as DeliveryData).cancelled,
    }));

    const inventoryChartData = inventoryData.map(r => ({
        date: formatDate(r.date),
        usage: (r.data as InventoryData).usage,
        wastage: (r.data as InventoryData).wastage,
        restock: (r.data as InventoryData).restock,
    }));

    const financeChartData = financeData.map(r => ({
        date: formatDate(r.date),
        total: (r.data as FinanceData).totalAmount,
        net: (r.data as FinanceData).netAmount,
        deductions: (r.data as FinanceData).deductions,
    }));

    const productionPieData = [
        { name: 'Completed', value: productionSummary.completed },
        { name: 'Pending', value: Math.max(0, productionSummary.total - productionSummary.completed) },
    ];

    const deliveryPieData = [
        { name: 'Delivered', value: deliverySummary.delivered },
        { name: 'Pending', value: deliverySummary.pending },
        { name: 'Cancelled', value: deliverySummary.cancelled },
    ];

    const TABS: { key: VendorReportTab; label: string; icon: React.ElementType }[] = [
        { key: 'production', label: 'Production', icon: BarChart2 },
        { key: 'delivery', label: 'Delivery', icon: Truck },
        { key: 'inventory', label: 'Inventory', icon: Package },
        { key: 'finance', label: 'Finance', icon: DollarSign },
    ];

    const tooltipStyle = { backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#F8FAFC' };

    return (
        <>
            {/* Date Range Filter */}
            <div className="report-filters glass-panel">
                <div className="filter-presets">
                    {(['7d', '30d', '90d'] as const).map(p => (
                        <button
                            key={p}
                            className={`preset-btn ${datePreset === p ? 'active' : ''}`}
                            onClick={() => handlePreset(p)}
                        >
                            {p === '7d' ? 'Last 7 Days' : p === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
                        </button>
                    ))}
                </div>
                <div className="filter-dates">
                    <div className="date-input-group">
                        <Calendar size={14} />
                        <input
                            type="date"
                            value={startDate}
                            onChange={e => { setStartDate(e.target.value); setDatePreset('custom'); }}
                        />
                    </div>
                    <span className="date-separator">to</span>
                    <div className="date-input-group">
                        <Calendar size={14} />
                        <input
                            type="date"
                            value={endDate}
                            onChange={e => { setEndDate(e.target.value); setDatePreset('custom'); }}
                        />
                    </div>
                    <button className="refresh-btn" onClick={fetchReports} disabled={loading}>
                        <RefreshCw size={14} className={loading ? 'spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Report Tabs */}
            <div className="report-tabs">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        className={`report-tab ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        <tab.icon size={16} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Loading / Error */}
            {loading && (
                <div className="report-status">
                    <Loader2 size={24} className="spin" />
                    <span>Loading reports...</span>
                </div>
            )}
            {error && !loading && (
                <div className="report-status error">
                    <AlertCircle size={24} />
                    <span>{error}</span>
                    <button className="btn-secondary" onClick={fetchReports}>Retry</button>
                </div>
            )}

            {/* Content */}
            {!loading && !error && (
                <>
                    {/* ======== PRODUCTION TAB ======== */}
                    {activeTab === 'production' && (
                        <div className="reports-grid">
                            {/* KPI Cards */}
                            <div className="report-kpi-row">
                                <div className="kpi-card glass-panel">
                                    <span className="kpi-label">Total Target</span>
                                    <span className="kpi-value">{productionSummary.total.toLocaleString()}</span>
                                </div>
                                <div className="kpi-card glass-panel">
                                    <span className="kpi-label">Completed</span>
                                    <span className="kpi-value text-success">{productionSummary.completed.toLocaleString()}</span>
                                </div>
                                <div className="kpi-card glass-panel">
                                    <span className="kpi-label">Remaining</span>
                                    <span className="kpi-value text-warning">{Math.max(0, productionSummary.total - productionSummary.completed).toLocaleString()}</span>
                                </div>
                                <div className="kpi-card glass-panel">
                                    <span className="kpi-label">Completion Rate</span>
                                    <span className="kpi-value">
                                        {productionRate}%
                                        {productionRate >= 90
                                            ? <TrendingUp size={16} className="inline-icon text-success" />
                                            : <TrendingDown size={16} className="inline-icon text-danger" />
                                        }
                                    </span>
                                </div>
                            </div>

                            {/* Charts Row */}
                            <div className="report-charts-row">
                                <div className="report-card glass-panel chart-wide">
                                    <div className="card-header">
                                        <h3>Daily Production Trend</h3>
                                        <BarChart2 size={18} className="text-muted" />
                                    </div>
                                    {productionChartData.length === 0 ? (
                                        <div className="empty-chart">No production data for this period</div>
                                    ) : (
                                        <div className="chart-container">
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={productionChartData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                                    <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                                                    <YAxis stroke="#64748B" fontSize={12} />
                                                    <Tooltip contentStyle={tooltipStyle} />
                                                    <Legend />
                                                    <Bar dataKey="target" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} name="Target" />
                                                    <Bar dataKey="completed" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} name="Completed" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}
                                </div>

                                <div className="report-card glass-panel chart-narrow">
                                    <div className="card-header">
                                        <h3>Completion Breakdown</h3>
                                        <PieChart size={18} className="text-muted" />
                                    </div>
                                    {productionSummary.total === 0 ? (
                                        <div className="empty-chart">No data available</div>
                                    ) : (
                                        <>
                                            <div className="chart-container">
                                                <ResponsiveContainer width="100%" height={220}>
                                                    <RePieChart>
                                                        <Pie
                                                            data={productionPieData}
                                                            cx="50%" cy="50%"
                                                            innerRadius={55} outerRadius={80}
                                                            paddingAngle={4} dataKey="value"
                                                        >
                                                            {productionPieData.map((_, i) => (
                                                                <Cell key={i} fill={[CHART_COLORS.success, CHART_COLORS.warning][i]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip contentStyle={tooltipStyle} />
                                                    </RePieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="legend">
                                                <div className="legend-item"><span className="dot bg-success"></span> Completed</div>
                                                <div className="legend-item"><span className="dot bg-warning"></span> Pending</div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ======== DELIVERY TAB ======== */}
                    {activeTab === 'delivery' && (
                        <div className="reports-grid">
                            <div className="report-kpi-row">
                                <div className="kpi-card glass-panel">
                                    <span className="kpi-label">Total Deliveries</span>
                                    <span className="kpi-value">{deliveryTotal.toLocaleString()}</span>
                                </div>
                                <div className="kpi-card glass-panel">
                                    <span className="kpi-label">Delivered</span>
                                    <span className="kpi-value text-success">{deliverySummary.delivered.toLocaleString()}</span>
                                </div>
                                <div className="kpi-card glass-panel">
                                    <span className="kpi-label">Cancelled</span>
                                    <span className="kpi-value text-danger">{deliverySummary.cancelled.toLocaleString()}</span>
                                </div>
                                <div className="kpi-card glass-panel">
                                    <span className="kpi-label">Success Rate</span>
                                    <span className="kpi-value">
                                        {deliveryRate}%
                                        {deliveryRate >= 95
                                            ? <TrendingUp size={16} className="inline-icon text-success" />
                                            : <TrendingDown size={16} className="inline-icon text-danger" />
                                        }
                                    </span>
                                </div>
                            </div>

                            <div className="report-charts-row">
                                <div className="report-card glass-panel chart-wide">
                                    <div className="card-header">
                                        <h3>Daily Delivery Breakdown</h3>
                                        <Truck size={18} className="text-muted" />
                                    </div>
                                    {deliveryChartData.length === 0 ? (
                                        <div className="empty-chart">No delivery data for this period</div>
                                    ) : (
                                        <div className="chart-container">
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={deliveryChartData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                                    <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                                                    <YAxis stroke="#64748B" fontSize={12} />
                                                    <Tooltip contentStyle={tooltipStyle} />
                                                    <Legend />
                                                    <Bar dataKey="delivered" stackId="a" fill={CHART_COLORS.success} name="Delivered" />
                                                    <Bar dataKey="pending" stackId="a" fill={CHART_COLORS.warning} name="Pending" />
                                                    <Bar dataKey="cancelled" stackId="a" fill={CHART_COLORS.danger} radius={[4, 4, 0, 0]} name="Cancelled" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}
                                </div>

                                <div className="report-card glass-panel chart-narrow">
                                    <div className="card-header">
                                        <h3>Delivery Overview</h3>
                                        <PieChart size={18} className="text-muted" />
                                    </div>
                                    {deliveryTotal === 0 ? (
                                        <div className="empty-chart">No data available</div>
                                    ) : (
                                        <>
                                            <div className="chart-container">
                                                <ResponsiveContainer width="100%" height={220}>
                                                    <RePieChart>
                                                        <Pie
                                                            data={deliveryPieData}
                                                            cx="50%" cy="50%"
                                                            innerRadius={55} outerRadius={80}
                                                            paddingAngle={4} dataKey="value"
                                                        >
                                                            {deliveryPieData.map((_, i) => (
                                                                <Cell key={i} fill={PIE_COLORS[i]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip contentStyle={tooltipStyle} />
                                                    </RePieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="legend">
                                                <div className="legend-item"><span className="dot bg-success"></span> Delivered</div>
                                                <div className="legend-item"><span className="dot bg-warning"></span> Pending</div>
                                                <div className="legend-item"><span className="dot bg-danger"></span> Cancelled</div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ======== INVENTORY TAB ======== */}
                    {activeTab === 'inventory' && (
                        <div className="reports-grid">
                            <div className="report-kpi-row">
                                <div className="kpi-card glass-panel">
                                    <span className="kpi-label">Total Usage</span>
                                    <span className="kpi-value">{inventorySummary.usage.toLocaleString()}</span>
                                </div>
                                <div className="kpi-card glass-panel">
                                    <span className="kpi-label">Wastage</span>
                                    <span className="kpi-value text-danger">{inventorySummary.wastage.toLocaleString()}</span>
                                </div>
                                <div className="kpi-card glass-panel">
                                    <span className="kpi-label">Restocked</span>
                                    <span className="kpi-value text-success">{inventorySummary.restock.toLocaleString()}</span>
                                </div>
                                <div className="kpi-card glass-panel">
                                    <span className="kpi-label">Waste Rate</span>
                                    <span className="kpi-value">
                                        {inventorySummary.usage > 0
                                            ? Math.round((inventorySummary.wastage / inventorySummary.usage) * 100)
                                            : 0
                                        }%
                                        {inventorySummary.wastage > 0 && <TrendingDown size={16} className="inline-icon text-danger" />}
                                    </span>
                                </div>
                            </div>

                            <div className="report-charts-row single">
                                <div className="report-card glass-panel chart-full">
                                    <div className="card-header">
                                        <h3>Inventory Activity Over Time</h3>
                                        <Package size={18} className="text-muted" />
                                    </div>
                                    {inventoryChartData.length === 0 ? (
                                        <div className="empty-chart">No inventory data for this period</div>
                                    ) : (
                                        <div className="chart-container">
                                            <ResponsiveContainer width="100%" height={320}>
                                                <AreaChart data={inventoryChartData}>
                                                    <defs>
                                                        <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={CHART_COLORS.info} stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor={CHART_COLORS.info} stopOpacity={0} />
                                                        </linearGradient>
                                                        <linearGradient id="wastageGrad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={CHART_COLORS.danger} stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor={CHART_COLORS.danger} stopOpacity={0} />
                                                        </linearGradient>
                                                        <linearGradient id="restockGrad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                                    <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                                                    <YAxis stroke="#64748B" fontSize={12} />
                                                    <Tooltip contentStyle={tooltipStyle} />
                                                    <Legend />
                                                    <Area type="monotone" dataKey="usage" stroke={CHART_COLORS.info} fill="url(#usageGrad)" name="Usage" />
                                                    <Area type="monotone" dataKey="wastage" stroke={CHART_COLORS.danger} fill="url(#wastageGrad)" name="Wastage" />
                                                    <Area type="monotone" dataKey="restock" stroke={CHART_COLORS.success} fill="url(#restockGrad)" name="Restock" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ======== FINANCE TAB ======== */}
                    {activeTab === 'finance' && (
                        <div className="reports-grid">
                            <div className="report-kpi-row">
                                <div className="kpi-card glass-panel">
                                    <span className="kpi-label">Gross Revenue</span>
                                    <span className="kpi-value">{formatCurrency(financeSummary.totalAmount)}</span>
                                </div>
                                <div className="kpi-card glass-panel">
                                    <span className="kpi-label">Net Payout</span>
                                    <span className="kpi-value text-success">{formatCurrency(financeSummary.netAmount)}</span>
                                </div>
                                <div className="kpi-card glass-panel">
                                    <span className="kpi-label">Deductions</span>
                                    <span className="kpi-value text-danger">{formatCurrency(financeSummary.deductions)}</span>
                                </div>
                                <div className="kpi-card glass-panel">
                                    <span className="kpi-label">Payout Ratio</span>
                                    <span className="kpi-value">
                                        {financeSummary.totalAmount > 0
                                            ? Math.round((financeSummary.netAmount / financeSummary.totalAmount) * 100)
                                            : 0
                                        }%
                                    </span>
                                </div>
                            </div>

                            <div className="report-charts-row single">
                                <div className="report-card glass-panel chart-full">
                                    <div className="card-header">
                                        <h3>Revenue & Payouts Over Time</h3>
                                        <DollarSign size={18} className="text-muted" />
                                    </div>
                                    {financeChartData.length === 0 ? (
                                        <div className="empty-chart">No finance data for this period</div>
                                    ) : (
                                        <div className="chart-container">
                                            <ResponsiveContainer width="100%" height={320}>
                                                <LineChart data={financeChartData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                                    <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                                                    <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                                                    <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatCurrency(Number(value ?? 0))} />
                                                    <Legend />
                                                    <Line type="monotone" dataKey="total" stroke={CHART_COLORS.primary} strokeWidth={2} dot={false} name="Gross" />
                                                    <Line type="monotone" dataKey="net" stroke={CHART_COLORS.success} strokeWidth={2} dot={false} name="Net Payout" />
                                                    <Line type="monotone" dataKey="deductions" stroke={CHART_COLORS.danger} strokeWidth={2} dot={false} name="Deductions" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

// ============ ADMIN REPORTS COMPONENT ============
const AdminReports: React.FC = () => {
    const [reports, setReports] = useState<AdminReportsResponse | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const data = await reportClient.getReports();
                setReports(data);
            } catch (error) {
                console.error('Failed to load reports', error);
                toast.error('Failed to load reports');
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const vendorRankingData = reports?.delays?.map(d => ({
        name: d.vendorName,
        score: Math.max(0, 100 - (d.avgDelayMinutes * 2))
    })) || [];

    const growthData = reports?.growth?.map(g => ({
        date: new Date(g.date).getDate(),
        users: g.newUsers,
        subs: g.newSubscriptions
    })) || [];

    return (
        <div className="reports-grid admin-grid">
            {loading ? (
                <div className="report-status" style={{ gridColumn: '1 / -1' }}>
                    <Loader2 size={24} className="spin" />
                    <span>Loading insights...</span>
                </div>
            ) : (
                <>
                    <div className="report-card glass-panel col-span-2">
                        <div className="card-header">
                            <h3>Vendor Performance Score (Reverse Delay Metric)</h3>
                            <BarChart2 size={18} className="text-muted" />
                        </div>
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <BarChart data={vendorRankingData} layout="vertical" margin={{ left: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis type="number" stroke="#64748B" />
                                    <YAxis dataKey="name" type="category" stroke="#94A3B8" width={120} />
                                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1E293B', border: 'none' }} />
                                    <Bar dataKey="score" fill="#FF7A00" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="report-card glass-panel">
                        <div className="card-header">
                            <h3>User Growth (Last 7 Days)</h3>
                        </div>
                        <div style={{ width: '100%', height: 250, marginTop: '1rem' }}>
                            <ResponsiveContainer>
                                <BarChart data={growthData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="date" stroke="#64748B" />
                                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1E293B', border: 'none' }} />
                                    <Bar dataKey="users" fill="#10B981" radius={[4, 4, 0, 0]} name="New Users" />
                                    <Bar dataKey="subs" fill="#3B82F6" radius={[4, 4, 0, 0]} name="New Subs" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// ============ MAIN REPORTS PAGE ============
export const ReportsPage: React.FC = () => {
    const { role } = useAuth();
    const isVendor = role.includes('VENDOR');

    return (
        <div className="reports-page">
            <div className="page-header">
                <h2 className="title">{isVendor ? 'My Performance Reports' : 'System Performance Insights'}</h2>
                <p className="subtitle">
                    {isVendor
                        ? 'Track your production, delivery, inventory, and financial performance.'
                        : 'Compare vendor performance and system-wide metrics.'}
                </p>
            </div>

            {isVendor ? <VendorReports /> : <AdminReports />}
        </div>
    );
};
