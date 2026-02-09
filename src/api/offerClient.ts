import { API_BASE_URL, getHeaders } from './adminClient';

export interface Offer {
    id: string;
    code: string;
    discountType: 'percentage' | 'flat' | null;
    discountValue: number | null;
    maxUses: number | null;
    usedCount: number | null;
    startDate: string | null;
    endDate: string | null;
    minOrder: number | null;
    status: 'active' | 'scheduled' | 'expired' | 'disabled';
    createdAt: string | null;
}

export interface OfferStats {
    activeCount: number;
    totalRedeemed: number;
    totalSavedAmount: number;
    growthPercent: number;
}

export interface CreateOfferPayload {
    offerCode: string;
    discountPercentage: number;
    validity: string; // Date string
    minOrder?: number;
}

export interface OffersResponse {
    data: Offer[];
    total: number;
    page: number;
    totalPages: number;
}

export const offerClient = {
    getOffers: async (page: number = 1, limit: number = 10): Promise<OffersResponse> => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/offer?page=${page}&limit=${limit}`, {
                headers: getHeaders(),
            });
            if (!response.ok) throw new Error('Failed to fetch offers');
            const result = await response.json();
            // result is usually { data: ..., total: ... } based on my backend implementation
            // But tsoa sometimes wraps it. My service returns pure object.
            // Backend controller returns: { data: [], total: ... }
            return result;
        } catch (error) {
            console.error('Error in getOffers:', error);
            return { data: [], total: 0, page: 1, totalPages: 0 };
        }
    },

    getStats: async (): Promise<OfferStats> => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/offer/stats`, {
                headers: getHeaders(),
            });
            if (!response.ok) throw new Error('Failed to fetch offer stats');
            return await response.json();
        } catch (error) {
            console.error('Error in getStats:', error);
            return {
                activeCount: 0,
                totalRedeemed: 0,
                totalSavedAmount: 0,
                growthPercent: 0,
            };
        }
    },

    createOffer: async (payload: CreateOfferPayload): Promise<any> => {
        const response = await fetch(`${API_BASE_URL}/admin/offer/new`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create offer');
        }
        return await response.json();
    },

    deleteOffer: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/admin/offer/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to delete offer');
    },

    toggleStatus: async (id: string): Promise<{ success: boolean; status: string }> => {
        const response = await fetch(`${API_BASE_URL}/admin/offer/${id}/status`, {
            method: 'PATCH',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to toggle status');
        return await response.json();
    }
};
