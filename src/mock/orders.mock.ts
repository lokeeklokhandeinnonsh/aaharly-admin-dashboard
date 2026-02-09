import type { Order, OrderStats } from '../types/order';

export const mockOrders: Order[] = [
    {
        id: 'ORD-2024-001',
        vendorId: 'V001',
        vendor: {
            id: 'V001',
            name: 'Healthy Bites Kitchen',
            contactPhone: '+91 98765 43210',
            address: '123, Food Street, Indiranagar, Bangalore'
        },
        customerId: 'C001',
        customer: {
            id: 'C001',
            name: 'Rahul Sharma',
            email: 'rahul.s@example.com',
            phone: '+91 99887 76655'
        },
        planId: 'P001',
        plan: {
            id: 'P001',
            name: 'Weight Loss Keto Plan',
            type: 'Monthly',
            mealsPerDay: 2
        },
        deliveryAddress: {
            street: 'Flat 402, Sunshine Apartments',
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560038',
            country: 'India'
        },
        deliveryDate: '2024-02-10T12:00:00Z',
        amount: 4500,
        status: 'pending',
        paymentStatus: 'paid',
        createdAt: '2024-02-05T09:00:00Z',
        updatedAt: '2024-02-05T09:00:00Z'
    },
    {
        id: 'ORD-2024-002',
        vendorId: 'V002',
        vendor: {
            id: 'V002',
            name: 'Green Leaf Organics',
            contactPhone: '+91 98765 12345',
            address: '45, Green Avenue, Koramangala, Bangalore'
        },
        customerId: 'C002',
        customer: {
            id: 'C002',
            name: 'Priya Verma',
            email: 'priya.v@example.com',
            phone: '+91 88776 65544'
        },
        planId: 'P002',
        plan: {
            id: 'P002',
            name: 'Balanced Nutrition Plan',
            type: 'Weekly',
            mealsPerDay: 3
        },
        deliveryAddress: {
            street: 'Villa 12, Palm Grove',
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560095',
            country: 'India'
        },
        deliveryDate: '2024-02-06T13:00:00Z',
        amount: 1200,
        status: 'out_for_delivery',
        paymentStatus: 'paid',
        createdAt: '2024-02-05T08:30:00Z',
        updatedAt: '2024-02-06T10:00:00Z'
    },
    {
        id: 'ORD-2024-003',
        vendorId: 'V001',
        vendor: {
            id: 'V001',
            name: 'Healthy Bites Kitchen',
            contactPhone: '+91 98765 43210',
            address: '123, Food Street, Indiranagar, Bangalore'
        },
        customerId: 'C003',
        customer: {
            id: 'C003',
            name: 'Amit Patel',
            email: 'amit.p@example.com',
            phone: '+91 77665 54433'
        },
        planId: 'P003',
        plan: {
            id: 'P003',
            name: 'High Protein Muscle Gain',
            type: 'Monthly',
            mealsPerDay: 4
        },
        deliveryAddress: {
            street: 'Unit 501, Tech Park View',
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560100',
            country: 'India'
        },
        deliveryDate: '2024-02-05T19:00:00Z',
        amount: 8000,
        status: 'delivered',
        paymentStatus: 'paid',
        createdAt: '2024-02-01T10:00:00Z',
        updatedAt: '2024-02-05T20:00:00Z'
    },
    {
        id: 'ORD-2024-004',
        vendorId: 'V003',
        vendor: {
            id: 'V003',
            name: 'Vegan Delights',
            contactPhone: '+91 99999 88888',
            address: '88, Eco Street, Whitefield, Bangalore'
        },
        customerId: 'C004',
        customer: {
            id: 'C004',
            name: 'Sneha Reddy',
            email: 'sneha.r@example.com',
            phone: '+91 66554 43322'
        },
        planId: 'P004',
        plan: {
            id: 'P004',
            name: 'Vegan Detox Plan',
            type: 'Weekly',
            mealsPerDay: 2
        },
        deliveryAddress: {
            street: 'House 9, Green Gardens',
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560066',
            country: 'India'
        },
        deliveryDate: '2024-02-07T12:00:00Z',
        amount: 2500,
        status: 'cancelled',
        paymentStatus: 'refunded',
        createdAt: '2024-02-06T09:00:00Z',
        updatedAt: '2024-02-06T11:00:00Z'
    },
    {
        id: 'ORD-2024-005',
        vendorId: 'V002',
        vendor: {
            id: 'V002',
            name: 'Green Leaf Organics',
            contactPhone: '+91 98765 12345',
            address: '45, Green Avenue, Koramangala, Bangalore'
        },
        customerId: 'C005',
        customer: {
            id: 'C005',
            name: 'Vikram Singh',
            email: 'vikram.s@example.com',
            phone: '+91 55443 32211'
        },
        planId: 'P005',
        plan: {
            id: 'P005',
            name: 'Diabetic Friendly Plan',
            type: 'Monthly',
            mealsPerDay: 3
        },
        deliveryAddress: {
            street: 'Plot 23, Quiet Lane',
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560078',
            country: 'India'
        },
        deliveryDate: '2024-02-08T13:00:00Z',
        amount: 6000,
        status: 'preparing',
        paymentStatus: 'paid',
        createdAt: '2024-02-08T08:00:00Z',
        updatedAt: '2024-02-08T08:30:00Z'
    }
];

export const mockOrderStats: OrderStats = {
    totalOrders: 1250,
    completed: 980,
    pending: 45,
    cancelled: 25,
    totalRevenue: 4500000,
    dailyRevenue: 85000
};
