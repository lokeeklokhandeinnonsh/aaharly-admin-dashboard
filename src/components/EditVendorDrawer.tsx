import React, { useState, useEffect } from 'react';
import { X, Store, Phone, MapPin, Save, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminClient, type Vendor } from '../api/adminClient';
// Reuse styles from CreateVendorModal for consistency
import './CreateVendorModal.css';

interface EditVendorDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    vendor: Vendor | null;
    onVendorUpdated: () => void;
}

export const EditVendorDrawer: React.FC<EditVendorDrawerProps> = ({ isOpen, onClose, vendor, onVendorUpdated }) => {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        address: '',
        pincodes: '',
        status: 'active' as 'active' | 'inactive',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (vendor) {
            setFormData({
                name: vendor.name,
                contact: vendor.contact || '',
                address: vendor.address || '',
                pincodes: vendor.pincodes ? vendor.pincodes.join(', ') : '',
                status: (vendor.status === 'active' || vendor.status === 'inactive') ? vendor.status : 'active',
            });
        }
    }, [vendor]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        if (!vendor) return;

        // Basic validation
        if (!formData.name) {
            toast.error('Business Name is required');
            return;
        }

        const isDirty =
            formData.name !== vendor.name ||
            (formData.contact || '') !== (vendor.contact || '') ||
            (formData.address || '') !== (vendor.address || '') ||
            formData.status !== vendor.status ||
            (formData.pincodes.split(',').map(s => s.trim()).filter(Boolean).sort().join(',')) !==
            (vendor.pincodes.slice().sort().join(','));

        if (!isDirty) {
            toast('No changes to save.', { icon: 'ℹ️' });
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Update basic details
            const pincodeList = Array.from(new Set(formData.pincodes.split(',').map(p => p.trim()).filter(Boolean)));

            const updatePayload = {
                name: formData.name,
                contact: formData.contact,
                address: formData.address,
                pincodes: pincodeList,
            };

            await adminClient.updateVendor(vendor.id, updatePayload);

            // 2. Update status if changed
            if (formData.status !== vendor.status) {
                await adminClient.updateVendorStatus(vendor.id, formData.status);
            }

            toast.success('Vendor updated successfully');
            onVendorUpdated();
            onClose();
        } catch (error: any) {
            console.error('Failed to update vendor:', error);
            toast.error(error.message || 'Failed to update vendor');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Close on ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen || !vendor) return null;

    return (
        <div className="vendor-editor-overlay" onClick={handleBackdropClick}>
            <div className="vendor-editor-panel slide-in-right">
                <div className="editor-header">
                    <h2>
                        <Store size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                        Edit Vendor
                    </h2>
                    <div className="actions">
                        <button className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                        <button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                        </button>
                        <button className="btn-close" onClick={onClose} disabled={isSubmitting}>
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="editor-content">
                    {/* Basic Info */}
                    <section className="form-section">
                        <h3><Info size={16} /> Basic Information</h3>
                        <div className="form-row">
                            <div className="form-group flex-2">
                                <label>Business Name <span style={{ color: '#fca5a5' }}>*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Aaharly Kitchen Mumbai"
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #444', background: '#181818', color: '#fff', fontSize: '0.95rem' }}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label><Phone size={14} style={{ display: 'inline', marginRight: '4px' }} /> Contact Number</label>
                                <input
                                    type="tel"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    placeholder="+91 9876543210"
                                />
                            </div>
                            <div className="form-group">
                                <label>Service Pincodes</label>
                                <input
                                    type="text"
                                    name="pincodes"
                                    value={formData.pincodes}
                                    onChange={handleChange}
                                    placeholder="400001, 400002"
                                />
                                <small style={{ color: '#666', marginTop: '4px' }}>Comma separated values</small>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Full business address..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
