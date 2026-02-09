
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { offerClient } from '../../api/offerClient';
import './CreateOfferDrawer.css';

interface CreateOfferDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateOfferDrawer: React.FC<CreateOfferDrawerProps> = ({ isOpen, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        code: '',
        discount: '',
        validity: '',
        minOrder: ''
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when drawer opens
    useEffect(() => {
        if (isOpen) {
            setForm({
                code: '',
                discount: '',
                validity: '',
                minOrder: ''
            });
            setErrors({});
        }
    }, [isOpen]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.code.trim()) newErrors.code = 'Coupon code is required';
        if (!form.discount) newErrors.discount = 'Discount percentage is required';
        if (Number(form.discount) < 1 || Number(form.discount) > 100) newErrors.discount = 'Must be between 1% and 100%';
        if (!form.validity) newErrors.validity = 'Validity date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);
            await offerClient.createOffer({
                offerCode: form.code,
                discountPercentage: Number(form.discount),
                validity: form.validity,
                minOrder: form.minOrder ? Number(form.minOrder) : undefined
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to create offer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="drawer-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="create-offer-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="drawer-header">
                            <h2 className="drawer-title">Create New Offer</h2>
                            <button className="close-drawer-btn" onClick={onClose} aria-label="Close drawer">
                                <X size={24} />
                            </button>
                        </div>

                        <form className="drawer-form-content" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="code">Coupon Code</label>
                                <input
                                    id="code"
                                    type="text"
                                    className="form-input"
                                    value={form.code}
                                    onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                    placeholder="e.g. SUMMER25"
                                    autoFocus
                                />
                                {errors.code && <span className="form-error">{errors.code}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="discount">Discount Percentage</label>
                                <input
                                    id="discount"
                                    type="number"
                                    className="form-input"
                                    value={form.discount}
                                    onChange={e => setForm({ ...form, discount: e.target.value })}
                                    placeholder="20"
                                    min="1"
                                    max="100"
                                />
                                {errors.discount && <span className="form-error">{errors.discount}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="validity">Valid Until</label>
                                <input
                                    id="validity"
                                    type="date"
                                    className="form-input"
                                    value={form.validity}
                                    onChange={e => setForm({ ...form, validity: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                {errors.validity && <span className="form-error">{errors.validity}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="minOrder">Min Order Amount (Optional)</label>
                                <input
                                    id="minOrder"
                                    type="number"
                                    className="form-input"
                                    value={form.minOrder}
                                    onChange={e => setForm({ ...form, minOrder: e.target.value })}
                                    placeholder="0"
                                />
                            </div>

                            <div className="drawer-footer">
                                <button type="button" className="btn-cancel" onClick={onClose}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-submit"
                                    disabled={loading}
                                >
                                    {loading && <Loader2 className="animate-spin" size={16} />}
                                    {loading ? 'Creating...' : 'Create Offer'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
