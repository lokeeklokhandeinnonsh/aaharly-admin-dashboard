import React, { useState, useMemo, useEffect } from 'react';
import {
    Plus,
    Search,
    Calendar,
    List,
    Utensils
} from 'lucide-react';
import './MealsPage.css';
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

    // Handlers
    // const refreshCategories = async () => {
    //     try {
    //         const categoriesList = await adminClient.getCategories();
    //         setCategories(categoriesList);
    //     } catch (e) { console.warn('Failed to refresh categories'); }
    // };

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
                // Important: Use the returned 'updated' object which contains the server-side resolved isActive state
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
        if (url.startsWith('/')) return url; // Allow absolute paths
        return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"; // Fallback for bare filenames
    };

    // Render Weekly Menu View
    const renderWeeklyMenu = () => {
        // Fallback to mock data if backend calendar is empty
        const schedule = (weeklySchedule && weeklySchedule.length > 0)
            ? weeklySchedule
            : mealScheduleData as any[];

        if (isLoading && (!weeklySchedule || weeklySchedule.length === 0)) {
            return (
                <div className="weekly-menu">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="day-section skeleton-row" style={{ height: '200px' }}></div>
                    ))}
                </div>
            );
        }

        return (
            <div className="weekly-menu">
                {schedule.map((dayData) => (
                    <div key={dayData.day} className="day-section glass-panel">
                        <div className="day-header">
                            <div className="day-icon">
                                <Calendar size={20} />
                            </div>
                            <h3 className="day-title">Day {dayData.day}</h3>
                        </div>
                        <div className="meals-grid">
                            {dayData.meals.map((item: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="menu-meal-card"
                                    onClick={() => console.log('Edit day entry', item)}
                                >
                                    <div className="menu-meal-image">
                                        <img src={getValidImageUrl(item.mealImage || item.image)} alt={item.mealName || item.name} />
                                    </div>
                                    <div className="menu-meal-content">
                                        <span className={`meal-type-badge meal-type-${(item.categoryType || item.type || 'general').toLowerCase().replace(/\s+/g, '-')}`}>
                                            {item.categoryTitle || item.type}
                                        </span>
                                        <h4 className="menu-meal-name">{item.mealName || item.name}</h4>
                                        <p className="menu-meal-category">{item.categoryTitle || item.category}</p>
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
        <div className="meals-page animate-fade-in">
            <Toaster position="top-right" />

            {/* Page Header */}
            <div className="page-header">
                <h2 className="page-title">Meal Management</h2>
                <p className="page-subtitle">Manage global food catalog and weekly schedules.</p>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button
                    className={`tab-btn ${activeTab === 'library' ? 'active' : ''}`}
                    onClick={() => setActiveTab('library')}
                >
                    <List size={18} />
                    Meal Library
                </button>
                <button
                    className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
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
                    <div className="controls-row">
                        <div className="search-wrapper">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search meals..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <select
                            className="filter-select"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            {uniqueCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        {isSuperAdmin && (
                            <button className="btn-add-meal" onClick={handleAddNew}>
                                <Plus size={20} />
                                Add New Meal
                            </button>
                        )}
                    </div>

                    {/* List Header */}
                    <div className="meals-list-header">
                        <span className="header-label">Meal Details</span>
                        <span className="header-label">Category</span>
                        <span className="header-label">Configuration</span>
                        <span className="header-label">Pricing</span>
                        <span className="header-label">Status</span>
                        <span className="header-label">Actions</span>
                    </div>

                    {/* Meals List */}
                    <div className="meals-list">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="skeleton-row">
                                    <div className="skeleton-content">
                                        <div className="skeleton-line"></div>
                                        <div className="skeleton-line short"></div>
                                    </div>
                                    <div className="skeleton-pill"></div>
                                    <div className="skeleton-content">
                                        <div className="skeleton-line short"></div>
                                        <div className="skeleton-line short"></div>
                                    </div>
                                    <div className="skeleton-line short"></div>
                                    <div className="skeleton-pill"></div>
                                    <div className="skeleton-line short"></div>
                                </div>
                            ))
                        ) : filteredMeals.length > 0 ? (
                            filteredMeals.map(meal => (
                                <MealRow
                                    key={meal.id}
                                    meal={meal}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            <div className="empty-state">
                                <Utensils size={48} className="empty-state-icon" />
                                <h3>No meals found</h3>
                                <p>
                                    {searchTerm || filterCategory !== 'All'
                                        ? 'Try adjusting your filters'
                                        : 'Create your first meal to get started'}
                                </p>
                                {isSuperAdmin && !searchTerm && filterCategory === 'All' && (
                                    <button className="btn-add-meal" onClick={handleAddNew}>
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
