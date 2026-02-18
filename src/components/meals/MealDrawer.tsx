import React, { useEffect, useState, useRef } from 'react';
import { X, Save, CheckCircle, XCircle, Image as ImageIcon, Upload, Trash2, Info, Flame, FileText, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Meal } from '../../hooks/useMealAccordion';
import { uploadClient } from '../../api/uploadClient';
import toast from 'react-hot-toast';

interface MealDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (meal: Omit<Meal, 'id'>) => Promise<void>;
    initialData?: Meal | null;
}

const initialMealState: Omit<Meal, 'id'> = {
    name: '',
    type: 'Lunch',
    calories: 0,
    protein: '',
    carbs: '',
    fat: '',
    description: '',
    active: true,
    image: '',
};

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

export const MealDrawer: React.FC<MealDrawerProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState(initialMealState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(initialMealState);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Meal name is required');
            return;
        }
        setIsSubmitting(true);
        try {
            await onSave(formData);
        } catch {
            // Error handled upstream
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleFileUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }
        setIsUploading(true);
        setUploadProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => Math.min(prev + 15, 85));
        }, 200);

        try {
            const url = await uploadClient.uploadImage(file);
            clearInterval(progressInterval);
            setUploadProgress(100);
            setFormData(prev => ({ ...prev, image: url }));
            toast.success('Image uploaded successfully');
        } catch {
            clearInterval(progressInterval);
            toast.error('Failed to upload image');
        } finally {
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
            }, 500);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) await handleFileUpload(file);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) await handleFileUpload(file);
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: '' }));
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
                        {/* ─── Header ─── */}
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
                                    <Tag size={18} color="#f97316" />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', margin: 0 }}>
                                        {initialData ? 'Edit Meal' : 'Add New Meal'}
                                    </h2>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                                        {initialData ? 'Update meal details below' : 'Fill in the meal details'}
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {initialData && (
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.6875rem',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        background: formData.active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                        color: formData.active ? '#34d399' : '#f87171',
                                        border: `1px solid ${formData.active ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                    }}>
                                        {formData.active ? 'Active' : 'Inactive'}
                                    </span>
                                )}
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
                        </div>

                        {/* ─── Scrollable Body ─── */}
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                            <div style={{
                                flex: 1, overflowY: 'auto', padding: '1.5rem',
                                display: 'flex', flexDirection: 'column', gap: '1.25rem',
                            }}>

                                {/* ── Section: Basic Info ── */}
                                <div style={sectionCard}>
                                    <h3 style={sectionTitle}><Info size={15} /> Basic Information</h3>

                                    <div>
                                        <label style={labelStyle}>Meal Name <span style={{ color: '#f87171' }}>*</span></label>
                                        <input
                                            required
                                            name="name"
                                            placeholder="e.g. Grilled Chicken Salad"
                                            value={formData.name}
                                            onChange={handleChange}
                                            style={inputStyle}
                                            onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; }}
                                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Description</label>
                                        <textarea
                                            name="description"
                                            placeholder="Brief description of this meal..."
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={3}
                                            style={{
                                                ...inputStyle,
                                                resize: 'vertical' as const,
                                                minHeight: '80px',
                                            }}
                                            onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; }}
                                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={labelStyle}>Category</label>
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleChange}
                                                style={inputStyle}
                                            >
                                                <option value="Breakfast" style={{ background: '#0f172a' }}>Breakfast</option>
                                                <option value="Lunch" style={{ background: '#0f172a' }}>Lunch</option>
                                                <option value="Dinner" style={{ background: '#0f172a' }}>Dinner</option>
                                                <option value="Snack" style={{ background: '#0f172a' }}>Snack</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Type</label>
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleChange}
                                                style={inputStyle}
                                            >
                                                <option value="Breakfast" style={{ background: '#0f172a' }}>Breakfast</option>
                                                <option value="Lunch" style={{ background: '#0f172a' }}>Lunch</option>
                                                <option value="Dinner" style={{ background: '#0f172a' }}>Dinner</option>
                                                <option value="Snack" style={{ background: '#0f172a' }}>Snack</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Section: Nutrition ── */}
                                <div style={sectionCard}>
                                    <h3 style={sectionTitle}><Flame size={15} /> Nutrition Information</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={labelStyle}>Calories (kcal)</label>
                                            <input
                                                type="number"
                                                name="calories"
                                                placeholder="0"
                                                value={formData.calories || ''}
                                                onChange={handleChange}
                                                style={inputStyle}
                                                onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; }}
                                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Protein</label>
                                            <input
                                                name="protein"
                                                placeholder="e.g. 30g"
                                                value={formData.protein}
                                                onChange={handleChange}
                                                style={inputStyle}
                                                onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; }}
                                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Carbs</label>
                                            <input
                                                name="carbs"
                                                placeholder="e.g. 45g"
                                                value={formData.carbs}
                                                onChange={handleChange}
                                                style={inputStyle}
                                                onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; }}
                                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Fat</label>
                                            <input
                                                name="fat"
                                                placeholder="e.g. 10g"
                                                value={formData.fat}
                                                onChange={handleChange}
                                                style={inputStyle}
                                                onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; }}
                                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ── Section: Image Upload ── */}
                                <div style={sectionCard}>
                                    <h3 style={sectionTitle}><ImageIcon size={15} /> Media</h3>

                                    {formData.image ? (
                                        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
                                            <img
                                                src={formData.image}
                                                alt="Meal Preview"
                                                style={{
                                                    width: '100%', height: '200px', objectFit: 'cover',
                                                    borderRadius: '12px',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                style={{
                                                    position: 'absolute', top: '0.75rem', right: '0.75rem',
                                                    background: 'rgba(239, 68, 68, 0.9)',
                                                    border: 'none', borderRadius: '10px',
                                                    width: '34px', height: '34px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer', color: 'white',
                                                    backdropFilter: 'blur(8px)',
                                                    transition: 'transform 0.2s',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                                title="Remove Image"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                                            onDragLeave={() => setIsDragOver(false)}
                                            onDrop={handleDrop}
                                            style={{
                                                border: `2px dashed ${isDragOver ? '#f97316' : 'rgba(255,255,255,0.12)'}`,
                                                borderRadius: '14px',
                                                padding: '2rem',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                background: isDragOver ? 'rgba(249, 115, 22, 0.05)' : 'rgba(255,255,255,0.02)',
                                                transition: 'all 0.3s',
                                                minHeight: '160px',
                                            }}
                                        >
                                            {isUploading ? (
                                                <div style={{ textAlign: 'center', width: '100%' }}>
                                                    <Upload size={28} color="#f97316" style={{ marginBottom: '0.75rem', animation: 'pulse 1.5s infinite' }} />
                                                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
                                                        Uploading... {uploadProgress}%
                                                    </p>
                                                    <div style={{
                                                        width: '80%', height: '4px', borderRadius: '2px',
                                                        background: 'rgba(255,255,255,0.1)', margin: '0 auto',
                                                        overflow: 'hidden',
                                                    }}>
                                                        <div style={{
                                                            width: `${uploadProgress}%`, height: '100%',
                                                            background: 'linear-gradient(90deg, #f97316, #ea580c)',
                                                            borderRadius: '2px',
                                                            transition: 'width 0.3s',
                                                        }} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div style={{
                                                        width: '48px', height: '48px', borderRadius: '12px',
                                                        background: 'rgba(249, 115, 22, 0.1)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        marginBottom: '0.75rem',
                                                        border: '1px solid rgba(249, 115, 22, 0.2)',
                                                    }}>
                                                        <Upload size={22} color="#f97316" />
                                                    </div>
                                                    <p style={{ color: '#e2e8f0', fontSize: '0.875rem', fontWeight: 500, margin: '0 0 0.25rem 0' }}>
                                                        Click to upload or drag and drop
                                                    </p>
                                                    <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0 }}>
                                                        PNG, JPG or WebP (max 5MB)
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                {/* ── Section: Status Toggle ── */}
                                <div style={sectionCard}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            {formData.active ? (
                                                <CheckCircle size={22} color="#10b981" style={{ filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.5))' }} />
                                            ) : (
                                                <XCircle size={22} color="#64748b" />
                                            )}
                                            <div>
                                                <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9375rem' }}>Active Status</span>
                                                <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0.125rem 0 0 0' }}>
                                                    {formData.active ? 'Meal is visible to customers' : 'Meal is hidden from customers'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Glass Toggle */}
                                        <label style={{
                                            position: 'relative', display: 'inline-block',
                                            width: '48px', height: '26px', cursor: 'pointer',
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.active}
                                                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                                style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                                            />
                                            <span style={{
                                                position: 'absolute',
                                                top: 0, left: 0, right: 0, bottom: 0,
                                                backgroundColor: formData.active ? '#10b981' : '#334155',
                                                borderRadius: '34px',
                                                transition: 'all 0.3s',
                                                boxShadow: formData.active
                                                    ? '0 0 12px rgba(16, 185, 129, 0.4), inset 0 1px 2px rgba(0,0,0,0.1)'
                                                    : 'inset 0 1px 2px rgba(0,0,0,0.2)',
                                            }}>
                                                <span style={{
                                                    position: 'absolute',
                                                    height: '20px', width: '20px',
                                                    left: '3px', bottom: '3px',
                                                    backgroundColor: 'white',
                                                    borderRadius: '50%',
                                                    transition: 'transform 0.3s',
                                                    transform: formData.active ? 'translateX(22px)' : 'translateX(0)',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                }} />
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* ── Section: Instructions ── */}
                                <div style={sectionCard}>
                                    <h3 style={sectionTitle}><FileText size={15} /> Instructions</h3>

                                    <div>
                                        <label style={labelStyle}>Cooking Instructions</label>
                                        <textarea
                                            name="cookingInstructions"
                                            placeholder="Step-by-step cooking notes..."
                                            value={(formData as any).cookingInstructions || ''}
                                            onChange={handleChange}
                                            rows={3}
                                            style={{
                                                ...inputStyle,
                                                resize: 'vertical' as const,
                                                minHeight: '70px',
                                            }}
                                            onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; }}
                                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Packaging Instructions</label>
                                        <textarea
                                            name="packagingInstructions"
                                            placeholder="Packaging and handling notes..."
                                            value={(formData as any).packagingInstructions || ''}
                                            onChange={handleChange}
                                            rows={3}
                                            style={{
                                                ...inputStyle,
                                                resize: 'vertical' as const,
                                                minHeight: '70px',
                                            }}
                                            onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; }}
                                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ─── Sticky Footer ─── */}
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
                                    disabled={isSubmitting || isUploading}
                                    type="submit"
                                    style={{
                                        padding: '0.75rem 1.75rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                        color: 'white',
                                        cursor: isSubmitting || isUploading ? 'not-allowed' : 'pointer',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        boxShadow: '0 4px 16px rgba(249, 115, 22, 0.35)',
                                        opacity: isSubmitting || isUploading ? 0.6 : 1,
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { if (!isSubmitting && !isUploading) e.currentTarget.style.boxShadow = '0 6px 24px rgba(249, 115, 22, 0.5)'; }}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(249, 115, 22, 0.35)'}
                                >
                                    <Save size={18} />
                                    {isSubmitting ? 'Saving...' : 'Save Meal'}
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Global animation styles */}
                    <style>{`
                        @keyframes pulse {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.5; }
                        }
                    `}</style>
                </>
            )}
        </AnimatePresence>
    );
};
