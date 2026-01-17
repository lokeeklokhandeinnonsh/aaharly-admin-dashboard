// Removed import of Meal to avoid circular dependency
// Meal interface will be defined in this file

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export const getAuthToken = () => localStorage.getItem('admin_token');

const getHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};


// Meal Interface
export interface Meal {
    id?: string;
    name: string;
    description: string;
    category: string;
    type: 'veg' | 'non-veg' | 'vegan' | 'keto' | 'other';
    price: number;
    currency: string;
    status: 'active' | 'inactive' | 'draft';
    nutrition: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
    portionSize: string;
    ingredients: string[];
    cookingInstructions: string;
    packagingInstructions: string;
    tags: string[];
    image?: string;
    variants?: {
        name: string;
        priceAdjustment: number;
    }[];
    // Backend MealPlan fields
    title?: string;
    subTitle?: string;
    originalPrice?: number;
    discountedPrice?: number;
    discountPercentage?: number;
    duration?: number;
    mealsPerDay?: number;
    categoryIds?: string[];
    coverImageUrl?: string;
    isActive?: boolean;
}

// Payload Type for PUT /admin/meal-plans/{id}
export type AdminMealPlanPayload = {
    title: string;
    subTitle?: string;
    coverImageUrl?: string;
    originalPrice: number;
    discountedPrice: number;
    discountPercentage?: number;
    duration?: number;
    mealsPerDay?: number;
    isActive?: boolean;
    categoryIds?: string[];
    // Compatibility Aliases
    name?: string;
    description?: string;
    price?: number;
    status?: string;
    image?: string;
};

export type Category = {
    id: string;
    title: string;
    subTitle: string;
    // Aliases
    name?: string;
};

export const adminClient = {
    getCategories: async (): Promise<Category[]> => {
        // Assuming this endpoint exists based on standard CRUD patterns or we need to try /admin/categories
        // If it doesn't exist, we fallback to empty array but at least we tried. 
        // Actually, if we are Super Admin, we should have a way to list categories.
        try {
            const response = await fetch(`${API_BASE_URL}/categories`, { headers: getHeaders() });
            if (!response.ok) return [];
            const result = await response.json();
            const data = result.data || result;
            return (Array.isArray(data) ? data : []).map((c: any) => ({
                ...c,
                name: c.title || c.name // Map title to name for compatibility
            }));
        } catch (e) {
            console.error('Error in getCategories:', e);
            return [];
        }
    },

    getMeals: async (): Promise<Meal[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/meal-plans`, {
                headers: getHeaders(),
            });
            if (!response.ok) throw new Error('Failed to fetch meals');
            const result = await response.json();
            return result.data || result; // Unwrap if needed
        } catch (error) {
            console.error('Error in getMeals:', error);
            return [];
        }
    },

    getMealById: async (id: string): Promise<Meal> => {
        const response = await fetch(`${API_BASE_URL}/admin/meal-plans/${id}`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch meal');
        return response.json();
    },

    createMeal: async (payload: AdminMealPlanPayload): Promise<Meal> => {
        const response = await fetch(`${API_BASE_URL}/admin/meal-plans`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to create meal');
        const result = await response.json();
        return result.data || result;
    },

    updateMeal: async (id: string, payload: AdminMealPlanPayload): Promise<Meal> => {
        const response = await fetch(`${API_BASE_URL}/admin/meal-plans/${id}`, {
            method: 'PUT', // Controller uses PUT
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to update meal');
        const result = await response.json();
        return result.data || result;
    },

    deleteMeal: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/admin/meal-plans/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to delete meal');
    },

    updateMealAvailability: async (id: string, isActive: boolean): Promise<Meal> => {
        const response = await fetch(`${API_BASE_URL}/admin/meals/${id}/availability`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ isActive }),
        });
        if (!response.ok) throw new Error('Failed to update meal availability');
        return response.json();
    },

    createCategory: async (payload: { title: string; subTitle: string }): Promise<Category> => {
        const response = await fetch(`${API_BASE_URL}/admin/categories`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to create category');
        const result = await response.json();
        return result.data || result;
    },

    getUsers: async (): Promise<User[]> => {
        try {
            // Fetch both profiles and accounts in parallel
            const [profilesResponse, accountsResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/users/profiles`, { headers: getHeaders() }),
                fetch(`${API_BASE_URL}/admin/users/accounts`, { headers: getHeaders() })
            ]);

            if (!profilesResponse.ok || !accountsResponse.ok) {
                throw new Error('Failed to fetch user data');
            }

            const profilesResult = await profilesResponse.json();
            const accountsResult = await accountsResponse.json();

            const profiles = profilesResult.data || profilesResult;
            const accounts = accountsResult.data || accountsResult;

            // Create a map of accounts by userId for quick lookup
            const accountsMap = new Map<string, AdminUserAccount>();
            (Array.isArray(accounts) ? accounts : []).forEach((acc: AdminUserAccount) => {
                accountsMap.set(acc.userId, acc);
            });

            // Merge profiles with accounts
            const mergedUsers: User[] = (Array.isArray(profiles) ? profiles : []).map((profile: any) => {
                const account = accountsMap.get(profile.userId);
                return {
                    ...profile,
                    account: account || null
                };
            });

            return mergedUsers;
        } catch (error) {
            console.error('Error in getUsers:', error);
            return [];
        }
    }
};

export type AdminUserAccount = {
    userId: string;
    authUid: string;
    name: string;
    email: string | null;
    phone: string | null;
    loginMethod: 'email' | 'google' | 'phone';
    createdAt: string;
    updatedAt: string;
};

export type User = {
    userId: string;
    basic: {
        name: string;
        age: number;
        gender: string;
    };
    physicalStats: {
        height: number;
        weight: number;
        activityLevel: string;
    };
    goalPref: {
        weightGoal: string;
        dietType: string;
        allergies: string | null;
    };
    createdAt: string;
    updatedAt: string;
    account?: AdminUserAccount | null;
};
