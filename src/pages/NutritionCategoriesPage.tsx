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

export const NutritionCategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [isHoveredFab, setIsHoveredFab] = useState(false);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
    const isMobile = width <= 768;

    const styles = {
        page: {
            padding: isMobile ? '1rem' : '2rem',
            maxWidth: '1400px',
            margin: '0 auto',
            animation: 'fadeIn 0.5s ease-out',
        },
        statsRow: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
        },
        statCard: {
            padding: '1.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
        },
        statIconWrapper: {
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FF7A18 0%, #FF5722 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
        },
        statContent: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '0.25rem',
        },
        statLabel: {
            fontSize: '0.875rem',
            color: '#94a3b8',
            fontWeight: 500,
        },
        statValue: {
            fontSize: '2rem',
            fontWeight: 700,
            color: 'white',
        },
        searchBar: {
            position: 'relative' as const,
            marginBottom: '2rem',
        },
        searchInput: {
            width: '100%',
            padding: '1rem 1rem 1rem 3rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            outline: 'none',
        },
        searchIcon: {
            position: 'absolute' as const,
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94a3b8',
            pointerEvents: 'none' as const,
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '5rem',
        },
        card: (id: string) => ({
            padding: '1.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: hoveredCard === id ? '1px solid rgba(255, 122, 24, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
            transform: hoveredCard === id ? 'translateY(-4px) scale(1.02)' : 'none',
            boxShadow: hoveredCard === id ? '0 12px 32px rgba(255, 122, 24, 0.2)' : 'none',
        }),
        catIconWrapper: {
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(255, 122, 24, 0.1) 0%, rgba(255, 87, 34, 0.1) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FF7A18',
            flexShrink: 0,
        },
        catContent: {
            flex: 1,
            minWidth: 0,
        },
        catName: {
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'white',
            margin: '0 0 0.25rem 0',
        },
        catDesc: {
            fontSize: '0.875rem',
            color: '#94a3b8',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap' as const,
        },
        catMeta: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        },
        mealCount: {
            padding: '0.375rem 0.75rem',
            borderRadius: '20px',
            background: 'rgba(255, 122, 24, 0.15)',
            color: '#FF7A18',
            fontSize: '0.75rem',
            fontWeight: 600,
            whiteSpace: 'nowrap' as const,
        },
        deleteBtn: {
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.1)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0,
        },
        fab: {
            position: 'fixed' as const,
            bottom: isMobile ? '1rem' : '2rem',
            right: isMobile ? '1rem' : '2rem',
            width: isMobile ? '56px' : '64px',
            height: isMobile ? '56px' : '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF7A18 0%, #FF5722 100%)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isHoveredFab ? '0 12px 32px rgba(255, 122, 24, 0.6)' : '0 8px 24px rgba(255, 122, 24, 0.4)',
            transition: 'all 0.3s ease',
            zIndex: 100,
            transform: isHoveredFab ? 'scale(1.1) rotate(90deg)' : 'scale(1)',
        },
        emptyState: {
            gridColumn: '1 / -1',
            textAlign: 'center' as const,
            padding: '4rem 2rem',
            color: '#94a3b8',
        },
        skeleton: {
            position: 'relative' as const,
            overflow: 'hidden',
        },
    };

    return (
        <div style={styles.page}>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes skeleton-loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .text-accent-orange {
                    background: linear-gradient(135deg, #FF7A18 0%, #FF5722 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
            `}</style>

            {/* Stats Section */}
            <div style={styles.statsRow}>
                <div style={styles.statCard}>
                    <div style={styles.statIconWrapper}>
                        <Layers size={24} />
                    </div>
                    <div style={styles.statContent}>
                        <span style={styles.statLabel}>Total Categories</span>
                        <span style={styles.statValue}>{categories.length}</span>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIconWrapper}>
                        <TrendingUp size={24} />
                    </div>
                    <div style={styles.statContent}>
                        <span style={styles.statLabel}>Tagged Meals</span>
                        <span className="text-accent-orange" style={styles.statValue}>
                            {totalMeals}
                        </span>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div style={styles.searchBar}>
                <Search style={styles.searchIcon} size={20} />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
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

            {/* Category Grid */}
            <div style={styles.grid}>
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} style={{ ...styles.card(`skeleton-${i}`), ...styles.skeleton }}>
                            <div style={{ ...styles.catIconWrapper, background: 'rgba(255, 255, 255, 0.05)' }}></div>
                            <div style={styles.catContent}>
                                <div style={{ height: 16, width: '70%', background: 'rgba(255,255,255,0.05)', marginBottom: 8, borderRadius: 4 }}></div>
                                <div style={{ height: 12, width: '40%', background: 'rgba(255,255,255,0.05)', borderRadius: 4 }}></div>
                            </div>
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
                                animation: 'skeleton-loading 1.5s infinite'
                            }}></div>
                        </div>
                    ))
                ) : filteredCategories.length > 0 ? (
                    filteredCategories.map(cat => (
                        <div
                            key={cat.id}
                            style={styles.card(cat.id)}
                            onMouseEnter={() => setHoveredCard(cat.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => { /* Navigate or Details? */ }}
                        >
                            <div style={styles.catIconWrapper}>
                                <Tag size={28} />
                            </div>
                            <div style={styles.catContent}>
                                <h3 style={styles.catName}>{cat.title || cat.name}</h3>
                                <p style={styles.catDesc}>{cat.subTitle || 'No description'}</p>
                            </div>
                            <div style={styles.catMeta}>
                                <span style={styles.mealCount}>{cat.taggedMealsCount || 0} Meals</span>
                                <button
                                    style={styles.deleteBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteCategory(cat.id);
                                    }}
                                    title="Delete Category"
                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.transform = 'scale(1)'; }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={styles.emptyState}>
                        <Layers size={48} style={{ opacity: 0.3 }} />
                        <h3 style={{ fontSize: '1.5rem', margin: '1rem 0 0.5rem 0', color: 'white' }}>No categories found</h3>
                        <p style={{ margin: 0 }}>
                            {searchTerm
                                ? 'Try a different search term'
                                : 'Create your first category to get started'}
                        </p>
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            <button
                style={styles.fab}
                onClick={() => setIsModalOpen(true)}
                aria-label="Add Category"
                onMouseEnter={() => setIsHoveredFab(true)}
                onMouseLeave={() => setIsHoveredFab(false)}
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
