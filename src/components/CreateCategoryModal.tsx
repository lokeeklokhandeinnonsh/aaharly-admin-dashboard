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

    return (
        <>
            <div className="modal-overlay" onClick={onClose} />
            <div className="modal-container">
                <div className="modal-header">
                    <div className="modal-title-wrapper">
                        <Sparkles size={24} className="modal-icon" />
                        <h2>Create New Category</h2>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label htmlFor="categoryName">
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
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="categoryDesc">
                            <FileText size={16} />
                            Description
                        </label>
                        <textarea
                            id="categoryDesc"
                            value={formData.subTitle}
                            onChange={(e) => setFormData({ ...formData, subTitle: e.target.value })}
                            placeholder="Brief description of this category..."
                            rows={3}
                        />
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};
