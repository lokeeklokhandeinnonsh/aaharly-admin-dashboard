import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import type { MealPlan, Meal } from '../../hooks/useMealAccordion';
import { MealRow } from './MealRow';

interface MealPlanAccordionProps {
    plans: MealPlan[];
    expandedPlanId: string | null;
    onToggle: (planId: string) => void;
    onAddMeal: (planId: string) => void;
    onEditMeal: (planId: string, meal: Meal) => void;
    onDeleteMeal: (planId: string, mealId: string) => void;
    onDeletePlan: (planId: string) => void;
    onEditPlan: (planId: string) => void;
    loadingPlanIds: Set<string>;
    onToggleMealActive: (planId: string, mealId: string, currentStatus: boolean) => void;
}

export const MealPlanAccordion: React.FC<MealPlanAccordionProps> = ({
    plans,
    expandedPlanId,
    onToggle,
    onAddMeal,
    onEditMeal,
    onDeleteMeal,
    onDeletePlan,
    onEditPlan,
    loadingPlanIds,
    onToggleMealActive
}) => {

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {plans.map((plan) => (
                <MealPlanCard
                    key={plan.id}
                    plan={plan}
                    isExpanded={expandedPlanId === plan.id}
                    isLoading={loadingPlanIds.has(plan.id)}
                    onToggle={() => onToggle(plan.id)}
                    onAddMeal={() => onAddMeal(plan.id)}
                    onEditMeal={onEditMeal}
                    onDeleteMeal={onDeleteMeal}
                    onDeletePlan={() => onDeletePlan(plan.id)}
                    onEditPlan={() => onEditPlan(plan.id)}
                    onToggleMealActive={onToggleMealActive}
                />
            ))}
        </div>
    );
};

interface MealPlanCardProps {
    plan: MealPlan;
    isExpanded: boolean;
    isLoading: boolean;
    onToggle: () => void;
    onAddMeal: () => void;
    onEditMeal: (planId: string, meal: Meal) => void;
    onDeleteMeal: (planId: string, mealId: string) => void;
    onDeletePlan: () => void;
    onEditPlan: () => void;
    onToggleMealActive: (planId: string, mealId: string, currentStatus: boolean) => void;
}

