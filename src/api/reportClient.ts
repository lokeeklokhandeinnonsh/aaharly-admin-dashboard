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

export interface DelayReportItem {
    vendorId: string;
    vendorName: string;
    todayDelays: number;
    thisWeekDelays: number;
    avgDelayMinutes: number;
}

export interface GrowthReportItem {
    date: string;
    newUsers: number;
    newSubscriptions: number;
    churnedSubscriptions: number;
    totalActiveUsers: number;
}

export interface AdminReportsResponse {
    delays: DelayReportItem[];
    growth: GrowthReportItem[];
}

export const reportClient = {
    getReports: async (): Promise<AdminReportsResponse> => {
        const response = await fetch(`${API_URL}/admin/reports`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
    }
};
