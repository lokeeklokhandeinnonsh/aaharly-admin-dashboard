import React, { useState, useMemo, useEffect } from 'react';
import {
    Plus,
    Search,
    Calendar,
    List,
    Utensils
} from 'lucide-react';
import { MealEditor } from '../components/MealEditor';
import { MealRow } from '../components/MealRow';
import toast, { Toaster } from 'react-hot-toast';
import mealScheduleData from '../data/meal_schedule.json';
import { adminClient, type AdminMealPlanPayload, type Category, type Meal } from '../api/adminClient';
import { useAuth } from '../context/AuthContext';

export const MealsPage: React.FC = () => {
    const { role } = useAuth();
    const isSuperAdmin = role === 'SUPER_ADMIN';

    const [activeTab, setActiveTab] = useState<'library' | 'menu'>('library');
    const [meals, setMeals] = useState<Meal[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [weeklySchedule, setWeeklySchedule] = useState<any[]>([]);
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isLaptop = width <= 1024;
    const isMobile = width <= 768;

    // Fetch Data
    useEffect(() => {
        if (activeTab === 'library') {
            fetchMeals();
        } else if (activeTab === 'menu') {
            fetchCalendar();
        }
    }, [activeTab]);

    const fetchMeals = async () => {
        setIsLoading(true);
        try {
            const [mealsData, categoriesData] = await Promise.all([
                adminClient.getMeals(),
                adminClient.getCategories()
            ]);

            setMeals(mealsData);
            if (categoriesData && categoriesData.length > 0) {
                setCategories(categoriesData);
            }
        } catch (error) {
            console.error('Failed to fetch meals or categories:', error);
            toast.error('Failed to load data from server');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCalendar = async () => {
        setIsLoading(true);
        try {
            const calendarData = await adminClient.getCalendar();
            setWeeklySchedule(calendarData);
        } catch (error) {
            console.error('Failed to fetch calendar:', error);
            toast.error('Failed to load menu from server');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter Logic
    const filteredMeals = useMemo(() => {
        return meals.filter(meal => {
            const matchesSearch =
                meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                meal.category.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter =
                filterCategory === 'All' || meal.category === filterCategory;

            return matchesSearch && matchesFilter;
        });
    }, [meals, searchTerm, filterCategory]);

    // Category mapping
    const categoryMapping = useMemo(() => {
        const map: Record<string, string[]> = {};
        categories.forEach(cat => {
            const name = cat.title || cat.name || '';
            if (name && cat.id) {
                map[name] = [cat.id];
            }
        });
        return map;
    }, [categories]);

    const uniqueCategories = useMemo(() => {
        const cats = new Set(meals.map(m => m.category).filter(Boolean));
        return ['All', ...Array.from(cats)];
    }, [meals]);

    const handleAddNew = () => {
        if (!isSuperAdmin) return;
        setEditingMeal(null);
        setIsEditorOpen(true);
    };

    const handleEdit = (meal: Meal) => {
        if (!isSuperAdmin) return;
        setEditingMeal(meal);
        setIsEditorOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!isSuperAdmin) return;
        if (!confirm('Are you sure you want to delete this meal?')) return;

        try {
            await adminClient.deleteMeal(id);
            setMeals(prev => prev.filter(m => m.id !== id));
            toast.success('Meal deleted successfully');
        } catch (error) {
            console.error('Error deleting meal:', error);
            toast.error('Failed to delete meal');
        }
    };

    const handleSaveMeal = async (mealData: Partial<Meal>) => {
        try {
            const categoryName = mealData.category || '';
            const existingIds = categoryMapping[categoryName];
            const finalCategoryIds = existingIds && existingIds.length > 0 ? existingIds : [];

            const origPrice = Number(mealData.originalPrice || mealData.price || 0);
            const discPrice = Number(mealData.price || 0);
            const calcDiscount = origPrice > 0 && discPrice < origPrice
                ? Number(((origPrice - discPrice) / origPrice * 100).toFixed(2))
                : 0;

            const payload: AdminMealPlanPayload = {
                title: mealData.name?.trim() || 'Untitled',
                name: mealData.name?.trim() || 'Untitled',
                subTitle: mealData.description?.trim() || "A premium meal plan by Aaharly",
                description: mealData.description?.trim() || "A premium meal plan by Aaharly",
                originalPrice: Math.max(0, origPrice),
                discountedPrice: Math.max(0, discPrice),
                price: Math.max(0, discPrice),
                discountPercentage: calcDiscount,
                duration: Math.max(1, Number(mealData.duration || 28)),
                mealsPerDay: Math.max(1, Number(mealData.mealsPerDay || 3)),
                isActive: mealData.status === 'active',
                categoryIds: finalCategoryIds,
                coverImageUrl: mealData.image?.trim() || mealData.coverImageUrl?.trim() || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
            };

            if (editingMeal && editingMeal.id) {
                const updated = await adminClient.updateMeal(editingMeal.id, payload);
                setMeals(prev => prev.map(m => m.id === editingMeal.id ? updated : m));
                toast.success('Meal updated successfully');
            } else {
                try {
                    const created = await adminClient.createMeal(payload);
                    setMeals(prev => [created, ...prev]);
                    toast.success('Meal created successfully');
                } catch (createError: any) {
                    console.error('Detailed create error:', {
                        message: createError.message,
                        stack: createError.stack,
                        payload: payload
                    });
                    throw createError;
                }
            }
            setIsEditorOpen(false);
            setEditingMeal(null);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to save meal. Check console for details.');
        }
    };


    const getValidImageUrl = (url?: string) => {
        if (!url) return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        if (url.startsWith('/')) return url;
        return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
    };

    // Styles
    let gridTemplate = 'minmax(280px, 3fr) 140px 120px 120px 120px 100px';
    if (isLaptop) gridTemplate = '2fr 140px 1fr 120px 100px';
    if (isMobile) gridTemplate = '1fr';

    const styles = {
        page: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '24px',
            padding: isMobile ? '1rem' : '2rem',
            maxWidth: '1400px',
            margin: '0 auto',
            animation: 'fadeIn 0.5s ease-out',
        },
        header: {
            marginBottom: '2rem',
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--text-primary, #fff)',
            margin: '0 0 0.5rem 0',
        },
        subtitle: {
            fontSize: '0.875rem',
            color: 'var(--text-muted, rgba(255, 255, 255, 0.6))',
            margin: 0,
        },
        // Tabs
        tabNav: {
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '2rem',
            padding: '0.25rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            width: 'fit-content',
        },
        tabBtn: (active: boolean) => ({
            padding: '0.75rem 1.5rem',
            border: 'none',
            background: active ? 'linear-gradient(135deg, #FF7A18 0%, #FF5722 100%)' : 'transparent',
            color: active ? 'white' : 'var(--text-muted, rgba(255,255,255,0.6))',
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: active ? '0 4px 12px rgba(255, 122, 24, 0.3)' : 'none',
        }),
        // Controls
        controlsRow: {
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap' as const,
            alignItems: 'center',
            flexDirection: isMobile ? 'column' as const : 'row' as const,
        },
        searchWrapper: {
            position: 'relative' as const,
            flex: 1,
            minWidth: isMobile ? '100%' : '250px',
        },
        searchInput: {
            width: '100%',
            padding: '0.875rem 1rem 0.875rem 3rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            fontSize: '0.875rem',
            outline: 'none',
        },
        searchIcon: {
            position: 'absolute' as const,
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted, rgba(255,255,255,0.6))',
            pointerEvents: 'none' as const,
        },
        filterSelect: {
            padding: '0.875rem 1rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            fontSize: '0.875rem',
            cursor: 'pointer',
            minWidth: '150px',
            outline: 'none',
        },
        btnAdd: {
            padding: '0.875rem 1.5rem',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #FF7A18 0%, #FF5722 100%)',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(255, 122, 24, 0.3)',
        },
        // List Header
        listHeader: {
            display: isMobile ? 'none' : 'grid',
            gridTemplateColumns: gridTemplate,
            padding: '0 1.5rem',
            marginBottom: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-secondary, #cbd5e1)',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.5px',
            gap: '1.5rem',
            alignItems: 'center',
        },
        list: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '0.75rem',
            marginBottom: '5rem',
        },
        // Weekly Menu
        weeklyMenu: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '1.5rem',
        },
        daySection: {
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.05)',
        },
        dayHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem',
        },
        dayIcon: {
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(255, 122, 24, 0.1) 0%, rgba(255, 87, 34, 0.1) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FF7A18',
        },
        mealsGrid: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
        },
        menuMealCard: {
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            overflow: 'hidden',
            cursor: 'pointer',
        },
        menuMealImage: {
            width: '100%',
            height: '180px',
            background: 'rgba(255, 255, 255, 0.02)',
        },
        menuMealContent: {
            padding: '1rem',
        },
        mealTypeBadge: (type: string) => {
            // Basic colors
            let bg = 'rgba(34, 197, 94, 0.15)', color = '#22c55e'; // Green (General/Lunch)
            const t = type.toLowerCase();
            if (t.includes('fat') || t.includes('breakfast')) { bg = 'rgba(255, 122, 24, 0.15)'; color = '#FF7A18'; }
            if (t.includes('gain') || t.includes('dinner')) { bg = 'rgba(59, 130, 246, 0.15)'; color = '#3b82f6'; }

            return {
                display: 'inline-block',
                padding: '0.25rem 0.625rem',
                borderRadius: '12px',
                fontSize: '0.625rem',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                marginBottom: '0.5rem',
                background: bg,
                color: color,
                border: `1px solid ${bg.replace('0.15', '0.3')}`
            };
        },
        menuMealName: {
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: 'var(--text-primary, #fff)',
            margin: '0 0 0.375rem 0',
            lineHeight: 1.4,
        },
        menuMealCategory: {
            fontSize: '0.75rem',
            color: 'var(--text-muted, rgba(255,255,255,0.6))',
            margin: 0,
        },
        emptyState: {
            textAlign: 'center' as const,
            padding: '4rem 2rem',
            color: 'var(--text-muted, rgba(255,255,255,0.6))',
        },
        skeletonRow: {
            display: 'grid',
            gridTemplateColumns: gridTemplate,
            gap: '1rem',
            padding: '1.5rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            alignItems: 'center',
            animation: 'pulse 1.5s infinite',
        }
    };

    // Render Weekly Menu View
    const renderWeeklyMenu = () => {
        // Fallback to mock data if backend calendar is empty
        const schedule = (weeklySchedule && weeklySchedule.length > 0)
            ? weeklySchedule
            : mealScheduleData as any[];

        if (isLoading && (!weeklySchedule || weeklySchedule.length === 0)) {
            return (
                <div style={styles.weeklyMenu}>
                    <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ ...styles.daySection, height: '200px', animation: 'pulse 1.5s infinite' }}></div>
                    ))}
                </div>
            );
        }

        return (
            <div style={styles.weeklyMenu}>
                {schedule.map((dayData) => (
                    <div key={dayData.day} style={styles.daySection} className="glass-panel">
                        <div style={styles.dayHeader}>
                            <div style={styles.dayIcon}>
                                <Calendar size={20} />
                            </div>
                            <h3 style={{ ...styles.title, fontSize: '1.125rem' }}>{dayData.day}</h3>
                        </div>
                        <div style={styles.mealsGrid}>
                            {dayData.meals.map((item: any, idx: number) => (
                                <div
                                    key={idx}
                                    style={styles.menuMealCard}
                                    onClick={() => console.log('Edit day entry', item)}
                                >
                                    <div style={styles.menuMealImage}>
                                        <img
                                            src={getValidImageUrl(item.mealImage || item.image)}
                                            alt={item.mealName || item.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={styles.menuMealContent}>
                                        <span style={styles.mealTypeBadge(item.categoryType || item.type || 'general')}>
                                            {item.categoryTitle || item.type}
                                        </span>
                                        <h4 style={styles.menuMealName}>{item.mealName || item.name}</h4>
                                        <p style={styles.menuMealCategory}>{item.categoryTitle || item.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={styles.page}>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                option { background: #0f172a; color: white; }
            `}</style>
            <Toaster position="top-right" />

            {/* Page Header */}
            <div style={styles.header}>
                <h2 style={styles.title}>Meal Management</h2>
                <p style={styles.subtitle}>Manage global food catalog and weekly schedules.</p>
            </div>

            {/* Tab Navigation */}
            <div style={styles.tabNav}>
                <button
                    style={styles.tabBtn(activeTab === 'library')}
                    onClick={() => setActiveTab('library')}
                >
                    <List size={18} />
                    Meal Library
                </button>
                <button
                    style={styles.tabBtn(activeTab === 'menu')}
                    onClick={() => setActiveTab('menu')}
                >
                    <Calendar size={18} />
                    Weekly Menu
                </button>
            </div>

            {/* Library View */}
            {activeTab === 'library' && (
                <>
                    {/* Controls Row */}
                    <div style={styles.controlsRow}>
                        <div style={styles.searchWrapper}>
                            <Search style={styles.searchIcon} size={20} />
                            <input
                                type="text"
                                placeholder="Search meals..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>

                        <select
                            style={styles.filterSelect}
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            {uniqueCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        {isSuperAdmin && (
                            <button style={styles.btnAdd} onClick={handleAddNew}>
                                <Plus size={20} />
                                Add New Meal
                            </button>
                        )}
                    </div>

                    {/* List Header */}
                    {!isMobile && (
                        <div style={styles.listHeader}>
                            <span>Meal Details</span>
                            <span>Category</span>
                            {!isLaptop && <span>Configuration</span>}
                            <span style={{ textAlign: isLaptop ? 'center' : 'right' as const }}>Pricing</span>
                            <span style={{ textAlign: 'center' }}>Status</span>
                            <span style={{ textAlign: 'right' }}>Actions</span>
                        </div>
                    )}

                    {/* Meals List */}
                    <div style={styles.list}>
                        {isLoading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} style={styles.skeletonRow}></div>
                                ))}
                            </div>
                        ) : filteredMeals.length > 0 ? (
                            filteredMeals.map(meal => (
                                <MealRow
                                    key={meal.id}
                                    meal={meal}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    isLaptop={isLaptop}
                                    isMobile={isMobile}
                                />
                            ))
                        ) : (
                            <div style={styles.emptyState}>
                                <Utensils size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
                                <h3 style={{ ...styles.title, marginBottom: '0.5rem' }}>No meals found</h3>
                                <p style={{ margin: '0 0 1.5rem 0' }}>
                                    {searchTerm || filterCategory !== 'All'
                                        ? 'Try adjusting your filters'
                                        : 'Create your first meal to get started'}
                                </p>
                                {isSuperAdmin && !searchTerm && filterCategory === 'All' && (
                                    <button style={styles.btnAdd} onClick={handleAddNew}>
                                        <Plus size={20} />
                                        Add First Meal
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Weekly Menu View */}
            {activeTab === 'menu' && renderWeeklyMenu()}

            {/* Meal Editor Modal */}
            {isEditorOpen && (
                <MealEditor
                    isOpen={isEditorOpen}
                    onClose={() => {
                        setIsEditorOpen(false);
                        setEditingMeal(null);
                    }}
                    onSave={handleSaveMeal}
                    initialData={editingMeal}
                    categories={categories}
                />
            )}
        </div>
    );
};
