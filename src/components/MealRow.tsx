import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { Meal } from "../api/adminClient";

interface MealRowProps {
    meal: Meal;
    onEdit: (meal: Meal) => void;
    onDelete: (id: string) => void;
    isLaptop?: boolean;
    isMobile?: boolean; // max-width: 768px
}

export const MealRow: React.FC<MealRowProps> = ({
    meal,
    onEdit,
    onDelete,
    isLaptop = false,
    isMobile = false
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [editHover, setEditHover] = useState(false);
    const [deleteHover, setDeleteHover] = useState(false);

    // Grid Logic
    // Desktop: 3fr 140px 120px 120px 120px 100px
    // Laptop: Config is hidden. Grid: 2fr 1.5fr (Price) 1fr (Status) 100px (Actions) - Adjusted to fit content
    // Mobile: 1fr
    let gridTemplate = 'minmax(280px, 3fr) 140px 120px 120px 120px 100px';
    if (isLaptop) gridTemplate = '2fr 140px 1fr 120px 100px'; // 5 cols (Config hidden)
    if (isMobile) gridTemplate = '1fr';

    const styles = {
        row: {
            display: 'grid',
            gridTemplateColumns: gridTemplate,
            gap: isMobile ? '1rem' : '1.5rem',
            padding: '1.25rem 1.5rem',
            borderRadius: '12px',
            alignItems: 'center',
            transition: 'all 0.2s ease',
            border: isHovered ? '1px solid rgba(255, 122, 24, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
            transform: isHovered ? 'translateY(-2px)' : 'none',
            boxShadow: isHovered ? '0 8px 24px rgba(255, 122, 24, 0.15)' : 'none',
        },
        column: {
            position: 'relative' as const,
        },
        // Meal Details
        mealDetails: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '0.25rem',
        },
        name: {
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text-primary, #fff)',
            margin: 0,
        },
        desc: {
            fontSize: '0.875rem',
            color: 'var(--text-muted, rgba(255,255,255,0.6))',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap' as const,
        },
        // Category
        categoryWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobile ? 'flex-start' : 'center',
            minWidth: 0,
        },
        categoryPill: {
            padding: '0.375rem 0.875rem',
            borderRadius: '20px',
            background: 'rgba(255, 122, 24, 0.1)',
            border: '1px solid rgba(255, 122, 24, 0.3)',
            color: '#FF7A18',
            fontSize: '0.75rem',
            fontWeight: 600,
            maxWidth: '120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap' as const,
            textAlign: 'center' as const,
        },
        // Config
        config: {
            display: isLaptop || isMobile ? 'none' : 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            textAlign: 'center' as const,
            gap: '0.5rem',
        },
        configItem: {
            display: 'flex', // Corrected flex property syntax
            flexDirection: 'column' as const,
            gap: '0.125rem',
        },
        configLabel: {
            fontSize: '0.625rem',
            color: 'var(--text-muted, rgba(255,255,255,0.6))',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
            opacity: 0.6,
        },
        configValue: {
            fontSize: '0.875rem',
            color: 'var(--text-primary, #fff)',
            fontWeight: 600,
        },
        // Pricing
        pricing: {
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: isMobile ? 'flex-start' : 'flex-end',
            gap: '0.25rem',
            minWidth: 0,
            whiteSpace: 'nowrap' as const,
        },
        pricePrimary: {
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--text-primary, #fff)',
        },
        priceOriginal: {
            fontSize: '0.875rem',
            color: 'var(--text-muted, rgba(255,255,255,0.6))',
            textDecoration: 'line-through',
        },
        // Status
        status: {
            display: 'flex',
            justifyContent: isMobile ? 'flex-start' : 'center',
            alignItems: 'center',
        },
        // Actions
        actions: {
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            justifyContent: isMobile ? 'flex-start' : 'flex-end',
            opacity: isHovered || isMobile ? 1 : 0.6,
            transition: 'opacity 0.2s ease',
        },
        actionBtn: (hover: boolean, variant: 'edit' | 'delete') => ({
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: 'none',
            background: hover
                ? (variant === 'edit' ? 'rgba(255, 122, 24, 0.15)' : 'rgba(239, 68, 68, 0.15)')
                : 'rgba(255, 255, 255, 0.05)',
            color: hover
                ? (variant === 'edit' ? '#FF7A18' : '#ef4444')
                : 'var(--text-muted, rgba(255,255,255,0.6))',
            cursor: 'pointer',
            display: 'flex', // Corrected flex property syntax
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
        }),
    };

    return (
        <div
            style={styles.row}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Meal Details */}
            <div style={styles.mealDetails}>
                <h3 style={styles.name}>{meal.name}</h3>
                <p style={styles.desc}>{meal.description || meal.subTitle || 'No description'}</p>
            </div>

            {/* Category Badge */}
            <div style={styles.categoryWrapper}>
                <span style={styles.categoryPill}>{meal.category || 'General'}</span>
            </div>

            {/* Configuration */}
            {/* Render but it might be hidden by styles.config.display */}
            <div style={styles.config}>
                <div style={styles.configItem}>
                    <span style={styles.configLabel}>Duration</span>
                    <span style={styles.configValue}>{meal.duration || 28} days</span>
                </div>
                <div style={styles.configItem}>
                    <span style={styles.configLabel}>Meals/Day</span>
                    <span style={styles.configValue}>{meal.mealsPerDay || 3}</span>
                </div>
            </div>

            {/* Pricing */}
            <div style={styles.pricing}>
                <span style={styles.pricePrimary}>{meal.currency || '₹'}{meal.price || 0}</span>
                {(meal.originalPrice ?? 0) > (meal.price ?? 0) && (
                    <span style={styles.priceOriginal}>{meal.currency || '₹'}{meal.originalPrice}</span>
                )}
            </div>

            {/* Status */}
            <div style={styles.status}>
                <MealStatusBadge status={meal.isActive ? 'active' : 'inactive'} />
            </div>

            {/* Actions */}
            <div style={styles.actions}>
                <button
                    style={styles.actionBtn(editHover, 'edit')}
                    onClick={() => onEdit(meal)}
                    title="Edit Meal"
                    onMouseEnter={() => setEditHover(true)}
                    onMouseLeave={() => setEditHover(false)}
                >
                    <Edit2 size={18} />
                </button>
                <button
                    style={styles.actionBtn(deleteHover, 'delete')}
                    onClick={() => meal.id && onDelete(meal.id)}
                    title="Delete Meal"
                    onMouseEnter={() => setDeleteHover(true)}
                    onMouseLeave={() => setDeleteHover(false)}
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
    let bg = 'rgba(251, 146, 60, 0.1)';
    let border = 'rgba(251, 146, 60, 0.3)';
    let color = '#fb923c';
    let text = 'Draft';

    if (status === 'active') {
        bg = 'rgba(34, 197, 94, 0.1)';
        border = 'rgba(34, 197, 94, 0.3)';
        color = '#22c55e';
        text = 'Active';
    } else if (status === 'inactive') {
        bg = 'rgba(156, 163, 175, 0.1)';
        border = 'rgba(156, 163, 175, 0.3)';
        color = '#9ca3af';
        text = 'Inactive';
    }

    const style = {
        padding: '0.375rem 0.875rem',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 600,
        whiteSpace: 'nowrap' as const,
        background: bg,
        border: `1px solid ${border}`,
        color: color,
        display: 'inline-block',
    };

    return (
        <span style={style}>
            {text}
        </span>
    );
};

