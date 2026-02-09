
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

// --- Types based on Backend DTOs ---

export interface VendorLoginRequest {
    email?: string;
    phone?: string;
    password?: string;
    otp?: string;
}

export interface VendorInfo {
    id: string;
    name: string;
    email: string;
    kitchenId: string;
    status: 'active' | 'inactive';
}

export interface VendorLoginResponse {
    success: true;
    accessToken: string;
    vendor: VendorInfo;
}

export interface ProductionBatchSummary {
    id?: string;
    mealId: string;
    mealName: string;
    targetQuantity: number;
    completedQuantity: number;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface DailyProductionSummaryResponse {
    date: string;
    vendorId: string;
    totalOrders: number;
    totalMealsToPrep: number;
    batches: ProductionBatchSummary[];
}

export type DeliveryStatus = 'PENDING' | 'PREPARING' | 'READY_TO_DISPATCH' | 'HANDED_OVER' | 'DELIVERED' | 'CANCELLED';

export interface DispatchOrderResponse {
    scheduleId: string;
    orderId: string;
    customerName: string;
    customerAddress: string;
    mealName: string;
    status: DeliveryStatus;
    mealDate: string;
    dispatchedAt?: string;
}

export interface InventoryItemResponse {
    id: string;
    name: string;
    unit: string;
    currentStock: number;
    lowStockThreshold: number;
    updatedAt: string;
}

export interface InventoryLogRequest {
    itemId: string;
    quantity: number;
    reason?: string;
}

export interface ReportResponse {
    date: string;
    type: string;
    data: any;
}

// RESTORED CUSTOMER TYPE - Required for CustomersPage
export interface VendorCustomer {
    id: string; // Changed from userId to match backend
    name: string;
    email: string;
    mobile: string;
    img: string | null;
    addresses: {
        id: string;
        address: string;
        pincode: string;
        details: string;
        type: string;
        isDefault: boolean;
    }[];
    subscriptions: {
        id: string;
        planName: string;
        category: string;
        status: string;
        startDate: string;
        endDate: string;
    }[];
    deliveries: {
        id: string;
        date: string;
        mealType: string;
        category: string;
        planName: string;
        address: {
            id: string;
            address: string;
            pincode: string;
            details: string;
            type: string;
        } | null;
        status: string;
    }[];
}


// --- API Client ---

const getHeaders = () => {
    const token = localStorage.getItem('vendor_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const vendorClient = {
    // Auth
    login: async (creds: VendorLoginRequest): Promise<VendorLoginResponse> => {
        const response = await fetch(`${API_BASE_URL}/vendor/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(creds),
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            console.error('Login Failed Response:', response.status, err);
            throw new Error(err.message || 'Login failed');
        }
        return response.json();
    },

    // CUSTOMERS
    // CUSTOMERS
    getCustomers: async (page = 1, limit = 20, search = ''): Promise<{ data: VendorCustomer[], total: number }> => {
        const query = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            search
        });
        const response = await fetch(`${API_BASE_URL}/vendor/customers?${query}`, {
            headers: getHeaders(),
        });

        if (!response.ok) {
            let errorMessage = `Failed to fetch customers (${response.status})`;
            try {
                const err = await response.json();
                if (err.message) errorMessage = err.message;
            } catch (e) {
                console.warn('Failed to parse error response', e);
            }
            throw new Error(errorMessage);
        }

        const result = await response.json();
        // Support both { data: [...], meta: { total: ... } } and direct array if backend differs
        const data = result.data || result;
        const total = result.meta?.total || result.total || (Array.isArray(data) ? data.length : 0);

        return {
            data: Array.isArray(data) ? data : [],
            total
        };
    },

    // Production
    getDailyProduction: async (date?: string): Promise<DailyProductionSummaryResponse> => {
        const query = date ? `?date=${date}` : '';
        const response = await fetch(`${API_BASE_URL}/vendor/production/daily${query}`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch production data');
        return response.json();
    },

    generateDailyBatches: async (date?: string): Promise<DailyProductionSummaryResponse> => {
        const response = await fetch(`${API_BASE_URL}/vendor/production/generate`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ date }),
        });
        if (!response.ok) throw new Error('Failed to generate batches');
        return response.json();
    },

    // Dispatch
    getDispatchOrders: async (): Promise<DispatchOrderResponse[]> => {
        const response = await fetch(`${API_BASE_URL}/vendor/dispatch/orders`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch dispatch orders');
        return response.json();
    },

    markReady: async (orderId: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/vendor/dispatch/${orderId}/ready`, {
            method: 'PATCH',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to update status');
    },

    markHandover: async (orderId: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/vendor/dispatch/${orderId}/handover`, {
            method: 'PATCH',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to update status');
    },

    // Inventory
    getInventory: async (): Promise<InventoryItemResponse[]> => {
        const response = await fetch(`${API_BASE_URL}/vendor/inventory`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch inventory');
        return response.json();
    },

    logUsage: async (data: InventoryLogRequest): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/vendor/inventory/usage`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to log usage');
    },

    logWastage: async (data: InventoryLogRequest): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/vendor/inventory/wastage`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to log wastage');
    },

    // Reports
    getProductionReports: async (): Promise<ReportResponse[]> => {
        const response = await fetch(`${API_BASE_URL}/vendor/reports/production`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch reports');
        return response.json();
    }
};
