import React from 'react';
import {
    Users,
    CreditCard,
    ShoppingBag,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import './DashboardHome.css';

const DATA_ORDERS = [
    { name: 'Mon', orders: 40 },
    { name: 'Tue', orders: 65 },
    { name: 'Wed', orders: 50 },
    { name: 'Thu', orders: 85 },
    { name: 'Fri', orders: 120 },
    { name: 'Sat', orders: 90 },
    { name: 'Sun', orders: 55 },
];

const DATA_MEALS = [
    { name: 'Vegan', value: 400 },
    { name: 'Keto', value: 300 },
    { name: 'Paleo', value: 200 },
    { name: 'Classic', value: 278 },
];

const KPICard = ({ title, value, change, icon: Icon, isPositive }: any) => (
    <div className="kpi-card glass-panel">
        <div className="kpi-icon-wrapper">
            <Icon size={24} />
        </div>
        <div className="kpi-content">
            <span className="kpi-title">{title}</span>
            <h3 className="kpi-value">{value}</h3>
            <div className={`kpi-change ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span>{change}</span>
            </div>
        </div>
    </div>
);

export const DashboardHome: React.FC = () => {
    return (
        <div className="dashboard-home">
            {/* KPI Grid */}
            <div className="kpi-grid">
                <KPICard
                    title="Total Users"
                    value="12,543"
                    change="+12% from last month"
                    icon={Users}
                    isPositive={true}
                />
                <KPICard
                    title="Active Subs"
                    value="3,210"
                    change="+5% from last month"
                    icon={CreditCard}
                    isPositive={true}
                />
                <KPICard
                    title="Orders Today"
                    value="145"
                    change="-2% from yesterday"
                    icon={ShoppingBag}
                    isPositive={false}
                />
                <KPICard
                    title="Total Revenue"
                    value="₹45,200"
                    change="+8.5% from last month"
                    icon={DollarSign}
                    isPositive={true}
                />
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                <div className="chart-card glass-panel">
                    <div className="chart-header">
                        <h3>Orders Overview</h3>
                        <button className="btn-icon"><TrendingUp size={16} /></button>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={DATA_ORDERS}>
                                <defs>
                                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#FF7A00" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#64748B" />
                                <YAxis stroke="#64748B" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="orders" stroke="#FF7A00" fillOpacity={1} fill="url(#colorOrders)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card glass-panel">
                    <div className="chart-header">
                        <h3>Meal Plan Popularity</h3>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={DATA_MEALS}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#64748B" />
                                <YAxis stroke="#64748B" />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                                />
                                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity glass-panel">
                <div className="section-header">
                    <h3>Recent Activity</h3>
                    <button className="btn-text">View All</button>
                </div>
                <div className="activity-list-card">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="activity-item">
                            <div className="activity-icon-bg">
                                <ShoppingBag size={18} />
                            </div>
                            <div className="activity-details">
                                <span className="activity-title">New Order #223{i}</span>
                                <span className="activity-time">{i * 15} mins ago</span>
                            </div>
                            <div className="activity-amount">+₹120.00</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