const MealPlanCard: React.FC<MealPlanCardProps> = ({
    plan,
    isExpanded,
    isLoading,
    onToggle,
    onAddMeal,
    onEditMeal,
    onDeleteMeal,
    onDeletePlan,
    onEditPlan,
    onToggleMealActive
}) => {
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

    const styles = {
        card: {
            background: 'rgba(30, 41, 59, 0.4)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${isExpanded ? '#FF7A00' : 'rgba(255, 255, 255, 0.08)'}`,
            borderRadius: '16px',
            overflow: 'hidden',
            transition: 'border-color 0.3s ease',
            boxShadow: isExpanded ? '0 0 20px rgba(255, 122, 0, 0.1)' : 'none',
        },
        header: {
            padding: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'minmax(200px, 2fr) 1fr 1fr 1fr 1fr 1fr 100px 40px',
            alignItems: 'center',
            cursor: 'pointer',
            gap: '1rem',
            background: isExpanded ? 'rgba(255, 122, 0, 0.05)' : 'transparent',
        },
        titleGroup: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '0.25rem',
        },
        title: {
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'white',
            margin: 0,
        },
        description: {
            fontSize: '0.875rem',
            color: '#94a3b8',
            whiteSpace: 'nowrap' as const,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '300px',
        },
        meta: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '0.25rem',
            fontSize: '0.875rem',
            color: '#cbd5e1',
        },
        label: {
            fontSize: '0.75rem',
            color: '#64748B',
            textTransform: 'uppercase' as const,
            fontWeight: 600,
            letterSpacing: '0.05em',
        },
        badge: {
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#cbd5e1',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            width: 'fit-content',
        },
        price: {
            fontSize: '1rem',
            fontWeight: 700,
            color: '#FF7A00',
        },
        actions: {
            display: 'flex',
            gap: '0.5rem',
            opacity: isExpanded ? 1 : 0.5,
            transition: 'opacity 0.2s',
        },
        actionBtn: {
            padding: '0.5rem',
            borderRadius: '8px',
            border: 'none',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        content: {
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(0, 0, 0, 0.2)',
        },
        tableHeader: {
            display: 'grid',
            gridTemplateColumns: 'minmax(200px, 2fr) 100px 100px 100px 100px 100px',
            padding: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#64748B',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
        },
        addButton: {
            width: '100%',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: 'none',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            color: '#FF7A00',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'background 0.2s',
        },
        loadingState: {
            padding: '2rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#94a3b8',
        }
    };

    return (
        <div style={styles.card}>
            {/* Header */}
            <div style={styles.header} onClick={onToggle}>
                <div style={styles.titleGroup}>
                    <h3 style={styles.title}>{plan.name}</h3>
                    <p style={styles.description}>{plan.description}</p>
                </div>

                <div style={styles.meta}>
                    <span style={styles.label}>Category</span>
                    <span>{plan.category}</span>
                </div>

                <div style={styles.meta}>
                    <span style={styles.label}>Duration</span>
                    <span>{plan.duration} Days • {plan.mealsPerDay} Meals/Day</span>
                </div>

                <div style={styles.meta}>
                    <span style={styles.label}>Price</span>
                    <span style={styles.price}>{formatPrice(plan.price)}</span>
                </div>

                <div style={styles.meta}>
                    <span style={styles.label}>Diet</span>
                    <div style={{
                        ...styles.badge,
                        background: plan.mealPreference === 'veg' ? 'rgba(34, 197, 94, 0.15)' :
                            plan.mealPreference === 'non-veg' ? 'rgba(239, 68, 68, 0.15)' :
                                'rgba(249, 115, 22, 0.15)',
                        color: plan.mealPreference === 'veg' ? '#22c55e' :
                            plan.mealPreference === 'non-veg' ? '#ef4444' :
                                '#f97316',
                        borderColor: plan.mealPreference === 'veg' ? 'rgba(34, 197, 94, 0.3)' :
                            plan.mealPreference === 'non-veg' ? 'rgba(239, 68, 68, 0.3)' :
                                'rgba(249, 115, 22, 0.3)',
                    }}>
                        {plan.mealPreference?.replace('-', ' ').toUpperCase() || 'BOTH'}
                    </div>
                </div>

                <div style={styles.badge}>
                    {plan.status.toUpperCase()}
                </div>

                <div style={styles.actions} onClick={e => e.stopPropagation()}>
                    <button style={styles.actionBtn} onClick={onEditPlan} title="Edit Plan">
                        <Edit2 size={16} />
                    </button>
                    <button style={{ ...styles.actionBtn, color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)' }} onClick={onDeletePlan} title="Delete Plan">
                        <Trash2 size={16} />
                    </button>
                </div>

                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ color: isExpanded ? '#FF7A00' : '#64748B' }}
                >
                    <ChevronDown size={20} />
                </motion.div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={styles.content}>
                            {isLoading ? (
                                <div style={styles.loadingState}>
                                    <Loader2 className="animate-spin" size={24} />
                                </div>
                            ) : (
                                <>
                                    {/* Table Header */}
                                    <div style={styles.tableHeader}>
                                        <span>Meal Name</span>
                                        <span>Type</span>
                                        <span>Calories</span>
                                        <span>Protein</span>
                                        <span>Status</span>
                                        <span style={{ textAlign: 'right' }}>Actions</span>
                                    </div>

                                    {/* Meal Rows */}
                                    {plan.meals.map(meal => (
                                        <MealRow
                                            key={meal.id}
                                            meal={meal}
                                            onEdit={(m) => onEditMeal(plan.id, m)}
                                            onDelete={(mid) => onDeleteMeal(plan.id, mid)}
                                            onToggleActive={() => onToggleMealActive(plan.id, meal.id, meal.active)}
                                        />
                                    ))}

                                    {/* Add Meal Button */}
                                    <button
                                        style={styles.addButton}
                                        onClick={onAddMeal}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 122, 0, 0.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                                    >
                                        <Plus size={18} />
                                        Add Meal to Plan
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
