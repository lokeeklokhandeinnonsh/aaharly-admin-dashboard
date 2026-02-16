import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { adminMealClient } from '../api/adminMealClient';
import type { MealPlan, Meal, CreateMealPayload, UpdateMealPayload } from '../api/adminMealClient';

export type { MealPlan, Meal };

export const useMealAccordion = () => {
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
    const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
    const [isLoadingPlans, setIsLoadingPlans] = useState(false);
    const [loadingPlanIds, setLoadingPlanIds] = useState<Set<string>>(new Set());

    // Cache for meals to prevent re-fetching (optional, but good for UX)
    // We update this cache on CRUD operations
    const [mealsCache, setMealsCache] = useState<Record<string, Meal[]>>({});

    // Fetch Plans on Mount
    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        setIsLoadingPlans(true);
        try {
            const plans = await adminMealClient.getAllMealPlans();
            setMealPlans(plans);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load meal plans');
        } finally {
            setIsLoadingPlans(false);
        }
    };

    // Accordion Logic
    const toggleAccordion = async (planId: string) => {
        if (expandedPlanId === planId) {
            setExpandedPlanId(null);
            return;
        }

        setExpandedPlanId(planId);

        // Lazy load meals only if not already in cache or we want to refresh
        if (!mealsCache[planId]) {
            await fetchMealsForPlan(planId);
        }
    };

    const fetchMealsForPlan = async (planId: string) => {
        setLoadingPlanIds(prev => {
            const next = new Set(prev);
            next.add(planId);
            return next;
        });

        try {
            const meals = await adminMealClient.getMealsByPlanId(planId);
            setMealsCache(prev => ({
                ...prev,
                [planId]: meals
            }));

            // Also update the mealPlans state to reflect these meals 
            setMealPlans(prev => prev.map(p =>
                p.id === planId ? { ...p, meals } : p
            ));
        } catch (error) {
            console.error(error);
            toast.error('Failed to load meals');
        } finally {
            setLoadingPlanIds(prev => {
                const next = new Set(prev);
                next.delete(planId);
                return next;
            });
        }
    };

    // Plan Actions
    const deletePlan = async (planId: string) => {
        if (!confirm('Are you sure you want to delete this meal plan?')) return;

        try {
            await adminMealClient.deleteMealPlan(planId);
            setMealPlans(prev => prev.filter(p => p.id !== planId));
            if (expandedPlanId === planId) setExpandedPlanId(null);
            toast.success('Meal plan deleted');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete meal plan');
        }
    };

    const editPlan = (_planId: string) => {
        toast('Edit Plan feature coming soon!', { icon: '🚧' });
        // Can open a PlanDrawer here if needed
    };

    const addPlan = () => {
        toast('Add Plan feature coming soon!', { icon: '🚧' });
        // Can open a PlanDrawer here if needed
    };

    // Meal Actions (Open Drawer)
    const openAddMealDrawer = (planId: string) => {
        setCurrentPlanId(planId);
        setEditingMeal(null);
        setIsDrawerOpen(true);
    };

    const openEditMealDrawer = (planId: string, meal: Meal) => {
        setCurrentPlanId(planId);
        setEditingMeal(meal);
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setEditingMeal(null);
        setCurrentPlanId(null);
    };

    // Save Meal (Add or Update)
    const saveMeal = async (mealData: Omit<Meal, 'id'>) => {
        if (!currentPlanId) return;

        try {
            let updatedMeal: Meal;

            if (editingMeal) {
                // Update
                const payload: UpdateMealPayload = {
                    name: mealData.name,
                    type: mealData.type,
                    calories: mealData.calories,
                    protein: mealData.protein.replace('g', ''),
                    carbs: mealData.carbs.replace('g', ''),
                    fat: mealData.fat.replace('g', ''),
                    description: mealData.description,
                    active: mealData.active,
                    image: mealData.image,
                };
                updatedMeal = await adminMealClient.updateMeal(editingMeal.id, payload);
                toast.success('Meal updated successfully');
            } else {
                // Create
                const payload: CreateMealPayload = {
                    planId: currentPlanId,
                    name: mealData.name,
                    type: mealData.type,
                    calories: mealData.calories,
                    protein: mealData.protein.replace('g', ''),
                    carbs: mealData.carbs.replace('g', ''),
                    fat: mealData.fat.replace('g', ''),
                    description: mealData.description,
                    active: mealData.active,
                    image: mealData.image,
                };
                updatedMeal = await adminMealClient.createMeal(payload);
                toast.success('Meal added successfully');
            }

            // Update local state and cache
            updateLocalMealState(currentPlanId, updatedMeal, !!editingMeal);
            closeDrawer();

        } catch (error) {
            console.error(error);
            toast.error('Failed to save meal');
        }
    };

    const updateLocalMealState = (planId: string, meal: Meal, isUpdate: boolean) => {
        setMealsCache(prev => {
            const currentMeals = prev[planId] || [];
            let newMeals;
            if (isUpdate) {
                newMeals = currentMeals.map(m => m.id === meal.id ? meal : m);
            } else {
                newMeals = [...currentMeals, meal];
            }
            return {
                ...prev,
                [planId]: newMeals
            };
        });

        setMealPlans(prev => prev.map(p => {
            if (p.id !== planId) return p;
            const currentMeals = p.meals || [];
            let newMeals;
            if (isUpdate) {
                newMeals = currentMeals.map(m => m.id === meal.id ? meal : m);
            } else {
                newMeals = [...currentMeals, meal];
            }
            return { ...p, meals: newMeals };
        }));
    };

    const deleteMeal = async (planId: string, mealId: string) => {
        if (!confirm('Are you sure you want to remove this meal?')) return;

        try {
            await adminMealClient.deleteMeal(mealId);

            // Update UI
            setMealsCache(prev => ({
                ...prev,
                [planId]: (prev[planId] || []).filter(m => m.id !== mealId)
            }));

            setMealPlans(prev => prev.map(p => {
                if (p.id !== planId) return p;
                return {
                    ...p,
                    meals: p.meals.filter(m => m.id !== mealId)
                };
            }));

            toast.success('Meal removed');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete meal');
        }
    };

    const toggleMealActive = async (planId: string, mealId: string, currentStatus: boolean) => {
        // Optimistic Update
        const newStatus = !currentStatus;

        // Update Helper
        const updateState = (status: boolean) => {
            setMealsCache(prev => ({
                ...prev,
                [planId]: (prev[planId] || []).map(m => m.id === mealId ? { ...m, active: status } : m)
            }));
            setMealPlans(prev => prev.map(p => {
                if (p.id !== planId) return p;
                return {
                    ...p,
                    meals: p.meals.map(m => m.id === mealId ? { ...m, active: status } : m)
                };
            }));
        };

        updateState(newStatus);

        try {
            await adminMealClient.toggleMealAvailability(mealId, newStatus);
            toast.success(`Meal ${newStatus ? 'activated' : 'deactivated'}`);
        } catch (error) {
            // Rollback
            console.error(error);
            toast.error('Failed to update status');
            updateState(currentStatus);
        }
    };

    return {
        mealPlans,
        expandedPlanId,
        loadingPlanIds,
        toggleAccordion,
        deletePlan,
        editPlan,
        addPlan,

        // Drawer & Meal Actions
        isDrawerOpen,
        editingMeal,
        openAddMealDrawer,
        openEditMealDrawer,
        closeDrawer,
        saveMeal,
        deleteMeal,
        toggleMealActive,
        isLoadingPlans
    };
};
