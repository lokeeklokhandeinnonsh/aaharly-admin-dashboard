import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { Meal } from "../api/adminClient";

interface MealRowProps {
    meal: Meal;
    onEdit: (meal: Meal) => void;
    onDelete: (id: string) => void;
}

export const MealRow: React.FC<MealRowProps> = ({ meal, onEdit, onDelete }) => {
    return (
        <div className="meal-row glass-panel">
            {/* Meal Details */}
            <div className="meal-details">
                <h3 className="meal-name">{meal.name}</h3>
                <p className="meal-desc">{meal.description || 'No description'}</p>
            </div>

            {/* Category Badge */}
            <div className="meal-category">
                <span className="category-pill">{meal.category || 'General'}</span>
            </div>

            {/* Configuration */}
            <div className="meal-config">
                <div className="config-item">
                    <span className="config-label">Duration</span>
                    <span className="config-value">{meal.duration || 28} days</span>
                </div>
                <div className="config-item">
                    <span className="config-label">Meals/Day</span>
                    <span className="config-value">{meal.mealsPerDay || 3}</span>
                </div>
            </div>

            {/* Pricing */}
            <div className="meal-pricing">
                <span className="price-primary">{meal.currency || '₹'}{meal.price || 0}</span>
                {meal.originalPrice && meal.originalPrice > meal.price && (
                    <span className="price-original">{meal.currency || '₹'}{meal.originalPrice}</span>
                )}
            </div>

            {/* Status */}
            <div className="meal-status">
                <MealStatusBadge status={meal.status} />
            </div>

            {/* Actions */}
            <div className="meal-actions">
                <button
                    className="action-btn edit-btn"
                    onClick={() => onEdit(meal)}
                    title="Edit Meal"
                >
                    <Edit2 size={18} />
                </button>
                <button
                    className="action-btn delete-btn"
                    onClick={() => meal.id && onDelete(meal.id)}
                    title="Delete Meal"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

interface MealStatusBadgeProps {
    status: string;
}

export const MealStatusBadge: React.FC<MealStatusBadgeProps> = ({ status }) => {
    const statusClass = status === 'active' ? 'status-active' :
        status === 'inactive' ? 'status-inactive' :
            'status-draft';

    const statusText = status === 'active' ? 'Active' :
        status === 'inactive' ? 'Inactive' :
            'Draft';

    return (
        <span className={`status-badge ${statusClass}`}>
            {statusText}
        </span>
    );
};
