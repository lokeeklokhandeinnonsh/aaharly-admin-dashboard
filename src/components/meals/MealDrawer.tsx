import React, { useEffect, useState, useRef } from 'react';
import { X, Save, CheckCircle, Disc, Image as ImageIcon } from 'lucide-react';
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

export const MealDrawer: React.FC<MealDrawerProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState(initialMealState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(initialMealState);
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(formData);
        } catch (error) {
            // Error already handled in hook, but just in case
            // console.error(error);
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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadClient.uploadImage(file);
            setFormData(prev => ({ ...prev, image: url }));
            toast.success('Image uploaded successfully');
        } catch (error) {
            toast.error('Failed to upload image');
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    const styles = {
        overlay: {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 50,
        },
        drawer: {
            position: 'fixed' as const,
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            maxWidth: '500px',
            background: 'rgba(15, 23, 42, 0.95)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 51,
            display: 'flex',
            flexDirection: 'column' as const,
            boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.5)',
        },
        header: {
            padding: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        title: {
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'white',
            margin: 0,
        },
        content: {
            padding: '1.5rem',
            overflowY: 'auto' as const,
            flex: 1,
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '1.5rem',
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '0.5rem',
        },
        label: {
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#94a3b8',
        },
        input: {
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            fontSize: '0.9375rem',
            outline: 'none',
            transition: 'border-color 0.2s',
        },
        row: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
        },
        footer: {
            padding: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            background: 'rgba(15, 23, 42, 0.95)',
        },
        btnCancel: {
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'transparent',
            color: '#94a3b8',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.875rem',
        },
        btnSave: {
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #FF7A18 0%, #FF5722 100%)',
            color: 'white',
            cursor: isSubmitting || isUploading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(255, 122, 24, 0.3)',
            opacity: isSubmitting || isUploading ? 0.7 : 1,
        },
        textarea: {
            minHeight: '100px',
            resize: 'vertical' as const,
        },
        imagePreview: {
            width: '100%',
            height: '200px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            overflow: 'hidden',
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={styles.overlay}
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={styles.drawer}
                    >
                        <div style={styles.header}>
                            <h2 style={styles.title}>{initialData ? 'Edit Meal' : 'Add New Meal'}</h2>
                            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={styles.content}>
                                {/* Image Upload */}
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Meal Image</label>
                                    <div
                                        style={styles.imagePreview}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {formData.image ? (
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div style={{ textAlign: 'center', color: '#64748B' }}>
                                                {isUploading ? (
                                                    <span>Uploading...</span>
                                                ) : (
                                                    <>
                                                        <ImageIcon size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                                                        <p style={{ margin: 0, fontSize: '0.875rem' }}>Click to upload image</p>
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
                                </div>

                                {/* Meal Name */}
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Meal Name</label>
                                    <input
                                        required
                                        name="name"
                                        placeholder="e.g. Grilled Chicken Salad"
                                        value={formData.name}
                                        onChange={handleChange}
                                        style={styles.input}
                                    />
                                </div>

                                {/* Type & Calories */}
                                <div style={styles.row}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Type</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            style={styles.input}
                                        >
                                            <option value="Breakfast" style={{ color: 'black' }}>Breakfast</option>
                                            <option value="Lunch" style={{ color: 'black' }}>Lunch</option>
                                            <option value="Dinner" style={{ color: 'black' }}>Dinner</option>
                                            <option value="Snack" style={{ color: 'black' }}>Snack</option>
                                        </select>
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Calories</label>
                                        <input
                                            type="number"
                                            name="calories"
                                            value={formData.calories}
                                            onChange={handleChange}
                                            style={styles.input}
                                        />
                                    </div>
                                </div>

                                {/* Macros */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Protein</label>
                                        <input
                                            name="protein"
                                            placeholder="e.g. 30g"
                                            value={formData.protein}
                                            onChange={handleChange}
                                            style={styles.input}
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Carbs</label>
                                        <input
                                            name="carbs"
                                            placeholder="e.g. 45g"
                                            value={formData.carbs}
                                            onChange={handleChange}
                                            style={styles.input}
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Fat</label>
                                        <input
                                            name="fat"
                                            placeholder="e.g. 10g"
                                            value={formData.fat}
                                            onChange={handleChange}
                                            style={styles.input}
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Description</label>
                                    <textarea
                                        name="description"
                                        placeholder="Brief description of the meal..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        style={{ ...styles.input, ...styles.textarea }}
                                    />
                                </div>

                                {/* Active Toggle */}
                                <div style={{ ...styles.formGroup, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {formData.active ? <CheckCircle size={20} color="#10B981" /> : <Disc size={20} color="#64748B" />}
                                        <span style={{ color: 'white', fontWeight: 500 }}>Active Status</span>
                                    </div>
                                    <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '24px' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.active}
                                            onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                            style={{ opacity: 0, width: 0, height: 0 }}
                                        />
                                        <span style={{
                                            position: 'absolute',
                                            cursor: 'pointer',
                                            top: 0, left: 0, right: 0, bottom: 0,
                                            backgroundColor: formData.active ? '#10B981' : '#334155',
                                            transition: '.4s',
                                            borderRadius: '34px',
                                        }}>
                                            <span style={{
                                                position: 'absolute',
                                                content: '""',
                                                height: '16px',
                                                width: '16px',
                                                left: '4px',
                                                bottom: '4px',
                                                backgroundColor: 'white',
                                                transition: '.4s',
                                                borderRadius: '50%',
                                                transform: formData.active ? 'translateX(16px)' : 'translateX(0)',
                                            }}></span>
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div style={styles.footer}>
                                <button type="button" onClick={onClose} style={styles.btnCancel}>
                                    Cancel
                                </button>
                                <button disabled={isSubmitting || isUploading} type="submit" style={styles.btnSave}>
                                    <Save size={18} />
                                    {isSubmitting ? 'Saving...' : 'Save Meal'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
