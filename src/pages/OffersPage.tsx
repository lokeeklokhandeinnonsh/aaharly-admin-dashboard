import React, { useState } from 'react';
import {
    Plus,
    Search,
    Calendar,
    Users,
    ShoppingBag,
    TrendingUp,
    TrendingDown,
    X
} from 'lucide-react';
import './OffersPage.css';

interface Coupon {
    id: number;
    code: string;
    status: 'active' | 'scheduled' | 'expired';
    description: string;
    usageCount: number;
    usageLimit: number;
    startDate?: string;
    expiryDate?: string;
    eligibility: string;
}

const MOCK_COUPONS: Coupon[] = [
    {
        id: 1,
        code: 'FOODIE50',
        status: 'active',
        description: '50% off on all dessert subscriptions',
        usageCount: 750,
        usageLimit: 1000,
        expiryDate: 'Nov 24, 2026',
        eligibility: 'First-time users'
    },
    {
        id: 2,
        code: 'LUNCH20',
        status: 'scheduled',
        description: '₹500 off on office catering orders',
        usageCount: 0,
        usageLimit: 500,
        startDate: 'Dec 01, 2026',
        eligibility: 'Min. ₹2000 order'
    },
    {
        id: 3,
        code: 'WINTER30',
        status: 'expired',
        description: 'Early winter clearance on seasonal kits',
        usageCount: 200,
        usageLimit: 200,
        expiryDate: 'Oct 31, 2025',
        eligibility: 'All users'
    }
];

export const OffersPage: React.FC = () => {
    const [filter, setFilter] = useState<'All' | 'Active' | 'Scheduled' | 'Expired'>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);

    // Filter Logic
    const filteredCoupons = coupons.filter(c => {
        if (filter === 'All') return true;
        return c.status.toLowerCase() === filter.toLowerCase();
    });

    const toggleStatus = (id: number) => {
        setCoupons(prev => prev.map(c => {
            if (c.id === id) {
                // Simple toggle logic for demo
                const newStatus = c.status === 'active' ? 'expired' : 'active';
                return { ...c, status: newStatus };
            }
            return c;
        }));
    };

    return (
        <div className="offers-page">
            {/* Stats Overview */}
            <div className="offer-stats-row">
                <div className="offer-stat-card">
                    <span className="offer-stat-label">Active Offers</span>
                    <span className="offer-stat-value">24</span>
                    <span className="offer-stat-trend trend-up"><TrendingUp size={14} /> +5%</span>
                </div>
                <div className="offer-stat-card">
                    <span className="offer-stat-label">Total Saved</span>
                    <span className="offer-stat-value">₹10.5 Lakh</span>
                    <span className="offer-stat-trend trend-down"><TrendingDown size={14} /> -2%</span>
                </div>
                <div className="offer-stat-card">
                    <span className="offer-stat-label">Redeemed</span>
                    <span className="offer-stat-value">680</span>
                    <span className="offer-stat-trend trend-up"><TrendingUp size={14} /> +12%</span>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="offers-filter-bar">
                <div className="offer-search-wrapper">
                    <Search className="offer-search-icon" size={20} />
                    <input type="text" className="offer-search-input" placeholder="Search promo codes..." />
                </div>
                <div className="filter-pills">
                    {['All', 'Active', 'Scheduled', 'Expired'].map((f) => (
                        <button
                            key={f}
                            className={`filter-pill ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f as any)}
                        >
                            {f === 'All' ? 'All Status' : f}
                            <span style={{ opacity: 0.6 }}>▾</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Coupon List */}
            <div className="coupon-list">
                {filteredCoupons.length > 0 ? (
                    filteredCoupons.map(coupon => (
                        <div key={coupon.id} className="coupon-card">
                            <div className="coupon-header">
                                <div className="coupon-title-group">
                                    <span className="coupon-code">{coupon.code}</span>
                                    <span className={`coupon-status status-${coupon.status}`}>
                                        {coupon.status.toUpperCase()}
                                    </span>
                                </div>

                                <div
                                    className={`toggle-switch ${coupon.status === 'active' ? 'on' : ''}`}
                                    onClick={() => toggleStatus(coupon.id)}
                                >
                                    <div className="toggle-thumb" />
                                </div>
                            </div>

                            <p className="coupon-desc">{coupon.description}</p>

                            <div className="usage-section">
                                <div className="usage-header">
                                    <span>Usage Limit</span>
                                    <span className="usage-nums">{coupon.usageCount} / {coupon.usageLimit}</span>
                                </div>
                                <div className="usage-track">
                                    <div
                                        className={`usage-fill ${coupon.status === 'expired' ? 'fill-grey' : 'fill-orange'}`}
                                        style={{ width: `${(coupon.usageCount / coupon.usageLimit) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="coupon-footer">
                                <div className="meta-item">
                                    <Calendar size={14} />
                                    {coupon.status === 'scheduled'
                                        ? `Starts ${coupon.startDate}`
                                        : coupon.status === 'expired'
                                            ? `Ended ${coupon.expiryDate}`
                                            : `Expires ${coupon.expiryDate}`
                                    }
                                </div>
                                <div className="meta-item">
                                    {coupon.status === 'scheduled' ? <ShoppingBag size={14} /> : <Users size={14} />}
                                    {coupon.eligibility}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-muted">No coupons found.</div>
                )}
            </div>

            {/* FAB */}
            <button className="fab-create" onClick={() => setIsModalOpen(true)}>
                <Plus size={28} />
            </button>

            {/* Modal - Basic Implementation */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel">
                        <div className="modal-header">
                            <h2>Create Offer</h2>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        {/* Simplified Form */}
                        <div>
                            <label className="block mb-2 text-sm text-muted">Coupon Code</label>
                            <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white mb-4" placeholder="e.g. SUMMER25" />

                            <label className="block mb-2 text-sm text-muted">Description</label>
                            <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white mb-4" placeholder="Discount details" />

                            <button className="btn-primary btn-block" onClick={() => setIsModalOpen(false)}>
                                Create Coupon
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
