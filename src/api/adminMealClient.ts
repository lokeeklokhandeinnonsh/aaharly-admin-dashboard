import { API_BASE_URL, getHeaders } from './adminClient';

export interface Meal {
    id: string;
    name: string;
    type: 'Lunch' | 'Dinner' | 'Breakfast' | 'Snack';
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    description: string;
    active: boolean;
    image?: string;
}

export type DurationOption = 'weekly' | '15_days' | 'monthly';
export type PlanGoal = 'loss' | 'gain' | 'maintain' | 'balanced';
export type MealPreference = 'veg' | 'non-veg' | 'both';

export interface MealPlan {
    id: string;
    name: string;
    description: string;
    duration: DurationOption;
    mealsPerDay: number;
    category: string;
    price: number;
    status: 'Active' | 'Inactive' | 'Draft';
    meals: Meal[];
    planGoal?: PlanGoal;
    mealPreference?: MealPreference;
}

export interface CreateMealPlanPayload {
    name: string;
    description: string;
    duration: DurationOption;
    mealsPerDay: number;
    category: string;
    price: number;
    status: 'Active' | 'Inactive' | 'Draft';
    planGoal?: PlanGoal;
    mealPreference?: MealPreference;
}

export interface UpdateMealPlanPayload extends Partial<CreateMealPlanPayload> { }

export interface CreateMealPayload {
    planId: string;
    name: string;
    type: string;
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    description: string;
    active: boolean;
    image?: string;
}

export interface UpdateMealPayload extends Partial<Omit<CreateMealPayload, 'planId'>> { }

/**
 * Normalizes any legacy numeric or variant string duration to a canonical DurationOption.
 * - 7 / "7" / "7_days" / "week" / "weekly" → 'weekly'
 * - 15 / "15" / "15_days"                  → '15_days'
 * - 30 / "30" / "30_days" / "month" / "monthly" → 'monthly'
 */
function normalizeDuration(raw: any): DurationOption {
    const v = String(raw ?? '').toLowerCase().trim();
    if (v === '7' || v === '7_days' || v === 'week' || v === 'weekly') return 'weekly';
    if (v === '15' || v === '15_days') return '15_days';
    if (v === '30' || v === '30_days' || v === 'month' || v === 'monthly') return 'monthly';
    // fallback
    return 'weekly';
}

