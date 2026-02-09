
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    User,
    Store,
    Package,
    MapPin,
    CreditCard
} from 'lucide-react';
import type { Order } from '../../types/order';
import './OrderDetailsDrawer.css';

interface OrderDetailsDrawerProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
}

export const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({ order, isOpen, onClose }) => {

    if (!order && !isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && order && (
                <>
                    <motion.div
                        className="drawer-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="order-details-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="drawer-header">
                            <div className="header-content">
                                <h2 className="drawer-title">
                                    Order Details
                                    <span className="order-id-badge">#{order.id.split('-')[1]}</span>
                                </h2>
                                <span className={`order - status - badge status - ${order.status} `}>
                                    {order.status.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <button className="close-drawer-btn" onClick={onClose}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="drawer-content">
                            {/* Customer Section */}
                            <div className="drawer-section">
                                <h3 className="section-title">
                                    <User size={18} /> Customer Info
                                </h3>
                                <div className="info-card">
                                    <div className="info-row">
                                        <span className="info-label">Name</span>
                                        <span className="info-value">{order.customer.name}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Email</span>
                                        <span className="info-value text-sm">{order.customer.email}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Phone</span>
                                        <span className="info-value">{order.customer.phone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Info */}
                            <div className="drawer-section">
                                <h3 className="section-title">
                                    <MapPin size={18} /> Delivery Details
                                </h3>
                                <div className="info-card">
                                    <div className="info-row">
                                        <span className="info-label">Address</span>
                                        <span className="info-value" style={{ maxWidth: '60%' }}>
                                            {order.deliveryAddress.street}, {order.deliveryAddress.city}
                                        </span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Pincode</span>
                                        <span className="info-value">{order.deliveryAddress.zipCode}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Date</span>
                                        <span className="info-value">
                                            {new Date(order.deliveryDate).toLocaleDateString(undefined, {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Vendor Section */}
                            <div className="drawer-section">
                                <h3 className="section-title">
                                    <Store size={18} /> Vendor Info
                                </h3>
                                <div className="info-card">
                                    <div className="info-row">
                                        <span className="info-label">Kitchen</span>
                                        <span className="info-value">{order.vendor.name}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Contact</span>
                                        <span className="info-value">{order.vendor.contactPhone}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Location</span>
                                        <span className="info-value" style={{ maxWidth: '60%' }}>{order.vendor.address}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Plan Section */}
                            <div className="drawer-section">
                                <h3 className="section-title">
                                    <Package size={18} /> Subscription Plan
                                </h3>
                                <div className="info-card">
                                    <div className="info-row">
                                        <span className="info-label">Plan Name</span>
                                        <span className="info-value">{order.plan.name}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Type</span>
                                        <span className="info-value">{order.plan.type}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Meals/Day</span>
                                        <span className="info-value">{order.plan.mealsPerDay}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Section */}
                            <div className="drawer-section">
                                <h3 className="section-title">
                                    <CreditCard size={18} /> Payment Info
                                </h3>
                                <div className="info-card">
                                    <div className="info-row">
                                        <span className="info-label">Amount</span>
                                        <span className="info-value text-xl font-bold">₹{order.amount}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Status</span>
                                        <span className="info-value capitalize" style={{
                                            color: order.paymentStatus === 'paid' ? '#22c55e' :
                                                order.paymentStatus === 'refunded' ? '#ef4444' : '#fb923c'
                                        }}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="drawer-footer">
                            <button className="btn-secondary">Download Invoice</button>
                            <button className="btn-secondary text-red-400 border-red-900 hover:bg-red-900/20">Cancel Order</button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
