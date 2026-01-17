import React from 'react';
import {
    AlertTriangle,
    Plus,
    History,
    Search,
    ArrowDownCircle,
    ArrowUpCircle
} from 'lucide-react';
import './InventoryPage.css';

const MOCK_INVENTORY = [
    { id: 1, name: 'Basmati Rice', unit: 'kg', stock: 120, min: 50, status: 'ok' },
    { id: 2, name: 'Chicken Breast', unit: 'kg', stock: 12, min: 20, status: 'low' },
    { id: 3, name: 'Broccoli', unit: 'kg', stock: 5, min: 8, status: 'low' },
    { id: 4, name: 'Olive Oil', unit: 'L', stock: 45, min: 10, status: 'ok' },
    { id: 5, name: 'Packaging Containers', unit: 'units', stock: 2500, min: 500, status: 'ok' },
];

export const InventoryPage: React.FC = () => {
    // In a real app, useAuth() to check if VENDOR_ADMIN (can log waste/request) vs STAFF (log usage)

    return (
        <div className="inventory-page">
            <div className="page-header">
                <div className="title-section">
                    <h2>Inventory Management</h2>
                    <p>Real-time stock levels and usage logging.</p>
                </div>
                <div className="action-buttons">
                    <button className="btn-wastage">
                        <AlertTriangle size={18} /> Log Wastage
                    </button>
                    <button className="btn-request">
                        <Plus size={18} /> Request Stock
                    </button>
                </div>
            </div>

            {/* Low Stock Alert Banner */}
            <div className="alert-banner">
                <div className="alert-content">
                    <AlertTriangle className="alert-icon" />
                    <div className="alert-text">
                        <h4>Low Stock Alert</h4>
                        <p>2 items are below minimum quantity. Replenishment recommended.</p>
                    </div>
                </div>
                <button className="btn-view-items">View Items</button>
            </div>

            <div className="inventory-grid">
                <div className="main-column">
                    {/* Inventory List */}
                    <div className="glass-panel inventory-table-container">
                        <div className="table-header">
                            <h3>Current Stock</h3>
                            <div className="table-search">
                                <Search size={14} />
                                <input
                                    type="text"
                                    placeholder="Search item..."
                                />
                            </div>
                        </div>

                        <table className="inventory-table">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Status</th>
                                    <th className="text-right">Current Stock</th>
                                    <th className="text-right">Min. Level</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_INVENTORY.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>
                                            <span className={`status - badge ${item.status} `}>
                                                {item.status === 'low' ? 'Low Stock' : 'Adequate'}
                                            </span>
                                        </td>
                                        <td className="text-right">{item.stock} <span className="unit">{item.unit}</span></td>
                                        <td className="text-right">{item.min}</td>
                                        <td className="text-right">
                                            <button className="btn-log-usage">
                                                Log Usage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="side-panel">
                    {/* Quick Stats */}
                    <div className="glass-panel summary-card">
                        <h3>Daily Summary</h3>
                        <div className="summary-list">
                            <div className="summary-item">
                                <div className="summary-icon-box">
                                    <div className="icon-bg blue">
                                        <ArrowDownCircle size={18} />
                                    </div>
                                    <div className="summary-text">
                                        <span className="label">Stock Used</span>
                                        <span className="value">45 Items</span>
                                    </div>
                                </div>
                            </div>
                            <div className="summary-item">
                                <div className="summary-icon-box">
                                    <div className="icon-bg green">
                                        <ArrowUpCircle size={18} />
                                    </div>
                                    <div className="summary-text">
                                        <span className="label">Restocked</span>
                                        <span className="value">12 Items</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="glass-panel summary-card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <History size={16} className="text-muted" /> Recent Logs
                        </h3>
                        <div className="history-list">
                            {/* Timeline line */}
                            <div className="history-line"></div>

                            {[1, 2, 3].map(i => (
                                <div key={i} className="history-item">
                                    <div className="history-dot"></div>
                                    <p>Logged <span className="highlight">5kg Chicken</span> usage.</p>
                                    <span className="time">10:30 AM • by Staff John</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
