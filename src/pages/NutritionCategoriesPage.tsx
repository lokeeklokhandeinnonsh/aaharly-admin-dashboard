import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Layers,
    Tag,
    TrendingUp,
    Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminClient } from '../api/adminClient';
import type { Category } from '../api/adminClient';
import { CreateCategoryModal } from '../components/CreateCategoryModal';
import './NutritionCategories.css';

export const NutritionCategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await adminClient.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this category? This might affect associated meal plans.')) return;

        try {
            await adminClient.deleteCategory(id);
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete category');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const filteredCategories = categories.filter(cat =>
        cat.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalMeals = categories.reduce((acc, cat) => acc + (cat.taggedMealsCount || 0), 0);

    return (
        <div className="categories-page">
            {/* Stats Section */}
            <div className="cat-stats-row">
                <div className="cat-stat-card glass-panel">
                    <div className="stat-icon-wrapper">
                        <Layers size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="cat-stat-label">Total Categories</span>
                        <span className="cat-stat-value">{categories.length}</span>
                    </div>
                </div>
                <div className="cat-stat-card glass-panel">
                    <div className="stat-icon-wrapper">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="cat-stat-label">Tagged Meals</span>
                        <span className="cat-stat-value text-accent-orange">
                            {totalMeals}
                        </span>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="cat-search-bar">
                <Search className="cat-search-icon" size={20} />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Category Grid */}
            <div className="categories-grid">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="category-card glass-panel skeleton">
                            <div className="skeleton-icon"></div>
                            <div className="skeleton-content">
                                <div className="skeleton-line"></div>
                                <div className="skeleton-line short"></div>
                            </div>
                        </div>
                    ))
                ) : filteredCategories.length > 0 ? (
                    filteredCategories.map(cat => (
                        <div key={cat.id} className="category-card glass-panel">
                            <div className="cat-icon-wrapper">
                                <Tag size={28} />
                            </div>
                            <div className="cat-content">
                                <h3 className="cat-name">{cat.title || cat.name}</h3>
                                <p className="cat-desc">{cat.subTitle || 'No description'}</p>
                            </div>
                            <div className="cat-meta">
                                <span className="meal-count">{cat.taggedMealsCount || 0} Meals</span>
                                <button
                                    className="cat-delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteCategory(cat.id);
                                    }}
                                    title="Delete Category"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <Layers size={48} style={{ opacity: 0.3 }} />
                        <h3>No categories found</h3>
                        <p>
                            {searchTerm
                                ? 'Try a different search term'
                                : 'Create your first category to get started'}
                        </p>
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            <button
                className="fab-add"
                onClick={() => setIsModalOpen(true)}
                aria-label="Add Category"
            >
                <Plus size={24} strokeWidth={3} />
            </button>

            {/* Create Category Modal */}
            <CreateCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchCategories}
            />
        </div>
    );
};
