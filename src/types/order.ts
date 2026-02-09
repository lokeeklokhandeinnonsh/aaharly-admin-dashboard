export type OrderStatus = 'pending' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
}

export interface Vendor {
    id: string;
    name: string;
    contactPhone: string;
    address: string;
}

export interface MealPlan {
    id: string;
    name: string;
    type: 'Weekly' | 'Monthly';
    mealsPerDay: number;
}

export interface Order {
    id: string;
    vendorId: string;
    vendor: Vendor;
    customerId: string;
    customer: Customer;
    planId: string;
    plan: MealPlan;
    deliveryAddress: Address;
    deliveryDate: string; // ISO Date string
    amount: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    createdAt: string;
    updatedAt: string;
}

export interface OrderStats {
    totalOrders: number;
    completed: number;
    pending: number;
    cancelled: number;
    totalRevenue: number;
    dailyRevenue: number;
}
