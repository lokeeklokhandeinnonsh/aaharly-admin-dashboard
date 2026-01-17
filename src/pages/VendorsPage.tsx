import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    Plus,
    Download,
    MoreVertical,
    MapPin,
    Users,
    Star,
    ChevronLeft,
    ChevronRight,
    X,
    Store,
    Phone,
    Mail,
    CheckCircle,
    Clock
} from 'lucide-react';
import './Vendors.css';

// --- Mock Data Generator ---
// Helper to generate random vendors
const LOCATIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai'];
const STATUSES = ['active', 'active', 'active', 'onboarding', 'suspended'] as const;

interface Vendor {
    id: string;
    businessName: string;
    contactPerson: string;
    email: string;
    phone: string;
    location: string;
    rating: number;
    activeSubscribers: number;
    status: 'active' | 'onboarding' | 'suspended';
    joinedDate: string;
    dailyCapacity: number;
}

const generateVendors = (count: number): Vendor[] => {
    return Array.from({ length: count }).map((_, i) => {
        const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
        const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];

        return {
            id: `v-${1000 + i}`,
            businessName: `Aaharly Kitchen ${location} #${i + 1}`,
            contactPerson: `Manager ${i + 1}`,
            email: `kitchen.${1000 + i}@aaharly.com`,
            phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
            location: location,
            rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
            activeSubscribers: Math.floor(50 + Math.random() * 450),
            status: status,
            joinedDate: new Date(2025, Math.floor(Math.random() * 11), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
            dailyCapacity: Math.floor(200 + Math.random() * 800)
        };
    });
};

const MOCK_VENDORS = generateVendors(55); // Generating 55 vendors as requested

export const VendorsPage: React.FC = () => {
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Filter Logic
    const filteredVendors = useMemo(() => {
        if (!searchTerm) return MOCK_VENDORS;
        const lower = searchTerm.toLowerCase();
        return MOCK_VENDORS.filter(v =>
            v.businessName.toLowerCase().includes(lower) ||
            v.location.toLowerCase().includes(lower) ||
            v.contactPerson.toLowerCase().includes(lower)
        );
    }, [searchTerm]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
    const displayedVendors = filteredVendors.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="vendors-page">
            {/* Page Header Actions */}
            <div className="page-actions-bar glass-panel">
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search vendors by name, city or contact..."
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
                    <button className="btn-primary">
                        <Plus size={16} /> New Vendor
                    </button>
                </div>
            </div>

            {/* Vendors Grid */}
            <div className="vendors-grid">
                {displayedVendors.map(vendor => (
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
                                <h3>{vendor.businessName}</h3>
                                <div className="vendor-meta">
                                    <MapPin size={12} />
                                    <span>{vendor.location}</span>
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
                                <span>{vendor.rating}</span>
                            </div>
                        </div>

                        <div className={`status-badge status-${vendor.status}`}>
                            {vendor.status}
                        </div>

                        <button className="action-menu-btn" onClick={(e) => { e.stopPropagation(); }}>
                            <MoreVertical size={18} />
                        </button>
                    </div>
                ))}
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
            {selectedVendor && (
                <>
                    <div className="drawer-overlay" onClick={() => setSelectedVendor(null)} />
                    <div className="drawer glass-panel">
                        <div className="drawer-header">
                            <h2>Vendor Profile</h2>
                            <button className="close-btn" onClick={() => setSelectedVendor(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="drawer-content">
                            <div className="vendor-profile-hero">
                                <div className="avatar-xl mb-4">
                                    <Store size={32} />
                                </div>
                                <h2 className="text-xl font-bold">{selectedVendor.businessName}</h2>
                                <span className="text-muted text-sm">{selectedVendor.location}</span>
                                <div className={`status-badge status-${selectedVendor.status} mt-3`}>
                                    {selectedVendor.status.toUpperCase()}
                                </div>
                            </div>

                            <div className="drawer-section">
                                <h4>Performance</h4>
                                <div className="stats-grid">
                                    <div className="stat-box">
                                        <span className="label">Active Subs</span>
                                        <span className="value">{selectedVendor.activeSubscribers}</span>
                                    </div>
                                    <div className="stat-box">
                                        <span className="label">Daily Cap</span>
                                        <span className="value">{selectedVendor.dailyCapacity}</span>
                                    </div>
                                    <div className="stat-box">
                                        <span className="label">Rating</span>
                                        <span className="value flex items-center justify-center gap-1">
                                            {selectedVendor.rating} <Star size={14} fill="orange" color="orange" />
                                        </span>
                                    </div>
                                    <div className="stat-box">
                                        <span className="label">Completion</span>
                                        <span className="value">98.5%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="drawer-section">
                                <h4>Contact Details</h4>
                                <div className="info-grid card p-4">
                                    <div className="info-row">
                                        <label><Users size={14} /> Contact</label>
                                        <span>{selectedVendor.contactPerson}</span>
                                    </div>
                                    <div className="info-row">
                                        <label><Mail size={14} /> Email</label>
                                        <span>{selectedVendor.email}</span>
                                    </div>
                                    <div className="info-row">
                                        <label><Phone size={14} /> Phone</label>
                                        <span>{selectedVendor.phone}</span>
                                    </div>
                                    <div className="info-row">
                                        <label><Clock size={14} /> Joined</label>
                                        <span>{selectedVendor.joinedDate}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="drawer-section">
                                <h4>Compliance</h4>
                                <div className="info-grid">
                                    <div className="info-row">
                                        <label>FSSAI License</label>
                                        <span className="text-green-400 flex items-center gap-2"><CheckCircle size={14} /> Verified</span>
                                    </div>
                                    <div className="info-row">
                                        <label>Kitchen Hygiene</label>
                                        <span className="text-green-400 flex items-center gap-2"><CheckCircle size={14} /> Pass</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
