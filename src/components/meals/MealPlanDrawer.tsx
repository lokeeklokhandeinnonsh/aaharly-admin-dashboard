import React, { useEffect, useState } from 'react';
import { X, Save, ClipboardList, Info, DollarSign, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MealPlan, CreateMealPlanPayload } from '../../api/adminMealClient';
import toast from 'react-hot-toast';

interface MealPlanDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateMealPlanPayload) => Promise<void>;
    initialData?: MealPlan | null;
}

const sectionCard: React.CSSProperties = {
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxShadow: '0 0 20px rgba(255, 140, 0, 0.08)',
};

const sectionTitle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#f97316',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: 0,
    letterSpacing: '0.02em',
};

const labelStyle: React.CSSProperties = {
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: '#94a3b8',
    marginBottom: '0.375rem',
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(30, 41, 59, 0.6)',
    color: 'white',
    fontSize: '0.9375rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box' as const,
};

const defaultFormData: CreateMealPlanPayload = {
    name: '',
    description: '',
    duration: 'weekly',
    mealsPerDay: 3,
    category: 'General',
    price: 0,
    status: 'Active',
    planGoal: 'balanced',
    mealPreference: 'both',
};

export const MealPlanDrawer: React.FC<MealPlanDrawerProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<CreateMealPlanPayload>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description,
                duration: initialData.duration,
                mealsPerDay: initialData.mealsPerDay,
                category: initialData.category,
                price: initialData.price,
                status: initialData.status,
                planGoal: initialData.planGoal || 'balanced',
                mealPreference: initialData.mealPreference || 'both',
            });
        } else {
            setFormData(defaultFormData);
        }
    }, [initialData, isOpen]);

    // Close on ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Plan name is required');
            return;
        }
        if (formData.price <= 0) {
            toast.error('Price must be greater than 0');
            return;
        }
        setIsSubmitting(true);
        try {
            await onSave(formData);
        } catch {
            // handled upstream
        } finally {
            setIsSubmitting(false);
        }
    };

    const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.target.style.borderColor = '#f97316';
        e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)';
    };
    const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.target.style.borderColor = 'rgba(255,255,255,0.1)';
        e.target.style.boxShadow = 'none';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(6px)',
                            zIndex: 50,
                        }}
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed',
                            top: 0, right: 0, bottom: 0,
                            width: '100%',
                            maxWidth: '540px',
                            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 30, 0.99) 100%)',
                            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                            zIndex: 51,
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '1.25rem 1.5rem',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'rgba(15, 23, 42, 0.8)',
                            backdropFilter: 'blur(12px)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 88, 12, 0.2))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '1px solid rgba(249, 115, 22, 0.3)',
                                }}>
                                    <ClipboardList size={18} color="#f97316" />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', margin: 0 }}>
                                        {initialData ? 'Edit Meal Plan' : 'Create Meal Plan'}
                                    </h2>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                                        {initialData ? 'Update plan details' : 'Set up a new meal plan'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '10px',
                                    width: '36px', height: '36px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: '#94a3b8',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8'; }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                            <div style={{
                                flex: 1, overflowY: 'auto', padding: '1.5rem',
                                display: 'flex', flexDirection: 'column', gap: '1.25rem',
                            }}>

                                {/* Basic Info */}
                                <div style={sectionCard}>
                                    <h3 style={sectionTitle}><Info size={15} /> Plan Details</h3>

                                    <div>
                                        <label style={labelStyle}>Title <span style={{ color: '#f87171' }}>*</span></label>
                                        <input
                                            required
                                            name="name"
                                            placeholder="e.g. 7-Day Weight Loss Plan"
                                            value={formData.name}
                                            onChange={handleChange}
                                            style={inputStyle}
                                            onFocus={focusStyle}
                                            onBlur={blurStyle}
                                        />
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Description</label>
                                        <textarea
                                            name="description"
                                            placeholder="Brief description of this plan..."
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={3}
                                            style={{ ...inputStyle, resize: 'vertical' as const, minHeight: '80px' }}
                                            onFocus={focusStyle}
                                            onBlur={blurStyle}
                                        />
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Category</label>
                                        <input
                                            name="category"
                                            placeholder="e.g. Weight Loss, Muscle Gain"
                                            value={formData.category}
                                            onChange={handleChange}
                                            style={inputStyle}
                                            onFocus={focusStyle}
                                            onBlur={blurStyle}
                                        />
                                    </div>
                                </div>

                                {/* Configuration */}
                                <div style={sectionCard}>
                                    <h3 style={sectionTitle}><Settings size={15} /> Configuration</h3>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={labelStyle}>Duration</label>
                                            <select
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleChange}
                                                style={inputStyle}
                                            >
                                                <option value="weekly" style={{ background: '#0f172a' }}>7 Days (Weekly)</option>
                                                <option value="15_days" style={{ background: '#0f172a' }}>15 Days</option>
                                                <option value="monthly" style={{ background: '#0f172a' }}>30 Days (Monthly)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Meals Per Day</label>
                                            <input
                                                type="number"
                                                name="mealsPerDay"
                                                min={1}
                                                max={6}
                                                value={formData.mealsPerDay}
                                                onChange={handleChange}
                                                style={inputStyle}
                                                onFocus={focusStyle}
                                                onBlur={blurStyle}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={labelStyle}>Plan Goal</label>
                                            <select
                                                name="planGoal"
                                                value={formData.planGoal}
                                                onChange={handleChange}
                                                style={inputStyle}
                                            >
                                                <option value="balanced" style={{ background: '#0f172a' }}>Balanced</option>
                                                <option value="loss" style={{ background: '#0f172a' }}>Weight Loss</option>
                                                <option value="gain" style={{ background: '#0f172a' }}>Weight Gain</option>
                                                <option value="maintain" style={{ background: '#0f172a' }}>Maintenance</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Meal Preference</label>
                                            <select
                                                name="mealPreference"
                                                value={formData.mealPreference}
                                                onChange={handleChange}
                                                style={inputStyle}
                                            >
                                                <option value="both" style={{ background: '#0f172a' }}>Veg & Non-Veg</option>
                                                <option value="veg" style={{ background: '#0f172a' }}>Veg Only</option>
                                                <option value="non-veg" style={{ background: '#0f172a' }}>Non-Veg Only</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing & Status */}
                                <div style={sectionCard}>
                                    <h3 style={sectionTitle}><DollarSign size={15} /> Pricing & Status</h3>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={labelStyle}>Price (₹) <span style={{ color: '#f87171' }}>*</span></label>
                                            <input
                                                type="number"
                                                name="price"
                                                min={0}
                                                placeholder="0"
                                                value={formData.price || ''}
                                                onChange={handleChange}
                                                style={inputStyle}
                                                onFocus={focusStyle}
                                                onBlur={blurStyle}
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Status</label>
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                                style={inputStyle}
                                            >
                                                <option value="Active" style={{ background: '#0f172a' }}>Active</option>
                                                <option value="Inactive" style={{ background: '#0f172a' }}>Inactive</option>
                                                <option value="Draft" style={{ background: '#0f172a' }}>Draft</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Footer */}
                            <div style={{
                                padding: '1rem 1.5rem',
                                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                                display: 'flex',
                                gap: '0.75rem',
                                justifyContent: 'flex-end',
                                background: 'rgba(15, 23, 42, 0.95)',
                                backdropFilter: 'blur(12px)',
                            }}>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        background: 'transparent',
                                        color: '#94a3b8',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#e2e8f0'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#94a3b8'; }}
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    style={{
                                        padding: '0.75rem 1.75rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                        color: 'white',
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        boxShadow: '0 4px 16px rgba(249, 115, 22, 0.35)',
                                        opacity: isSubmitting ? 0.6 : 1,
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.boxShadow = '0 6px 24px rgba(249, 115, 22, 0.5)'; }}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(249, 115, 22, 0.35)'}
                                >
                                    <Save size={18} />
                                    {isSubmitting ? 'Saving...' : initialData ? 'Update Plan' : 'Create Plan'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