export const adminMealClient = {
    // Meal Plans
    getAllMealPlans: async (): Promise<MealPlan[]> => {
        const response = await fetch(`${API_BASE_URL}/admin/meal-plans`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch meal plans');
        const result = await response.json();

        return (result.data || result).map((plan: any) => ({
            id: plan.id,
            name: plan.name || plan.title,
            description: plan.description || plan.subTitle,
            duration: normalizeDuration(plan.duration),
            mealsPerDay: plan.mealsPerDay || plan.meals_per_day,
            category: plan.category || (plan.categories?.[0]?.title) || 'General',
            price: plan.price || plan.discountedPrice,
            status: plan.status ? (plan.status.charAt(0).toUpperCase() + plan.status.slice(1)) : (plan.isActive ? 'Active' : 'Inactive'),
            meals: plan.meals ? plan.meals.map(mapMealFromApi) : [],
            planGoal: plan.plan_goal,
            mealPreference: plan.mealPreference,
        }));
    },

    getMealPlanById: async (id: string): Promise<MealPlan> => {
        const response = await fetch(`${API_BASE_URL}/admin/meal-plans/${id}`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch meal plan');
        const result = await response.json();
        const plan = result.data || result;
        return {
            id: plan.id,
            name: plan.name || plan.title,
            description: plan.description || plan.subTitle,
            duration: normalizeDuration(plan.duration),
            mealsPerDay: plan.mealsPerDay || plan.meals_per_day,
            category: plan.category || (plan.categories?.[0]?.title) || 'General',
            price: plan.price || plan.discountedPrice,
            status: plan.status ? (plan.status.charAt(0).toUpperCase() + plan.status.slice(1)) : (plan.isActive ? 'Active' : 'Inactive'),
            meals: plan.meals ? plan.meals.map(mapMealFromApi) : [],
            planGoal: plan.plan_goal,
            mealPreference: plan.mealPreference,
        };
    },

    createMealPlan: async (data: CreateMealPlanPayload): Promise<MealPlan> => {
        const payload = {
            title: data.name,
            subTitle: data.description,
            description: data.description,
            duration: data.duration, // string: 'weekly' | '15_days' | 'monthly'
            mealsPerDay: Number(data.mealsPerDay),
            price: Number(data.price),
            discountedPrice: Number(data.price),
            originalPrice: Number(data.price),
            isActive: data.status === 'Active',
            status: data.status.toLowerCase(),
            plan_goal: data.planGoal,
            mealPreference: data.mealPreference,
        };

        const response = await fetch(`${API_BASE_URL}/admin/meal-plans`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to create meal plan');
        const result = await response.json();
        const plan = result.data || result;
        return {
            id: plan.id,
            name: plan.name || plan.title,
            description: plan.description || plan.subTitle,
            duration: normalizeDuration(plan.duration),
            mealsPerDay: plan.mealsPerDay || plan.meals_per_day,
            category: plan.category || 'General',
            price: plan.price || plan.discountedPrice,
            status: plan.status ? (plan.status.charAt(0).toUpperCase() + plan.status.slice(1)) : (plan.isActive ? 'Active' : 'Inactive'),
            meals: [],
            planGoal: plan.plan_goal,
            mealPreference: plan.mealPreference,
        };
    },

    updateMealPlan: async (id: string, data: UpdateMealPlanPayload): Promise<MealPlan> => {
        const payload: any = {};
        if (data.name) payload.title = data.name;
        if (data.description) {
            payload.subTitle = data.description;
            payload.description = data.description;
        }
        if (data.duration) payload.duration = data.duration; // string: 'weekly' | '15_days' | 'monthly'
        if (data.mealsPerDay) payload.mealsPerDay = Number(data.mealsPerDay);
        if (data.price) {
            payload.price = Number(data.price);
            payload.discountedPrice = Number(data.price);
            payload.originalPrice = Number(data.price);
        }
        if (data.status) {
            payload.isActive = data.status === 'Active';
            payload.status = data.status.toLowerCase();
        }
        if (data.planGoal) payload.plan_goal = data.planGoal;
        if (data.mealPreference) payload.mealPreference = data.mealPreference;

        const response = await fetch(`${API_BASE_URL}/admin/meal-plans/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to update meal plan');
        const result = await response.json();
        const plan = result.data || result;
        return {
            id: plan.id,
            name: plan.name || plan.title,
            description: plan.description || plan.subTitle,
            duration: normalizeDuration(plan.duration),
            mealsPerDay: plan.mealsPerDay || plan.meals_per_day,
            category: plan.category || 'General',
            price: plan.price || plan.discountedPrice,
            status: plan.status ? (plan.status.charAt(0).toUpperCase() + plan.status.slice(1)) : (plan.isActive ? 'Active' : 'Inactive'),
            meals: plan.meals ? plan.meals.map(mapMealFromApi) : [],
            planGoal: plan.plan_goal,
            mealPreference: plan.mealPreference,
        };
    },

    deleteMealPlan: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/admin/meal-plans/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to delete meal plan');
    },

    // Meals (Sub-items)
    createMeal: async (data: CreateMealPayload): Promise<Meal> => {
        const payload = {
            planId: data.planId,
            name: data.name,
            title: data.name,
            type: data.type,
            calories: Number(data.calories),
            protein: parseFloat(data.protein) || 0,
            carbs: parseFloat(data.carbs) || 0,
            fat: parseFloat(data.fat) || 0,
            description: data.description,
            isActive: data.active,
            image: data.image,
            nutrition: {
                calories: Number(data.calories),
                protein: parseFloat(data.protein) || 0,
                carbs: parseFloat(data.carbs) || 0,
                fats: parseFloat(data.fat) || 0,
            }
        };

        const response = await fetch(`${API_BASE_URL}/admin/meals`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to create meal');
        const result = await response.json();
        const meal = result.data || result;
        return mapMealFromApi(meal);
    },

    updateMeal: async (id: string, data: UpdateMealPayload): Promise<Meal> => {
        const payload: any = {};
        if (data.name) { payload.name = data.name; payload.title = data.name; }
        if (data.type) payload.type = data.type;
        if (data.description) payload.description = data.description;
        if (data.active !== undefined) payload.isActive = data.active;
        if (data.image) payload.image = data.image;

        // Update nutrition if any macro changed
        if (data.calories || data.protein || data.carbs || data.fat) {
            payload.nutrition = {
                calories: data.calories !== undefined ? Number(data.calories) : undefined,
                protein: data.protein ? parseFloat(data.protein) : undefined,
                carbs: data.carbs ? parseFloat(data.carbs) : undefined,
                fats: data.fat ? parseFloat(data.fat) : undefined,
            };
            // Also top level for convenience if backend supports
            if (data.calories) payload.calories = Number(data.calories);
            if (data.protein) payload.protein = parseFloat(data.protein);
            if (data.carbs) payload.carbs = parseFloat(data.carbs);
            if (data.fat) payload.fat = parseFloat(data.fat);
        }

        const response = await fetch(`${API_BASE_URL}/admin/meals/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to update meal');
        const result = await response.json();
        const meal = result.data || result;
        return mapMealFromApi(meal);
    },

    deleteMeal: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/admin/meals/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to delete meal');
    },

    toggleMealAvailability: async (id: string, isActive: boolean): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/admin/meals/${id}/availability`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ isActive }),
        });
        if (!response.ok) throw new Error('Failed to toggle meal availability');
    }
};

const mapMealFromApi = (meal: any): Meal => ({
    id: meal.id,
    name: meal.name || meal.title,
    type: meal.type || 'Lunch',
    calories: meal.calories || meal.nutrition?.calories || 0,
    protein: (meal.protein || meal.nutrition?.protein || 0) + 'g',
    carbs: (meal.carbs || meal.nutrition?.carbs || 0) + 'g',
    fat: (meal.fat || meal.nutrition?.fats || 0) + 'g',
    description: meal.description,
    active: meal.isActive !== false,
    image: meal.image || meal.coverImageUrl,
});
