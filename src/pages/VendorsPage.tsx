import React, { useState, useMemo, useEffect } from 'react';
import {
    Search,
    Filter,
    Plus,
    Download,
    MapPin,
    Users,
    Star,
    ChevronLeft,
    ChevronRight,
    Store,
    Edit,
    Trash2
} from 'lucide-react';
import './Vendors.css';
import { adminClient, type Vendor } from '../api/adminClient';
import toast, { Toaster } from 'react-hot-toast';
import { CreateVendorModal } from '../components/CreateVendorModal';
import { EditVendorDrawer } from '../components/EditVendorDrawer';
import { VendorDetailsDrawer } from '../components/vendor/VendorDetailsDrawer';

export const VendorsPage: React.FC = () => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
    const itemsPerPage = 12;

    // Fetch vendors on mount
    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        setIsLoading(true);
        try {
            const data = await adminClient.getVendors();
            setVendors(data);
        } catch (error) {
            console.error('Failed to fetch vendors:', error);
            toast.error('Failed to load vendors');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) return;

        try {
            await adminClient.deleteVendor(id);
            toast.success('Vendor deleted');
            fetchVendors();
        } catch (error) {
            toast.error('Failed to delete vendor');
        }
    };

    const handleStatusToggle = async (vendor: Vendor, e: React.MouseEvent) => {
        e.stopPropagation();
        const newStatus = vendor.status === 'active' ? 'inactive' : 'active';
        try {
            await adminClient.updateVendorStatus(vendor.id, newStatus);
            toast.success(`Vendor ${newStatus}`);
            fetchVendors(); // Refresh to update UI
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const openEdit = (vendor: Vendor, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingVendor(vendor);
        setIsEditModalOpen(true);
    };

    // Filter Logic
    const filteredVendors = useMemo(() => {
        if (!searchTerm) return vendors;
        const lower = searchTerm.toLowerCase();
        return vendors.filter(v =>
            v.name.toLowerCase().includes(lower) ||
            (v.address && v.address.toLowerCase().includes(lower)) ||
            (v.contact && v.contact.toLowerCase().includes(lower))
        );
    }, [vendors, searchTerm]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
    const displayedVendors = filteredVendors.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="vendors-page">
            <Toaster position="top-right" />

            {/* Page Header Actions */}
            <div className="page-actions-bar glass-panel">
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search vendors by name, address or contact..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="actions-group">
                    <button className="btn-secondary">
                        <Filter size={16} /> Filter
                    </button>
                    <div className="sort-dropdown custom-select">
                        <select>
                            <option>Sort by: Rating</option>
                            <option>Sort by: Load</option>
                            <option>Sort by: Joined</option>
                        </select>
                    </div>
                    <button className="btn-secondary">
                        <Download size={16} /> Export
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus size={16} /> New Vendor
                    </button>
                </div>
            </div>

            {/* Vendors Grid */}
            <div className="vendors-grid">
                {isLoading ? (
                    // Loading Skeletons
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="vendor-card card skeleton-card">
                            <div className="skeleton-circle" style={{ width: '48px', height: '48px', marginBottom: '1rem' }}></div>
                            <div className="skeleton-line" style={{ width: '80%', height: '20px', marginBottom: '0.5rem' }}></div>
                            <div className="skeleton-line" style={{ width: '60%', height: '16px' }}></div>
                        </div>
                    ))
                ) : displayedVendors.length > 0 ? (
                    displayedVendors.map(vendor => (
                        <div
                            key={vendor.id}
                            className="vendor-card card"
                            onClick={() => setSelectedVendor(vendor)}
                        >
                            <div className="vendor-main-info">
                                <div className="vendor-avatar-lg">
                                    <Store size={24} />
                                </div>
                                <div className="vendor-text">
                                    <h3>{vendor.name}</h3>
                                    <div className="vendor-meta">
                                        <MapPin size={12} />
                                        <span>{vendor.address || 'No address'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="vendor-stats">
                                <div className="stat-item highlight">
                                    <Users size={14} />
                                    <span>{vendor.activeSubscribers} Subs</span>
                                </div>
                                <div className="stat-item">
                                    <Star size={14} fill={vendor.rating >= 4.5 ? "orange" : "none"} color="orange" />
                                    <span>{vendor.rating.toFixed(1)}</span>
                                </div>
                            </div>

                            <div
                                className={`status-badge status-${vendor.status} cursor-pointer hover:opacity-80`}
                                onClick={(e) => handleStatusToggle(vendor, e)}
                                title="Click to toggle status"
                            >
                                {vendor.status}
                            </div>

                            <div className="vendor-actions-pill">
                                <button className="action-btn-icon edit"
                                    onClick={(e) => openEdit(vendor, e)}
                                    title="Edit Vendor"
                                >
                                    <Edit size={16} />
                                </button>
                                <button className="action-btn-icon delete"
                                    onClick={(e) => handleDelete(vendor.id, e)}
                                    title="Delete Vendor"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                        <Store size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <h3>No vendors found</h3>
                        <p>Try adjusting your search or add a new vendor.</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="pagination-bar">
                    <button
                        className="page-btn"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        className="page-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* Vendor Details Drawer */}
            <VendorDetailsDrawer
                vendor={selectedVendor}
                isOpen={!!selectedVendor}
                onClose={() => setSelectedVendor(null)}
            />

            {/* Create Vendor Modal */}
            <CreateVendorModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onVendorCreated={() => {
                    fetchVendors(); // Refresh vendor list
                }}
            />

            {/* Edit Vendor Drawer */}
            <EditVendorDrawer
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                vendor={editingVendor}
                onVendorUpdated={() => {
                    fetchVendors();
                }}
            />
        </div>
    );
};
