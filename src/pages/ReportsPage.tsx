import React from 'react';
import {
    BarChart2,
    TrendingUp,
    PieChart,
    Activity,
    DollarSign
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
    Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import './Reports.css';

// Vendor Data
const PRODUCTION_EFFICIENCY_DATA = [
    { name: 'Completed', value: 85 },
    { name: 'Pending', value: 10 },
    { name: 'Wastage', value: 5 },
];
const COLORS = ['#10B981', '#F59E0B', '#EF4444']; // Green, Orange, Red

const DELIVERY_SUCCESS_DATA = [
    { day: 'Mon', success: 98 },
    { day: 'Tue', success: 95 },
    { day: 'Wed', success: 99 },
    { day: 'Thu', success: 100 },
    { day: 'Fri', success: 94 },
];

// Admin Data
const VENDOR_RANKING_DATA = [
    { name: 'Healthy Eats (BLR)', score: 92 },
    { name: 'FitFoods (MUM)', score: 88 },
    { name: 'KetoKitchen (DEL)', score: 75 },
    { name: 'VeganVibes (PUNE)', score: 60 },
];

export const ReportsPage: React.FC = () => {
    const { role } = useAuth();
    const isVendor = role.includes('VENDOR');

    return (
        <div className="reports-page">
            <div className="page-header">
                <h2 className="title">{isVendor ? 'My Performance Reports' : 'System Performance Insights'}</h2>
                <p className="subtitle">
                    {isVendor
                        ? 'Track your production efficiency and delivery benchmarks.'
                        : 'Compare vendor performance and system-wide metrics.'}
                </p>
            </div>

            {isVendor ? (
                // VENDOR REPORTS
                <div className="reports-grid">
                    <div className="report-card glass-panel">
                        <div className="card-header">
                            <h3>Production Efficiency</h3>
                            <PieChart size={18} className="text-muted" />
                        </div>
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <RePieChart>
                                    <Pie
                                        data={PRODUCTION_EFFICIENCY_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {PRODUCTION_EFFICIENCY_DATA.map((_, index) => (
                                            <Cell key={`cell - ${index} `} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none' }} />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="legend">
                            <div className="legend-item"><span className="dot bg-success"></span> Completed</div>
                            <div className="legend-item"><span className="dot bg-warning"></span> Pending</div>
                            <div className="legend-item"><span className="dot bg-danger"></span> Wastage</div>
                        </div>
                    </div>

                    <div className="report-card glass-panel">
                        <div className="card-header">
                            <h3>Delivery Success Rate</h3>
                            <Activity size={18} className="text-muted" />
                        </div>
                        <div className="kpi-summary">
                            <div className="kpi-big">
                                <span className="val">97.2%</span>
                                <span className="trend positive"><TrendingUp size={14} /> +1.2%</span>
                            </div>
                        </div>
                        <div style={{ width: '100%', height: 180 }}>
                            <ResponsiveContainer>
                                <BarChart data={DELIVERY_SUCCESS_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="day" stroke="#64748B" />
                                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1E293B', border: 'none' }} />
                                    <Bar dataKey="success" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="report-card glass-panel">
                        <div className="card-header">
                            <h3>Cost Summary</h3>
                            <DollarSign size={18} className="text-muted" />
                        </div>
                        <div className="cost-breakdown">
                            <div className="cost-item">
                                <span>Raw Materials</span>
                                <div className="bar-bg"><div className="bar-fill" style={{ width: '70%' }}></div></div>
                                <span className="val">$1,240</span>
                            </div>
                            <div className="cost-item">
                                <span>Packaging</span>
                                <div className="bar-bg"><div className="bar-fill" style={{ width: '30%' }}></div></div>
                                <span className="val">$540</span>
                            </div>
                            <div className="cost-item">
                                <span>Logistics</span>
                                <div className="bar-bg"><div className="bar-fill" style={{ width: '45%' }}></div></div>
                                <span className="val">$890</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // ADMIN REPORTS
                <div className="reports-grid admin-grid">
                    <div className="report-card glass-panel col-span-2">
                        <div className="card-header">
                            <h3>Vendor Performance Ranking</h3>
                            <BarChart2 size={18} className="text-muted" />
                        </div>
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <BarChart data={VENDOR_RANKING_DATA} layout="vertical" margin={{ left: 40 }}>
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
                            <h3>System Health</h3>
                        </div>
                        <div className="health-stats">
                            <div className="h-stat">
                                <span>Active Orders</span>
                                <h3>1,204</h3>
                            </div>
                            <div className="h-stat">
                                <span>Delayed Deliveries</span>
                                <h3 className="text-danger">12</h3>
                            </div>
                            <div className="h-stat">
                                <span>New Subs (Today)</span>
                                <h3 className="text-success">54</h3>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
