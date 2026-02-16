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

export interface MealPlan {
    id: string;
    name: string;
    description: string;
    duration: number; // in days
    mealsPerDay: number;
    category: string;
    price: number;
    status: 'Active' | 'Inactive' | 'Draft';
    meals: Meal[];
}

export interface CreateMealPlanPayload {
    name: string;
    description: string;
    duration: number;
    mealsPerDay: number;
    category: string;
    price: number;
    status: 'Active' | 'Inactive' | 'Draft';
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
            duration: plan.duration,
            mealsPerDay: plan.mealsPerDay,
            category: plan.category || (plan.categories?.[0]?.title) || 'General',
            price: plan.price || plan.discountedPrice,
            status: plan.status ? (plan.status.charAt(0).toUpperCase() + plan.status.slice(1)) : (plan.isActive ? 'Active' : 'Inactive'),
            meals: [],
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
            duration: plan.duration,
            mealsPerDay: plan.mealsPerDay,
            category: plan.category || (plan.categories?.[0]?.title) || 'General',
            price: plan.price || plan.discountedPrice,
            status: plan.status ? (plan.status.charAt(0).toUpperCase() + plan.status.slice(1)) : (plan.isActive ? 'Active' : 'Inactive'),
            meals: plan.meals ? plan.meals.map(mapMealFromApi) : [],
        };
    },

    createMealPlan: async (data: CreateMealPlanPayload): Promise<MealPlan> => {
        const payload = {
            title: data.name,
            subTitle: data.description,
            description: data.description,
            duration: Number(data.duration),
            mealsPerDay: Number(data.mealsPerDay),
            price: Number(data.price),
            discountedPrice: Number(data.price),
            originalPrice: Number(data.price),
            isActive: data.status === 'Active',
            status: data.status.toLowerCase(),
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
            duration: plan.duration,
            mealsPerDay: plan.mealsPerDay,
            category: plan.category || 'General',
            price: plan.price || plan.discountedPrice,
            status: plan.status ? (plan.status.charAt(0).toUpperCase() + plan.status.slice(1)) : (plan.isActive ? 'Active' : 'Inactive'),
            meals: [],
        };
    },

    updateMealPlan: async (id: string, data: UpdateMealPlanPayload): Promise<MealPlan> => {
        const payload: any = {};
        if (data.name) payload.title = data.name;
        if (data.description) {
            payload.subTitle = data.description;
            payload.description = data.description;
        }
        if (data.duration) payload.duration = Number(data.duration);
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
            duration: plan.duration,
            mealsPerDay: plan.mealsPerDay,
            category: plan.category || 'General',
            price: plan.price || plan.discountedPrice,
            status: plan.status ? (plan.status.charAt(0).toUpperCase() + plan.status.slice(1)) : (plan.isActive ? 'Active' : 'Inactive'),
            meals: plan.meals ? plan.meals.map(mapMealFromApi) : [],
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
    getMealsByPlanId: async (planId: string): Promise<Meal[]> => {
        const response = await fetch(`${API_BASE_URL}/admin/meals/${planId}`, { headers: getHeaders() });
        // If 404/error, return empty list rather than crash
        if (!response.ok) return [];
        const result = await response.json();
        return (result.data || result).map(mapMealFromApi);
    },

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
