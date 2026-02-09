import React, { useState, useEffect } from 'react';
import {
    Users,
    CreditCard,
    ShoppingBag,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    AlertCircle
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
import { dashboardClient } from '../api/dashboardClient';
import type { DashboardStats, OrdersTrendItem, MealPopularityItem, RecentActivityItem } from '../api/dashboardClient';
import toast from 'react-hot-toast';

const KPICard = ({ title, value, change, icon: Icon, isPositive, isLoading }: any) => {
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

    if (isLoading) {
        return (
            <div className="glass-panel" style={{ ...styles.card, height: '140px', justifyContent: 'center', alignItems: 'center' }}>
                <span className="animate-pulse">Loading...</span>
            </div>
        );
    }

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
                {change && (
                    <div style={styles.change}>
                        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span>{change}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export const DashboardHome: React.FC = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const [hoveredActivity, setHoveredActivity] = useState<number | null>(null);

    // Data State
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [ordersTrend, setOrdersTrend] = useState<OrdersTrendItem[]>([]);
    const [mealPopularity, setMealPopularity] = useState<MealPopularityItem[]>([]);
    const [activities, setActivities] = useState<RecentActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchData = async () => {
        try {
            setError(null);
            // Don't set isLoading(true) for background refreshes unless initial load
            if (!stats) setIsLoading(true);

            const [statsData, trendData, mealsData, activityData] = await Promise.all([
                dashboardClient.getStats(),
                dashboardClient.getOrdersTrend(),
                dashboardClient.getMealPopularity(),
                dashboardClient.getRecentActivity()
            ]);

            setStats(statsData);
            setOrdersTrend(trendData.trend);
            setMealPopularity(mealsData.popularity);
            setActivities(activityData.activities);
            setLastUpdated(new Date());
        } catch (err: any) {
            console.error('Failed to fetch dashboard data:', err);
            setError('Failed to load dashboard data');
            if (!stats) toast.error('Could not load dashboard metrics');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        // Initial Fetch
        fetchData();

        // Auto Refresh every 60s
        const intervalId = setInterval(fetchData, 60000);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(intervalId);
        };
    }, []);

    const isLaptop = width <= 1024;

    const styles = {
        home: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '2rem',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        refreshBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
            fontSize: '0.875rem'
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
            gap: '0.25rem',
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
        activityStatus: (status?: string) => ({
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.1)',
            color: status === 'Active' ? 'var(--color-success)' : 'var(--color-text-primary)'
        })
    };

    // Formatting helpers
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string | Date) => {
        const d = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return d.toLocaleDateString();
    };

    return (
        <div style={styles.home}>
            {/* Header with Refresh */}
            <div style={styles.header}>
                <h2 style={{ margin: 0 }}>Dashboard Overview</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                    <button
                        style={styles.refreshBtn}
                        onClick={() => fetchData()}
                        disabled={isLoading}
                    >
                        <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#fca5a5', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {/* KPI Grid */}
            <div style={styles.kpiGrid}>
                <KPICard
                    title="Total Users"
                    value={isLoading ? '-' : stats?.totalUsers}
                    icon={Users}
                    isPositive={true}
                    isLoading={isLoading && !stats}
                />
                <KPICard
                    title="Active Subs"
                    value={isLoading ? '-' : stats?.activeSubscriptions}
                    icon={CreditCard}
                    isPositive={true}
                    isLoading={isLoading && !stats}
                />
                <KPICard
                    title="Orders Today"
                    value={isLoading ? '-' : stats?.ordersToday}
                    icon={ShoppingBag}
                    isPositive={false} // Neutral
                    isLoading={isLoading && !stats}
                />
                <KPICard
                    title="Revenue (Month)"
                    value={isLoading ? '-' : formatCurrency(stats?.revenueThisMonth || 0)}
                    icon={DollarSign}
                    isPositive={true}
                    isLoading={isLoading && !stats}
                />
            </div>

            {/* Charts Section */}
            <div style={styles.chartsGrid}>
                <div className="glass-panel" style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <h3 style={styles.chartTitle}>Orders Trend (Last 30 Days)</h3>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={ordersTrend}>
                                <defs>
                                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#FF7A00" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#64748B"
                                    tickFormatter={(val) => new Date(val).getDate().toString()} // Show only day number
                                />
                                <YAxis stroke="#64748B" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelFormatter={(val) => new Date(val).toLocaleDateString()}
                                />
                                <Area type="monotone" dataKey="count" stroke="#FF7A00" fillOpacity={1} fill="url(#colorOrders)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel" style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <h3 style={styles.chartTitle}>Top Meal Plans</h3>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={mealPopularity} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis type="number" stroke="#64748B" hide />
                                <YAxis
                                    dataKey="planName"
                                    type="category"
                                    width={100}
                                    stroke="#64748B"
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                                />
                                <Bar dataKey="subscriptionCount" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-panel" style={styles.recentActivity}>
                <div style={styles.sectionHeader}>
                    <h3 style={styles.chartTitle}>Recent Activity</h3>
                </div>
                <div style={styles.activityList}>
                    {isLoading && !activities.length ? (
                        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>Loading activities...</div>
                    ) : activities.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>No recent activity</div>
                    ) : (
                        activities.map((item, idx) => (
                            <div
                                key={idx}
                                style={styles.activityItem(hoveredActivity === idx)}
                                onMouseEnter={() => setHoveredActivity(idx)}
                                onMouseLeave={() => setHoveredActivity(null)}
                            >
                                <div style={styles.activityIconBg}>
                                    {item.type === 'USER' && <Users size={18} />}
                                    {item.type === 'ORDER' && <ShoppingBag size={18} />}
                                    {item.type === 'ALERT' && <AlertCircle size={18} />}
                                    {/* Fallback */}
                                    {!['USER', 'ORDER', 'ALERT'].includes(item.type) && <TrendingUp size={18} />}
                                </div>
                                <div style={styles.activityDetails}>
                                    <span style={styles.activityTitle}>{item.message}</span>
                                    <span style={styles.activityTime}>{formatDate(item.date)}</span>
                                </div>
                                {item.status && (
                                    <div style={styles.activityStatus(item.status)}>
                                        {item.status}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
