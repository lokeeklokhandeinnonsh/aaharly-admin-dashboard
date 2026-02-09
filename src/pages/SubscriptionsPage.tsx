import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, XCircle, DollarSign, Package } from 'lucide-react';
import './Subscriptions.css';
import { adminClient, type Subscription, type SubscriptionStats } from '../api/adminClient';
import toast, { Toaster } from 'react-hot-toast';

export const SubscriptionsPage: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [stats, setStats] = useState<SubscriptionStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [subsData, statsData] = await Promise.all([
                adminClient.getSubscriptions(),
                adminClient.getSubscriptionStats(),
            ]);
            setSubscriptions(subsData);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to fetch subscriptions:', error);
            toast.error('Failed to load subscriptions');
        } finally {
            setIsLoading(false);
        }
    };

    // Group subscriptions by plan
    const planGroups = subscriptions.reduce((acc, sub) => {
        const planName = sub.planName || 'Unknown Plan';
        if (!acc[planName]) {
            acc[planName] = [];
        }
        acc[planName].push(sub);
        return acc;
    }, {} as Record<string, Subscription[]>);

    return (
        <div className="subscriptions-page">
            <Toaster position="top-right" />

            {/* Stats Row */}
            <div className="stats-row">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="stat-card glass-panel">
                            <div className="skeleton-circle" style={{ width: '40px', height: '40px' }}></div>
                            <div>
                                <div className="skeleton-line" style={{ width: '80px', height: '14px', marginBottom: '0.5rem' }}></div>
                                <div className="skeleton-line" style={{ width: '60px', height: '24px' }}></div>
                            </div>
                        </div>
                    ))
                ) : stats ? (
                    <>
                        <div className="stat-card glass-panel">
                            <div className="icon success"><CheckCircle /></div>
                            <div>
                                <span className="label">Active Subs</span>
                                <h3>{stats.activeSubscriptions.toLocaleString()}</h3>
                            </div>
                        </div>
                        <div className="stat-card glass-panel">
                            <div className="icon warning"><Package /></div>
                            <div>
                                <span className="label">Paused</span>
                                <h3>{stats.pausedSubscriptions.toLocaleString()}</h3>
                            </div>
                        </div>
                        <div className="stat-card glass-panel">
                            <div className="icon danger"><XCircle /></div>
                            <div>
                                <span className="label">Expired</span>
                                <h3>{stats.expiredSubscriptions.toLocaleString()}</h3>
                            </div>
                        </div>
                        <div className="stat-card glass-panel">
                            <div className="icon primary"><DollarSign /></div>
                            <div>
                                <span className="label">MRR</span>
                                <h3>₹{(stats.monthlyRevenue / 100000).toFixed(1)}L</h3>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>

            <h2 className="section-title">Subscription Plans</h2>

            {isLoading ? (
                <div className="plans-grid">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="plan-card glass-panel">
                            <div className="skeleton-line" style={{ width: '70%', height: '20px', marginBottom: '1rem' }}></div>
                            <div className="skeleton-line" style={{ width: '50%', height: '16px', marginBottom: '1rem' }}></div>
                            <div className="skeleton-line" style={{ width: '100%', height: '60px' }}></div>
                        </div>
                    ))}
                </div>
            ) : Object.keys(planGroups).length > 0 ? (
                <div className="plans-grid">
                    {Object.entries(planGroups).map(([planName, subs]) => {
                        const activeSubs = subs.filter(s => s.status === 'active').length;
                        const totalRevenue = subs
                            .filter(s => s.status === 'active')
                            .reduce((sum, sub) => sum + (sub.mealsRemaining * 100), 0); // Rough estimate

                        return (
                            <div key={planName} className="plan-card glass-panel">
                                <div className="plan-header">
                                    <div className="plan-icon"><CreditCard /></div>
                                    <div>
                                        <h3>{planName}</h3>
                                        <span className="plan-price">{subs.length} Total</span>
                                    </div>
                                </div>
                                <hr className="divider" />
                                <div className="plan-stats">
                                    <div className="p-stat">
                                        <span className="label">Active Users</span>
                                        <span className="val">{activeSubs}</span>
                                    </div>
                                    <div className="p-stat">
                                        <span className="label">Est. Revenue</span>
                                        <span className="val">₹{(totalRevenue / 1000).toFixed(1)}K</span>
                                    </div>
                                </div>
                                <div className="plan-progress">
                                    <div
                                        className="progress-bar"
                                        style={{ width: `${Math.min((activeSubs / subs.length) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="empty-state" style={{ textAlign: 'center', padding: '3rem' }}>
                    <Package size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <h3>No subscriptions found</h3>
                    <p>Subscriptions will appear here once users subscribe to plans.</p>
                </div>
            )}
        </div>
    );
};
