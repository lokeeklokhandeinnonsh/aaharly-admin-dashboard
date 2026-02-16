import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { Meal } from '../../hooks/useMealAccordion';

interface MealRowProps {
    meal: Meal;
    onEdit: (meal: Meal) => void;
    onDelete: (mealId: string) => void;
    onToggleActive: () => void;
}

export const MealRow: React.FC<MealRowProps> = ({ meal, onEdit, onDelete, onToggleActive }) => {
    const isLunch = meal.type === 'Lunch';
    const isDinner = meal.type === 'Dinner';

    // Badge Colors
    const badgeColor = isLunch ? '#22c55e' : isDinner ? '#3b82f6' : '#f59e0b';
    const badgeBg = isLunch ? 'rgba(34, 197, 94, 0.15)' : isDinner ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)';

    const styles = {
        row: {
            display: 'grid',
            gridTemplateColumns: 'minmax(200px, 2fr) 100px 100px 100px 100px 100px',
            padding: '1rem',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            transition: 'background 0.2s',
            background: 'rgba(255, 255, 255, 0.02)',
        },
        cell: {
            color: '#cbd5e1',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
        },
        name: {
            fontWeight: 600,
            color: 'white',
        },
        badge: {
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            background: badgeBg,
            color: badgeColor,
            border: `1px solid ${badgeBg.replace('0.15', '0.3')}`,
            textTransform: 'uppercase' as const,
        },
        actionBtn: {
            padding: '0.5rem',
            borderRadius: '8px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s',
            color: '#64748B',
        },
        status: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontSize: '0.75rem',
            cursor: 'pointer', // Indicates it's clickable
            padding: '0.25rem 0.5rem',
            borderRadius: '999px',
            transition: 'background 0.2s',
        },
        dot: {
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: meal.active ? '#34D399' : '#94A3B8',
        }
    };

    return (
        <div style={styles.row} className="meal-row-hover">
            <style>
                {`.meal-row-hover:hover { background: rgba(255, 255, 255, 0.05) !important; }`}
            </style>

            <div style={{ ...styles.cell, ...styles.name }}>
                {meal.name}
            </div>

            <div style={styles.cell}>
                <span style={styles.badge}>{meal.type}</span>
            </div>

            <div style={styles.cell}>
                {meal.calories} kcal
            </div>

            <div style={styles.cell}>
                {meal.protein}
            </div>

            <div style={styles.cell}>
                <div
                    style={{
                        ...styles.status,
                        background: meal.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                        color: meal.active ? '#34D399' : '#94A3B8'
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleActive();
                    }}
                    title="Click to toggle status"
                >
                    <div style={styles.dot} />
                    {meal.active ? 'Active' : 'Inactive'}
                </div>
            </div>

            <div style={{ ...styles.cell, justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                    onClick={() => onEdit(meal)}
                    style={styles.actionBtn}
                    title="Edit Meal"
                >
                    <Edit2 size={16} />
                </button>
                <button
                    onClick={() => onDelete(meal.id)}
                    style={{ ...styles.actionBtn, color: '#EF4444' }}
                    title="Delete Meal"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};
