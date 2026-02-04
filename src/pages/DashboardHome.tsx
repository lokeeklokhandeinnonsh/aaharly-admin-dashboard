import React, { useState, useEffect } from 'react';
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

const KPICard = ({ title, value, change, icon: Icon, isPositive }: any) => {
    const [isHovered, setIsHovered] = useState(false);

    const styles = {
        card: {
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            transition: 'transform 0.2s, background 0.2s',
            transform: isHovered ? 'translateY(-4px)' : 'none',
            background: isHovered ? 'rgba(255, 255, 255, 0.05)' : undefined,
            cursor: 'default',
        },
        iconWrapper: {
            padding: '0.75rem',
            background: 'rgba(255, 122, 0, 0.1)',
            borderRadius: '12px',
            color: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        content: {
            display: 'flex',
            flexDirection: 'column' as const,
        },
        title: {
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            marginBottom: '0.25rem',
        },
        value: {
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: '0.25rem',
            marginTop: 0,
        },
        change: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: isPositive ? 'var(--color-success)' : 'var(--color-danger)',
        }
    };

    return (
        <div
            className="glass-panel"
            style={styles.card}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={styles.iconWrapper}>
                <Icon size={24} />
            </div>
            <div style={styles.content}>
                <span style={styles.title}>{title}</span>
                <h3 style={styles.value}>{value}</h3>
                <div style={styles.change}>
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{change}</span>
                </div>
            </div>
        </div>
    );
};

export const DashboardHome: React.FC = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const [hoveredActivity, setHoveredActivity] = useState<number | null>(null);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isLaptop = width <= 1024;

    const styles = {
        home: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '2rem',
        },
        kpiGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
        },
        chartsGrid: {
            display: 'grid',
            gridTemplateColumns: isLaptop ? '1fr' : '2fr 1fr',
            gap: '1.5rem',
        },
        chartCard: {
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            minHeight: '380px',
        },
        chartHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
        },
        chartTitle: {
            fontSize: '1.1rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            margin: 0,
        },
        btnIcon: {
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
        },
        recentActivity: {
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
        },
        sectionHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
        },
        btnText: {
            background: 'transparent',
            border: 'none',
            color: 'var(--color-accent)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 500,
        },
        activityList: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '1rem',
        },
        activityItem: (hovered: boolean) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            background: hovered ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.02)',
            transition: 'background 0.2s',
        }),
        activityIconBg: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(30, 41, 59, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-secondary)',
        },
        activityDetails: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column' as const,
        },
        activityTitle: {
            fontSize: '0.9rem',
            color: 'var(--color-text-primary)',
            fontWeight: 500,
        },
        activityTime: {
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
        },
        activityAmount: {
            fontWeight: 600,
            color: 'var(--color-success)',
        }
    };

    return (
        <div style={styles.home}>
            {/* KPI Grid */}
            <div style={styles.kpiGrid}>
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
            <div style={styles.chartsGrid}>
                <div className="glass-panel" style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <h3 style={styles.chartTitle}>Orders Overview</h3>
                        <button style={styles.btnIcon}><TrendingUp size={16} /></button>
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

                <div className="glass-panel" style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <h3 style={styles.chartTitle}>Meal Plan Popularity</h3>
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
            <div className="glass-panel" style={styles.recentActivity}>
                <div style={styles.sectionHeader}>
                    <h3 style={styles.chartTitle}>Recent Activity</h3>
                    <button style={styles.btnText}>View All</button>
                </div>
                <div style={styles.activityList}>
                    {[1, 2, 3, 4].map((i, idx) => (
                        <div
                            key={i}
                            style={styles.activityItem(hoveredActivity === idx)}
                            onMouseEnter={() => setHoveredActivity(idx)}
                            onMouseLeave={() => setHoveredActivity(null)}
                        >
                            <div style={styles.activityIconBg}>
                                <ShoppingBag size={18} />
                            </div>
                            <div style={styles.activityDetails}>
                                <span style={styles.activityTitle}>New Order #223{i}</span>
                                <span style={styles.activityTime}>{i * 15} mins ago</span>
                            </div>
                            <div style={styles.activityAmount}>+₹120.00</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

