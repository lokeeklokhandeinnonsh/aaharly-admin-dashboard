import { API_BASE_URL, getHeaders } from './adminClient';

export const uploadClient = {
    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_BASE_URL}/admin/upload`, {
            method: 'POST',
            headers: {
                'Authorization': getHeaders()['Authorization'],
            },
            body: formData,
        });

        if (!response.ok) {
            console.error('Upload failed with status:', response.status);
            throw new Error('Failed to upload image');
        }

        const result = await response.json();
        // Return URL from response
        return result.data?.url || result.url || result.data;
    }
};
