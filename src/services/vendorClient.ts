import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/v1'; // Fallback


// Types (Mirroring Backend DTOs)
export interface DispatchOrder {
    scheduleId: string;
    orderId: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    pincode: string;
    mealName: string;
    type: string;
    slot: string;
    status: 'PENDING' | 'PREPARING' | 'READY_TO_DISPATCH' | 'HANDED_OVER' | 'DELIVERED' | 'CANCELLED';
    mealDate: string;
    dispatchedAt?: string;
    planName: string;
    subscriptionId: string;
}

export interface KitchenBatch {
    id?: string;
    mealId: string;
    mealName: string;
    targetQuantity: number;
    completedQuantity: number;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface DailyProduction {
    date: string;
    vendorId: string;
    totalOrders: number;
    totalMealsToPrep: number;
    batches: KitchenBatch[];
}

export interface DashboardSummary {
    kpi: {
        planned: number;
        prepared: number;
        remaining: number;
        dispatchReady: number;
        delayed: number;
    };
    productionBreakdown: {
        mealId: string;
        mealName: string;
        plan: number;
        done: number;
        remaining: number;
        status: 'Completed' | 'In Progress' | 'Pending';
    }[];
    dispatchReadiness: {
        ready: number;
        pending: number;
        alertMessage?: string;
    };
    inventorySnapshot: {
        key: string;
        name: string;
        remaining: string;
        status: 'ok' | 'critical' | 'warn';
        percent: number;
    }[];
}

const getHeaders = () => {
    const token = localStorage.getItem('vendor_token'); // Assuming vendor token storage
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

export const vendorClient = {
    // Dispatch
    getDispatchOrders: async (): Promise<DispatchOrder[]> => {
        const response = await axios.get(`${BASE_URL}/vendor/dispatch/orders`, getHeaders());
        return response.data;
    },

    updateDispatchStatus: async (orderId: string, status: string): Promise<DispatchOrder> => {
        const response = await axios.patch(`${BASE_URL}/vendor/dispatch/${orderId}/${status === 'READY_TO_DISPATCH' ? 'ready' : 'handover'}`, {}, getHeaders());
        return response.data;
    },

    // Kitchen
    getDailyProduction: async (date?: string): Promise<DailyProduction> => {
        const query = date ? `?date=${date}` : '';
        const response = await axios.get(`${BASE_URL}/vendor/production/daily${query}`, getHeaders());
        return response.data;
    },

    updateBatchStatus: async (batchId: string, status: string): Promise<KitchenBatch> => {
        const response = await axios.patch(`${BASE_URL}/vendor/kitchen/batch/${batchId}/status`, { status }, getHeaders());
        return response.data;
    },

    // Dashboard
    getDashboardSummary: async (): Promise<DashboardSummary> => {
        const response = await axios.get(`${BASE_URL}/vendor/dashboard/summary`, getHeaders());
        return response.data;
    },

    generateDailyBatches: async (date?: string): Promise<DailyProduction> => {
        const response = await axios.post(`${BASE_URL}/vendor/production/generate`, { date }, getHeaders());
        return response.data;
    }
};
