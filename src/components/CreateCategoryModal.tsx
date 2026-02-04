import React, { useState } from 'react';
import { X, Tag, FileText, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminClient } from '../api/adminClient';

interface CreateCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        subTitle: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isHoveredClose, setIsHoveredClose] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('Category name is required');
            return;
        }

        setIsSubmitting(true);
        try {
            await adminClient.createCategory({
                title: formData.title.trim(),
                subTitle: formData.subTitle.trim() || `Specialized category for ${formData.title.trim()}`
            });

            toast.success('Category created successfully!');
            setFormData({ title: '', subTitle: '' });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating category:', error);
            toast.error('Failed to create category');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const styles = {
        overlay: {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease',
        },
        container: {
            position: 'fixed' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#1e293b',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px',
            zIndex: 1001,
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'slideUp 0.3s ease',
            display: 'flex',
            flexDirection: 'column' as const,
        },
        header: {
            padding: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        titleWrapper: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
        },
        title: {
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'white',
        },
        closeBtn: {
            background: isHoveredClose ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            border: 'none',
            color: isHoveredClose ? 'white' : '#94a3b8',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        body: {
            padding: '1.5rem',
        },
        formGroup: {
            marginBottom: '1.5rem',
        },
        label: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'white',
            marginBottom: '0.5rem',
        },
        input: {
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            fontSize: '1rem',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
            outline: 'none',
        },
        textarea: {
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            fontSize: '1rem',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
            outline: 'none',
            resize: 'vertical' as const,
            minHeight: '80px',
        },
        footer: {
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            padding: '1rem 1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        },
        btnSecondary: {
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            border: 'none',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            transition: 'all 0.2s ease',
        },
        btnPrimary: {
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            border: 'none',
            background: 'linear-gradient(135deg, #FF7A18 0%, #FF5722 100%)',
            color: 'white',
            opacity: isSubmitting ? 0.7 : 1,
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(255, 122, 24, 0.2)',
        }
    };

    return (
        <>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translate(-50%, -45%); }
                    to { opacity: 1; transform: translate(-50%, -50%); }
                }
            `}</style>
            <div style={styles.overlay} onClick={onClose} />
            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.titleWrapper}>
                        <Sparkles size={24} color="#FF7A18" />
                        <h2 style={styles.title}>Create New Category</h2>
                    </div>
                    <button 
                        style={styles.closeBtn} 
                        onClick={onClose}
                        onMouseEnter={() => setIsHoveredClose(true)}
                        onMouseLeave={() => setIsHoveredClose(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={styles.body}>
                        <div style={styles.formGroup}>
                            <label htmlFor="categoryName" style={styles.label}>
                                <Tag size={16} />
                                Category Name *
                            </label>
                            <input
                                id="categoryName"
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Weight Loss, High Protein"
                                required
                                autoFocus
                                style={styles.input}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#FF7A18';
                                    e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 122, 24, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label htmlFor="categoryDesc" style={styles.label}>
                                <FileText size={16} />
                                Description
                            </label>
                            <textarea
                                id="categoryDesc"
                                value={formData.subTitle}
                                onChange={(e) => setFormData({ ...formData, subTitle: e.target.value })}
                                placeholder="Brief description of this category..."
                                rows={3}
                                style={styles.textarea}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#FF7A18';
                                    e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 122, 24, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>

                    <div style={styles.footer}>
                        <button
                            type="button"
                            style={styles.btnSecondary}
                            onClick={onClose}
                            disabled={isSubmitting}
                            onMouseEnter={(e) => { if(!isSubmitting) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
                            onMouseLeave={(e) => { if(!isSubmitting) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={styles.btnPrimary}
                            disabled={isSubmitting}
                            onMouseEnter={(e) => { 
                                if(!isSubmitting) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(255, 122, 24, 0.3)';
                                }
                            }}
                            onMouseLeave={(e) => { 
                                if(!isSubmitting) {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 122, 24, 0.2)';
                                }
                            }}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

