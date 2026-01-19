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


// Meal Interface - Sync with API NormalizedMealResponse & NormalizedMealPlanResponse
export interface Meal {
    id?: string;
    title?: string;
    name: string; // Alias
    subTitle?: string;
    description: string; // Alias
    coverImageUrl?: string;
    originalPrice?: number;
    discountedPrice?: number;
    discountPercentage?: number;
    duration?: number;
    mealsPerDay?: number;
    currency?: string;
    status: 'active' | 'inactive' | 'draft';
    type?: string;
    category: string;
    categories?: { id: string; title: string }[];
    price: number;
    nutrition: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    meals?: any[]; // Components/Sub-meals
    tags: string[];
    ingredients: string[];
    variants?: any[];
    portionSize: string;
    cookingInstructions?: string;
    packagingInstructions?: string;
    createdAt?: string;
    updatedAt?: string;
    // Compatibility Aliases for Editor (optional during build)
    image?: string;
    isActive?: boolean;
    categoryIds?: string[];
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
    name?: string; // Alias
    taggedMealsCount?: number;
};

export const adminClient = {
    getCategories: async (): Promise<Category[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`, { headers: getHeaders() });
            if (!response.ok) throw new Error('Failed to fetch categories');
            const result = await response.json();
            const data = result.data || result;
            return (Array.isArray(data) ? data : []).map((c: any) => ({
                ...c,
                name: c.title || c.name
            }));
        } catch (e) {
            console.error('Error in getCategories:', e);
            return [];
        }
    },

    getMeals: async (): Promise<Meal[]> => {
        try {
            // Use the NEW admin endpoint for full data (includes inactive/drafts)
            const response = await fetch(`${API_BASE_URL}/admin/meal-plans`, {
                headers: getHeaders(),
            });
            if (!response.ok) {
                // Fallback to public if admin not yet deployed or fails
                const publicResp = await fetch(`${API_BASE_URL}/meal-plans`, { headers: getHeaders() });
                if (!publicResp.ok) throw new Error('Failed to fetch meals');
                const result = await publicResp.json();
                return result.data || result;
            }
            const result = await response.json();
            return result.data || result;
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
        const result = await response.json();
        return result.data || result;
    },

    createMeal: async (payload: AdminMealPlanPayload): Promise<Meal> => {
        const response = await fetch(`${API_BASE_URL}/admin/meal-plans`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Failed to create meal:', response.status, errorBody);
            throw new Error(`Failed to create meal: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        return result.data || result;
    },

    updateMeal: async (id: string, payload: AdminMealPlanPayload): Promise<Meal> => {
        const response = await fetch(`${API_BASE_URL}/admin/meal-plans/${id}`, {
            method: 'PUT',
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
        const result = await response.json();
        return result.data || result;
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

    deleteCategory: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to delete category');
    },

    getUsers: async (): Promise<User[]> => {
        try {
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

            const accountsMap = new Map<string, AdminUserAccount>();
            (Array.isArray(accounts) ? accounts : []).forEach((acc: AdminUserAccount) => {
                accountsMap.set(acc.userId, acc);
            });

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
    },

    getCalendar: async (): Promise<DaySchedule[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/calendar`, { headers: getHeaders() });
            if (!response.ok) return [];
            const result = await response.json();
            return result.data || result;
        } catch (e) {
            console.error('Error in getCalendar:', e);
            return [];
        }
    },

    setCalendarEntry: async (entry: CalendarEntry): Promise<any> => {
        const response = await fetch(`${API_BASE_URL}/admin/calendar/entry`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(entry),
        });
        if (!response.ok) throw new Error('Failed to set calendar entry');
        const result = await response.json();
        return result.data || result;
    },

    bulkSetCalendar: async (entries: CalendarEntry[]): Promise<any[]> => {
        const response = await fetch(`${API_BASE_URL}/admin/calendar/bulk`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(entries),
        });
        if (!response.ok) throw new Error('Failed to bulk set calendar');
        const result = await response.json();
        return result.data || result;
    }
};

export type CalendarEntry = {
    day: number;
    categoryId: string;
    mealId: string;
};

export type DaySchedule = {
    day: number;
    meals: Array<{
        id: string;
        mealId: string;
        mealName: string;
        mealImage: string;
        categoryId: string;
        categoryTitle: string;
        categoryType: string;
    }>;
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
