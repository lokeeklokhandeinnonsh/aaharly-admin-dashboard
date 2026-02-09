import type { VendorCustomer } from '../api/vendorClient';

export const getSubscription = (customer: VendorCustomer) => {
    // Check for array of subscriptions (new format)
    if (customer.subscriptions && customer.subscriptions.length > 0) {
        return customer.subscriptions[0];
    }
    // No subscription found
    return null;
};
