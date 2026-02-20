import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { adminMealClient } from '../api/adminMealClient';
import type { MealPlan, Meal, CreateMealPayload, UpdateMealPayload, CreateMealPlanPayload } from '../api/adminMealClient';

export type { MealPlan, Meal };

export const useMealAccordion = () => {
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
    const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
    const [isLoadingPlans, setIsLoadingPlans] = useState(false);
    const [loadingPlanIds, setLoadingPlanIds] = useState<Set<string>>(new Set());

    // Meal Plan Drawer state
    const [isPlanDrawerOpen, setIsPlanDrawerOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<MealPlan | null>(null);

    // Delete confirmation state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Meals cache
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

    // ─── Accordion Logic ───
    const toggleAccordion = async (planId: string) => {
        if (expandedPlanId === planId) {
            setExpandedPlanId(null);
            return;
        }

        setExpandedPlanId(planId);

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
            const plan = await adminMealClient.getMealPlanById(planId);
            const meals = plan.meals || [];
            setMealsCache(prev => ({
                ...prev,
                [planId]: meals
            }));

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

    // ─── Plan CRUD ───

    // Delete Plan — open modal instead of confirm()
    const requestDeletePlan = useCallback((planId: string) => {
        setDeletingPlanId(planId);
        setDeleteModalOpen(true);
    }, []);

    const confirmDeletePlan = async () => {
        if (!deletingPlanId) return;
        setIsDeleting(true);
        try {
            await adminMealClient.deleteMealPlan(deletingPlanId);
            setMealPlans(prev => prev.filter(p => p.id !== deletingPlanId));
            if (expandedPlanId === deletingPlanId) setExpandedPlanId(null);
            // Clear cache
            setMealsCache(prev => {
                const next = { ...prev };
                delete next[deletingPlanId!];
                return next;
            });
            toast.success('Meal plan deleted');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete meal plan');
        } finally {
            setIsDeleting(false);
            setDeleteModalOpen(false);
            setDeletingPlanId(null);
        }
    };

    const cancelDeletePlan = () => {
        setDeleteModalOpen(false);
        setDeletingPlanId(null);
    };

    // Edit Plan — open PlanDrawer with data
    const editPlan = useCallback((planId: string) => {
        const plan = mealPlans.find(p => p.id === planId);
        if (plan) {
            setEditingPlan(plan);
            setIsPlanDrawerOpen(true);
        }
    }, [mealPlans]);

    // Add Plan — open PlanDrawer empty
    const addPlan = useCallback(() => {
        setEditingPlan(null);
        setIsPlanDrawerOpen(true);
    }, []);

    const closePlanDrawer = () => {
        setIsPlanDrawerOpen(false);
        setEditingPlan(null);
    };

    // Save Plan (Create or Update)
    const savePlan = async (data: CreateMealPlanPayload) => {
        try {
            if (editingPlan) {
                // Update
                const updated = await adminMealClient.updateMealPlan(editingPlan.id, data);
                setMealPlans(prev => prev.map(p => p.id === editingPlan.id ? { ...updated, meals: p.meals } : p));
                toast.success('Meal plan updated successfully');
            } else {
                // Create
                const created = await adminMealClient.createMealPlan(data);
                setMealPlans(prev => [...prev, created]);
                toast.success('Meal plan created successfully');
            }
            closePlanDrawer();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save meal plan');
            throw error;
        }
    };

    // ─── Meal Actions (Open Drawer) ───
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
        isLoadingPlans,

        // Plan CRUD (real integration)
        deletePlan: requestDeletePlan,
        editPlan,
        addPlan,
        savePlan,

        // Plan Drawer
        isPlanDrawerOpen,
        editingPlan,
        closePlanDrawer,

        // Delete modal
        deleteModalOpen,
        isDeleting,
        confirmDeletePlan,
        cancelDeletePlan,

        // Meal Drawer & Meal Actions
        isDrawerOpen,
        editingMeal,
        openAddMealDrawer,
        openEditMealDrawer,
        closeDrawer,
        saveMeal,
        deleteMeal,
        toggleMealActive,
    };
};
