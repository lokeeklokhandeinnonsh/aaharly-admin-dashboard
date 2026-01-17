import React from 'react';
import { CreditCard, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import './Subscriptions.css';

const PLANS = [
    { id: 1, name: 'Basic Plan', price: '₹2,499/mo', active: 1200, revenue: '₹29,98,800' },
    { id: 2, name: 'Premium Plan', price: '₹4,999/mo', active: 800, revenue: '₹39,99,200' },
    { id: 3, name: 'Family Pack', price: '₹8,499/mo', active: 300, revenue: '₹25,49,700' },
];

export const SubscriptionsPage: React.FC = () => {
    return (
        <div className="subscriptions-page">
            <div className="stats-row">
                <div className="stat-card glass-panel">
                    <div className="icon success"><CheckCircle /></div>
                    <div>
                        <span className="label">Active Subs</span>
                        <h3>2,300</h3>
                    </div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="icon danger"><XCircle /></div>
                    <div>
                        <span className="label">Expired</span>
                        <h3>450</h3>
                    </div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="icon warning"><DollarSign /></div>
                    <div>
                        <span className="label">MRR</span>
                        <h3>₹95.4L</h3>
                    </div>
                </div>
            </div>

            <h2 className="section-title">Subscription Plans</h2>
            <div className="plans-grid">
                {PLANS.map(plan => (
                    <div key={plan.id} className="plan-card glass-panel">
                        <div className="plan-header">
                            <div className="plan-icon"><CreditCard /></div>
                            <div>
                                <h3>{plan.name}</h3>
                                <span className="plan-price">{plan.price}</span>
                            </div>
                        </div>
                        <hr className="divider" />
                        <div className="plan-stats">
                            <div className="p-stat">
                                <span className="label">Active Users</span>
                                <span className="val">{plan.active}</span>
                            </div>
                            <div className="p-stat">
                                <span className="label">Revenue</span>
                                <span className="val">{plan.revenue}</span>
                            </div>
                        </div>
                        <div className="plan-progress">
                            <div className="progress-bar" style={{ width: '70%' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
