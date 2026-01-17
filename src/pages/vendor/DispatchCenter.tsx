import React from 'react';
import {
    Truck,
    MapPin,
    CheckCircle,
    Phone
} from 'lucide-react';
import './DispatchCenter.css';

const DELIVERY_TASKS = [
    { id: 'ORD-1209', time: '12:30 PM', address: 'Plot 45, Indiranagar, BLR', status: 'ready', items: 3 },
    { id: 'ORD-1215', time: '01:00 PM', address: 'Tech Park, Whitefield', status: 'pending', items: 5 },
    { id: 'ORD-1233', time: '01:15 PM', address: 'Apartment 402, Koramangala', status: 'delayed', items: 2 },
];

export const DispatchCenter: React.FC = () => {
    return (
        <div className="dispatch-center">
            <div className="page-header">
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>Dispatch Center</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage handovers and delivery partners.</p>
                </div>
                <div className="stats-container">
                    <div className="stat-card">
                        <span className="value">12</span>
                        <span className="label">Ready</span>
                    </div>
                    <div className="stat-card">
                        <span className="value">05</span>
                        <span className="label">Pending</span>
                    </div>
                </div>
            </div>

            {/* Timeline View */}
            <div className="timeline-view">
                {DELIVERY_TASKS.map(task => (
                    <div key={task.id} className="dispatch-card-wrapper">
                        <div className={`dispatch-card ${task.status}`}>
                            <div className="card-left">
                                <div className="time-slot">
                                    <span className="time">{task.time}</span>
                                    <span className={`status-label ${task.status}`}>
                                        {task.status}
                                    </span>
                                </div>

                                <div className="divider-vertical"></div>

                                <div className="order-details">
                                    <h4>
                                        {task.id}
                                        <span className="meal-count">({task.items} meals)</span>
                                    </h4>
                                    <div className="address-line">
                                        <MapPin size={14} /> {task.address}
                                    </div>
                                </div>
                            </div>

                            <div className="card-actions">
                                {task.status === 'ready' ? (
                                    <button className="btn-handover">
                                        <CheckCircle size={16} /> Handover Complete
                                    </button>
                                ) : (
                                    <button className="btn-mark-ready">
                                        <Truck size={16} /> Mark Ready
                                    </button>
                                )}
                                <button className="btn-call">
                                    <Phone size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
