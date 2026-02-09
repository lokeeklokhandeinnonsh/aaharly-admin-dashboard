import React, { useState } from 'react';
import { X, Store, Phone, MapPin, Mail, User, Lock, Save, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import './CreateVendorModal.css';

interface CreateVendorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVendorCreated: () => void;
}

export const CreateVendorModal: React.FC<CreateVendorModalProps> = ({ isOpen, onClose, onVendorCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        address: '',
        pincodes: '',
        // Vendor user credentials
        userName: '',
        userEmail: '',
        userPassword: '',
        status: 'active' as 'active' | 'inactive',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.name || !formData.userEmail || !formData.userPassword) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
            const token = localStorage.getItem('admin_token');

            // Create vendor
            const vendorPayload = {
                name: formData.name,
                contact: formData.contact || undefined,
                address: formData.address || undefined,
                pincodes: formData.pincodes ? Array.from(new Set(formData.pincodes.split(',').map(p => p.trim()).filter(Boolean))) : undefined,
                status: formData.status,
            };

            const vendorResponse = await fetch(`${API_BASE_URL}/admin/vendors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(vendorPayload),
            });

            if (!vendorResponse.ok) {
                const errData = await vendorResponse.json();
                throw new Error(errData.message || 'Failed to create vendor');
            }

            const vendorResult = await vendorResponse.json();
            const vendorId = vendorResult.data?.id || vendorResult.id;

            // Create vendor user
            const userPayload = {
                vendor_id: vendorId,
                name: formData.userName || formData.name,
                email: formData.userEmail,
                password: formData.userPassword,
                role: 'admin', // Vendor admin role
            };

            const userResponse = await fetch(`${API_BASE_URL}/admin/vendors/${vendorId}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(userPayload),
            });

            if (!userResponse.ok) {
                console.warn('Vendor created but user creation failed');
                toast.error('Vendor created, but failed to create admin user.');
            } else {
                toast.success(`Vendor created successfully!\nLogin: ${formData.userEmail}`);
            }

            // Reset form
            setFormData({
                name: '',
                contact: '',
                address: '',
                pincodes: '',
                userName: '',
                userEmail: '',
                userPassword: '',
                status: 'active',
            });

            onVendorCreated();
            onClose();
        } catch (error: any) {
            console.error('Error creating vendor:', error);
            toast.error(error.message || 'Failed to create vendor. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="vendor-editor-overlay" onClick={handleBackdropClick}>
            <div className="vendor-editor-panel slide-in-right">
                <div className="editor-header">
                    <h2><Store size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} /> New Vendor Profile</h2>
                    <div className="actions">
                        <button className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                        <button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : <><Save size={18} /> Save Vendor</>}
                        </button>
                        <button className="btn-close" onClick={onClose} disabled={isSubmitting}><X size={24} /></button>
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
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                                    style={{ padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                                >
                                    <option value="active" style={{ background: '#1e293b' }}>Active</option>
                                    <option value="inactive" style={{ background: '#1e293b' }}>Inactive</option>
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

                    {/* Admin Credentials */}
                    <section className="form-section">
                        <h3><User size={16} /> Admin Credentials</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Admin Name</label>
                                <input
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    placeholder="Manager Name (Optional)"
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label><Mail size={14} style={{ display: 'inline', marginRight: '4px' }} /> Email <span style={{ color: '#fca5a5' }}>*</span></label>
                                <input
                                    type="email"
                                    name="userEmail"
                                    value={formData.userEmail}
                                    onChange={handleChange}
                                    placeholder="manager@vendor.com"
                                />
                            </div>
                            <div className="form-group">
                                <label><Lock size={14} style={{ display: 'inline', marginRight: '4px' }} /> Password <span style={{ color: '#fca5a5' }}>*</span></label>
                                <input
                                    type="password"
                                    name="userPassword"
                                    value={formData.userPassword}
                                    onChange={handleChange}
                                    placeholder="Min 6 characters"
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
