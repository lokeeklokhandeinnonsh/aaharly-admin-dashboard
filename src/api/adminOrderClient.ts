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

export interface DashboardOrderResponse {
    id: string;
    userId: string;
    userName: string;
    vendorId: string;
    vendorName: string;
    mealName: string;
    date: string;
    type: string;
    status: string;
    deliveryStatus: string;
    address: string;
}

export interface OrderListResponse {
    orders: DashboardOrderResponse[];
    total: number;
    page: number;
    totalPages: number;
}

export const adminOrderClient = {
    getOrders: async (page: number = 1, limit: number = 20, status?: string): Promise<OrderListResponse> => {
        const query = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(status && { status })
        });

        const response = await fetch(`${API_URL}/admin/orders?${query}`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
    }
};
