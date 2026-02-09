// Define types locally
export interface DashboardStats {
    totalUsers: number;
    activeSubscriptions: number;
    ordersToday: number;
    revenueThisMonth: number;
}

export interface OrdersTrendItem {
    date: string;
    count: number;
}

export interface MealPopularityItem {
    planId: string;
    planName: string;
    subscriptionCount: number;
    percentage: number;
}

export interface RecentActivityItem {
    id: string;
    type: 'ORDER' | 'USER' | 'SUBSCRIPTION' | 'PAYMENT' | 'ALERT';
    message: string;
    date: string;
    status?: string;
    amount?: number;
}

// Base URL handling
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
};

export const dashboardClient = {
    getStats: async (): Promise<DashboardStats> => {
        const response = await fetch(`${API_URL}/admin/dashboard/stats`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
    },

    getOrdersTrend: async (): Promise<{ trend: OrdersTrendItem[] }> => {
        const response = await fetch(`${API_URL}/admin/dashboard/orders-trend`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
    },

    getMealPopularity: async (): Promise<{ popularity: MealPopularityItem[] }> => {
        const response = await fetch(`${API_URL}/admin/dashboard/meal-popularity`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
    },

    getRecentActivity: async (): Promise<{ activities: RecentActivityItem[] }> => {
        const response = await fetch(`${API_URL}/admin/dashboard/recent-activity`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
    }
};
