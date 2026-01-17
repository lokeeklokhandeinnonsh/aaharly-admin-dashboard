import React from 'react';
import {
    Users,
    Utensils,
    CheckSquare,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './KitchenPrepPage.css';

const PREP_TASKS = [
    { id: 1, meal: 'Grilled Chicken Salad', station: 'Cold Prep', qty: 45, status: 'done', assignee: 'John D.' },
    { id: 2, meal: 'Vegan Buddha Bowl', station: 'Assembly', qty: 22, status: 'active', assignee: 'Sarah M.' },
    { id: 3, meal: 'Protein Shake (Choco)', station: 'Beverage', qty: 60, status: 'pending', assignee: 'Unassigned' },
];

export const KitchenPrepPage: React.FC = () => {
    const { role } = useAuth();
    const isManager = role === 'VENDOR_ADMIN';

    return (
        <div className="kitchen-prep-page">
            <div className="page-header">
                <div className="title-section">
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>Kitchen Prep</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        {isManager ? 'Monitor station status and reassign staff.' : 'Your assigned tasks for today.'}
                    </p>
                </div>
                {isManager && (
                    <div className="header-actions">
                        <span className="alert-pill">
                            <AlertCircle size={14} /> 2 Delays Reported
                        </span>
                    </div>
                )}
            </div>

            <div className="prep-grid">
                {PREP_TASKS.map(task => (
                    <div key={task.id} className="glass-panel prep-card">
                        <div>
                            <div className="prep-header">
                                <span className="station-label">{task.station}</span>
                                <span className={`status-badge-sm ${task.status}`}>
                                    {task.status}
                                </span>
                            </div>
                            <h3 className="prep-title">{task.meal}</h3>
                            <div className="prep-meta">
                                <span className="meta-item"><Utensils size={14} /> {task.qty} units</span>
                                {isManager && (
                                    <span className="meta-item"><Users size={14} /> {task.assignee}</span>
                                )}
                            </div>
                        </div>

                        <div className="prep-actions">
                            {isManager ? (
                                <>
                                    <button className="btn-secondary-sm">
                                        Reassign
                                    </button>
                                    <button className="btn-accent-ghost-sm">
                                        View Details
                                    </button>
                                </>
                            ) : (
                                <button className="btn-primary-block">
                                    <CheckSquare size={16} /> Mark Complete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
