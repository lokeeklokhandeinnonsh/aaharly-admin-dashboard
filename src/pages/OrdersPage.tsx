import React, { useState, useEffect } from 'react';
import {
    Search,
    Download,
    Filter,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { adminOrderClient, type DashboardOrderResponse } from '../api/adminOrderClient';
import { OrderDetailsDrawer } from '../components/orders/OrderDetailsDrawer';
import './OrdersPage.css';
import toast from 'react-hot-toast';

export const OrdersPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Real Data State
    const [orders, setOrders] = useState<DashboardOrderResponse[]>([]);
    // const [stats, setStats] = useState({ totalOrders: 0, completed: 0, pending: 0, revenue: 0 }); // Placeholder
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await adminOrderClient.getOrders(page, 20);
            setOrders(response.orders);
            setTotalPages(response.totalPages);
            // setStats based on response if available or separate stats API
        } catch (error) {
            console.error('Failed to fetch orders', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page]);

    // Simple client-side search for now (API supports filters too if needed)
    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewOrder = (order: any) => {
        // Map flat order to structure expected by Drawer if needed, or update Drawer
        // For now, passing flat object
        setSelectedOrder(order);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setTimeout(() => setSelectedOrder(null), 300);
    };

    return (
        <div className="orders-page">
            <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

            {/* Stats Overview - Placeholder or Real if API sends it */}
            <div className="orders-stats-row">
                {/* ... Keeping stats cards same structure but mapped to valid data ... */}
                {/*  (Simplifying visual stats for now as they require aggregation API) */}
            </div>

            {/* Filter Bar */}
            <div className="orders-filter-bar">
                <div className="order-search-wrapper">
                    <Search className="order-search-icon" size={18} />
                    <input
                        type="text"
                        className="order-search-input"
                        placeholder="Search by Order ID, Customer, or Vendor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-actions">
                    <button className="btn-filter" onClick={() => fetchOrders()}>
                        <Filter size={16} /> Reflex
                    </button>
                    <button className="btn-export">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="orders-table-container">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading orders...</div>
                ) : (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Vendor</th>
                                <th>Meal/Plan</th>
                                <th>Address</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>
                                            <span className="font-mono text-gray-300">#{order.id.slice(0, 8)}</span>
                                        </td>
                                        <td>
                                            {new Date(order.date).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="customer-cell">
                                                <span className="font-medium">{order.userName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="vendor-cell">
                                                <span>{order.vendorName}</span>
                                            </div>
                                        </td>
                                        <td>{order.mealName}</td>
                                        <td>
                                            <span className="sub-text truncate max-w-[150px]" title={order.address}>{order.address}</span>
                                        </td>
                                        <td>
                                            <span className={`order-status-badge status-${order.deliveryStatus || order.status}`}>
                                                {order.deliveryStatus || order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-view"
                                                onClick={() => handleViewOrder(order)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center py-8 text-gray-400">
                                        No orders found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
                <div className="pagination">
                    <button
                        className="p-1 hover:bg-white/10 rounded disabled:opacity-50"
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
                    <button
                        className="p-1 hover:bg-white/10 rounded disabled:opacity-50"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Details Drawer */}
            <OrderDetailsDrawer
                order={selectedOrder}
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
            />
        </div>
    );
};
