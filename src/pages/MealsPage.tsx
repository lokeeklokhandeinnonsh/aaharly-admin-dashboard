import React, { useState, useMemo, useEffect } from 'react';
import {
    Plus,
    Search,
    Calendar,
    List,
    Utensils,
} from 'lucide-react';
import { MealDrawer } from '../components/meals/MealDrawer';
import { MealPlanDrawer } from '../components/meals/MealPlanDrawer';
import { MealPlanAccordion } from '../components/meals/MealPlanAccordion';
import { DeleteConfirmModal } from '../components/meals/DeleteConfirmModal';
import { useMealAccordion } from '../hooks/useMealAccordion';
import { Toaster } from 'react-hot-toast';
import mealScheduleData from '../data/meal_schedule.json';
import { adminClient } from '../api/adminClient';
import { useAuth } from '../context/AuthContext';

export const MealsPage: React.FC = () => {
    const { role } = useAuth();
    const isSuperAdmin = role === 'SUPER_ADMIN';

    // Hook Integration
    const {
        mealPlans,
        expandedPlanId,
        loadingPlanIds,
        toggleAccordion,
        isLoadingPlans,

        // Plan CRUD
        deletePlan,
        editPlan,
        addPlan,
        savePlan,

        // Plan Drawer
        isPlanDrawerOpen,
        editingPlan,
        closePlanDrawer,

        // Delete Modal
        deleteModalOpen,
        isDeleting,
        confirmDeletePlan,
        cancelDeletePlan,

        // Meal CRUD
        isDrawerOpen,
        editingMeal,
        openAddMealDrawer,
        openEditMealDrawer,
        closeDrawer,
        saveMeal,
        deleteMeal,
        toggleMealActive,
    } = useMealAccordion();

    const [activeTab, setActiveTab] = useState<'library' | 'menu'>('library');
    const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [weeklySchedule, setWeeklySchedule] = useState<any[]>([]);
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = width <= 768;

    // Fetch Calendar Data (Only for Menu Tab)
    useEffect(() => {
        if (activeTab === 'menu') {
            fetchCalendar();
        }
    }, [activeTab]);

    const fetchCalendar = async () => {
        setIsLoadingCalendar(true);
        try {
            const calendarData = await adminClient.getCalendar();
            setWeeklySchedule(calendarData);
        } catch (error) {
            console.error('Failed to fetch calendar:', error);
        } finally {
            setIsLoadingCalendar(false);
        }
    };

    // Filter Logic
    const filteredPlans = useMemo(() => {
        return mealPlans.filter(plan => {
            const matchesSearch =
                plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                plan.description.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter =
                filterCategory === 'All' || plan.category === filterCategory;

            return matchesSearch && matchesFilter;
        });
    }, [mealPlans, searchTerm, filterCategory]);

    const uniqueCategories = useMemo(() => {
        const cats = new Set(mealPlans.map(p => p.category).filter(Boolean));
        return ['All', ...Array.from(cats)];
    }, [mealPlans]);

    // Styles
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
            let bg = 'rgba(34, 197, 94, 0.15)', color = '#22c55e';
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
            height: '80px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.03)',
            marginBottom: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            animation: 'pulse 1.5s infinite',
        }
    };

    // Render Weekly Menu View
    const renderWeeklyMenu = () => {
        const schedule = (weeklySchedule && weeklySchedule.length > 0)
            ? weeklySchedule
            : mealScheduleData as any[];

        if (isLoadingCalendar && (!weeklySchedule || weeklySchedule.length === 0)) {
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
                                            src={item.mealImage || item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
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
                <p style={styles.subtitle}>Manage global food catalog and meal plans.</p>
            </div>

            {/* Tab Navigation */}
            <div style={styles.tabNav}>
                <button
                    style={styles.tabBtn(activeTab === 'library')}
                    onClick={() => setActiveTab('library')}
                >
                    <List size={18} />
                    Meal Plans
                </button>
                <button
                    style={styles.tabBtn(activeTab === 'menu')}
                    onClick={() => setActiveTab('menu')}
                >
                    <Calendar size={18} />
                    Weekly Menu
                </button>
            </div>

            {/* Library View (Accordion) */}
            {activeTab === 'library' && (
                <>
                    {/* Controls Row */}
                    <div style={styles.controlsRow}>
                        <div style={styles.searchWrapper}>
                            <Search style={styles.searchIcon} size={20} />
                            <input
                                type="text"
                                placeholder="Search meal plans..."
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
                            <button style={styles.btnAdd} onClick={addPlan}>
                                <Plus size={20} />
                                Add Plan
                            </button>
                        )}
                    </div>

                    {/* Meal Plans Accordion */}
                    {isLoadingPlans ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={styles.skeletonRow}></div>
                            ))}
                        </div>
                    ) : filteredPlans.length === 0 ? (
                        <div style={styles.emptyState}>
                            <Utensils size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
                            <h3 style={{ ...styles.title, marginBottom: '0.5rem' }}>No meal plans found</h3>
                            <p style={{ margin: '0 0 1.5rem 0' }}>
                                {searchTerm || filterCategory !== 'All'
                                    ? 'Try adjusting your filters'
                                    : 'Create your first meal plan to get started'}
                            </p>
                            {isSuperAdmin && !searchTerm && filterCategory === 'All' && (
                                <button style={styles.btnAdd} onClick={addPlan}>
                                    <Plus size={20} />
                                    Add First Plan
                                </button>
                            )}
                        </div>
                    ) : (
                        <MealPlanAccordion
                            plans={filteredPlans}
                            expandedPlanId={expandedPlanId}
                            onToggle={toggleAccordion}
                            onAddMeal={openAddMealDrawer}
                            onEditMeal={openEditMealDrawer}
                            onDeleteMeal={deleteMeal}
                            onDeletePlan={deletePlan}
                            onEditPlan={editPlan}
                            loadingPlanIds={loadingPlanIds}
                            onToggleMealActive={toggleMealActive}
                        />
                    )}

                    {/* Meal Editor Drawer */}
                    <MealDrawer
                        isOpen={isDrawerOpen}
                        onClose={closeDrawer}
                        onSave={saveMeal}
                        initialData={editingMeal}
                    />

                    {/* Meal Plan Drawer (Create/Edit) */}
                    <MealPlanDrawer
                        isOpen={isPlanDrawerOpen}
                        onClose={closePlanDrawer}
                        onSave={savePlan}
                        initialData={editingPlan}
                    />

                    {/* Delete Confirmation Modal */}
                    <DeleteConfirmModal
                        isOpen={deleteModalOpen}
                        onClose={cancelDeletePlan}
                        onConfirm={confirmDeletePlan}
                        isDeleting={isDeleting}
                        title="Delete Meal Plan"
                        message="Are you sure you want to delete this plan? This will remove all associated meals from subscriptions."
                    />
                </>
            )}

            {/* Weekly Menu View */}
            {activeTab === 'menu' && renderWeeklyMenu()}
        </div>
    );
};
