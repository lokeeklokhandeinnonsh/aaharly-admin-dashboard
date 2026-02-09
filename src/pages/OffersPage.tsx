import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Calendar,
    ShoppingBag,
    TrendingUp,
    Trash2,
    RefreshCw
} from 'lucide-react';
import './OffersPage.css';
import { CreateOfferDrawer } from '../components/offers/CreateOfferDrawer';
import { offerClient } from '../api/offerClient';
import type { Offer, OfferStats } from '../api/offerClient';

export const OffersPage: React.FC = () => {
    const [filter, setFilter] = useState<'All' | 'Active' | 'Scheduled' | 'Expired'>('All');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [stats, setStats] = useState<OfferStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadData = async () => {
        try {
            setLoading(true);
            const [offersData, statsData] = await Promise.all([
                offerClient.getOffers(page, 100), // Fetch 100 to allow client-side filtering for now
                offerClient.getStats()
            ]);
            setOffers(offersData.data);
            setTotalPages(offersData.totalPages);
            setStats(statsData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [page]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this offer?")) return;
        try {
            await offerClient.deleteOffer(id);
            setOffers(prev => prev.filter(o => o.id !== id));
        } catch (error) {
            console.error(error);
            alert("Failed to delete offer");
        }
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        // Optimistic update
        const originalOffers = [...offers];
        setOffers(prev => prev.map(o => {
            if (o.id === id) {
                return {
                    ...o,
                    status: currentStatus === 'active' ? 'disabled' : 'active'
                };
            }
            return o;
        }));

        try {
            await offerClient.toggleStatus(id);
        } catch (error) {
            console.error(error);
            // Revert on failure
            setOffers(originalOffers);
            alert("Failed to update status");
        }
    };

    const filteredCoupons = offers.filter(c => {
        if (filter === 'All') return true;
        if (filter === 'Active') return c.status === 'active';
        if (filter === 'Scheduled') return c.status === 'scheduled';
        if (filter === 'Expired') return c.status === 'expired' || c.status === 'disabled'; // Group disabled with expired or hide?
        return true;
    });

    return (
        <div className="offers-page">
            {/* Stats Overview */}
            <div className="offer-stats-row">
                <div className="offer-stat-card">
                    <span className="offer-stat-label">Active Offers</span>
                    <span className="offer-stat-value">{stats?.activeCount || 0}</span>
                    <span className="offer-stat-trend trend-up"><TrendingUp size={14} /> +{stats?.growthPercent}%</span>
                </div>
                <div className="offer-stat-card">
                    <span className="offer-stat-label">Total Redeemed</span>
                    <span className="offer-stat-value">{stats?.totalRedeemed || 0}</span>
                    <span className="offer-stat-trend trend-up"><TrendingUp size={14} /> +12%</span>
                </div>
                <div className="offer-stat-card">
                    <span className="offer-stat-label">Growth</span>
                    <span className="offer-stat-value">{stats?.growthPercent || 0}%</span>
                    <span className="offer-stat-trend trend-up"><TrendingUp size={14} /> Month/Month</span>
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
                        </button>
                    ))}
                    <button className="filter-pill" onClick={loadData}>
                        <RefreshCw size={14} className={loading && !refreshing ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Coupon List */}
            <div className="coupon-list">
                {loading && offers.length === 0 ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="text-muted">Loading...</div>
                    </div>
                ) : filteredCoupons.length > 0 ? (
                    filteredCoupons.map(coupon => (
                        <div key={coupon.id} className="coupon-card">
                            <div className="coupon-header">
                                <div className="coupon-title-group">
                                    <span className="coupon-code">{coupon.code}</span>
                                    <span className={`coupon-status status-${coupon.status}`}>
                                        {coupon.status.toUpperCase()}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <button className="text-red-400 hover:text-red-300 transition-colors"
                                        onClick={() => handleDelete(coupon.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div
                                        className={`toggle-switch ${coupon.status === 'active' ? 'on' : ''}`}
                                        onClick={() => toggleStatus(coupon.id, coupon.status)}
                                    >
                                        <div className="toggle-thumb" />
                                    </div>
                                </div>
                            </div>

                            <p className="coupon-desc">
                                {coupon.discountType === 'percentage'
                                    ? `${coupon.discountValue}% OFF`
                                    : `₹${coupon.discountValue} OFF`}
                            </p>

                            <div className="usage-section">
                                <div className="usage-header">
                                    <span>Usage</span>
                                    <span className="usage-nums">{coupon.usedCount || 0} / {coupon.maxUses || '∞'}</span>
                                </div>
                                <div className="usage-track">
                                    <div
                                        className={`usage-fill ${coupon.status === 'expired' ? 'fill-grey' : 'fill-orange'}`}
                                        style={{ width: coupon.maxUses ? `${Math.min(100, ((coupon.usedCount || 0) / coupon.maxUses) * 100)}%` : '0%' }}
                                    />
                                </div>
                            </div>

                            <div className="coupon-footer">
                                <div className="meta-item">
                                    <Calendar size={14} />
                                    {coupon.status === 'scheduled'
                                        ? `Starts ${new Date(coupon.startDate || '').toLocaleDateString()}`
                                        : `Ends ${new Date(coupon.endDate || '').toLocaleDateString()}`
                                    }
                                </div>
                                <div className="meta-item">
                                    <ShoppingBag size={14} />
                                    Min ₹{coupon.minOrder || 0}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-muted">No coupons found.</div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                        className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50 text-white"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        Prev
                    </button>
                    <span className="text-muted text-sm">Page {page} of {totalPages}</span>
                    <button
                        className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50 text-white"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* FAB */}
            <button className="fab-create" onClick={() => setIsDrawerOpen(true)}>
                <Plus size={28} />
            </button>

            {/* Create Offer Drawer */}
            <CreateOfferDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onSuccess={loadData}
            />
        </div>
    );
};
