import React, { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Users,
    Activity,
    Target,
    Download
} from 'lucide-react';
import './Users.css';
import { adminClient, type User } from '../api/adminClient';
import { UserRow } from '../components/UserRow';
import { UserDetailsDrawer } from '../components/UserDetailsDrawer';
import toast, { Toaster } from 'react-hot-toast';

export const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGender, setFilterGender] = useState('All');
    const [filterGoal, setFilterGoal] = useState('All');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Fetch Users on Mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await adminClient.getUsers();
            // Handle potential different response structures if API is strict mock vs real
            const safeData = Array.isArray(data) ? data : [];
            // Normalize data if necessary (e.g., if mock data is slightly different)
            // But Assuming standard structure from prompt
            setUsers(safeData);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    // Derived Stats
    const stats = useMemo(() => {
        const total = users.length;
        const male = users.filter(u => u.basic.gender?.toLowerCase() === 'male').length;
        const female = users.filter(u => u.basic.gender?.toLowerCase() === 'female').length;

        const loss = users.filter(u => u.goalPref.weightGoal?.toLowerCase().includes('loss')).length;
        const gain = users.filter(u => u.goalPref.weightGoal?.toLowerCase().includes('gain')).length;
        const maintain = users.filter(u => u.goalPref.weightGoal?.toLowerCase().includes('maintain')).length;

        return { total, male, female, loss, gain, maintain };
    }, [users]);

    // Filtering Logic
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.basic.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGender = filterGender === 'All' || user.basic.gender?.toLowerCase() === filterGender.toLowerCase();

            const goal = user.goalPref.weightGoal?.toLowerCase() || '';
            const matchesGoal = filterGoal === 'All' ||
                (filterGoal === 'Loss' && goal.includes('loss')) ||
                (filterGoal === 'Gain' && goal.includes('gain')) ||
                (filterGoal === 'Maintain' && goal.includes('maintain'));

            return matchesSearch && matchesGender && matchesGoal;
        });
    }, [users, searchTerm, filterGender, filterGoal]);

    return (
        <div className="users-page animate-fade-in">
            <Toaster position="top-right" />

            {/* Page Header */}
            <div className="page-header">
                <h2 className="page-title">Users Management</h2>
                <p className="page-subtitle">View and manage registered users.</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-row">
                <div className="stats-card glass-panel">
                    <div className="stats-icon-wrapper orange">
                        <Users size={24} />
                    </div>
                    <div className="stats-info">
                        <span className="stats-label">Total Users</span>
                        <div className="stats-value">{stats.total}</div>
                        <div className="stats-subtext">
                            {stats.male} M / {stats.female} F
                        </div>
                    </div>
                </div>

                <div className="stats-card glass-panel">
                    <div className="stats-icon-wrapper green">
                        <Activity size={24} />
                    </div>
                    <div className="stats-info">
                        <span className="stats-label">Active Goals</span>
                        <div className="stats-value">{stats.loss + stats.gain + stats.maintain}</div>
                        <div className="stats-subtext">
                            Targeting Change
                        </div>
                    </div>
                </div>

                <div className="stats-card glass-panel">
                    <div className="stats-icon-wrapper blue">
                        <Target size={24} />
                    </div>
                    <div className="stats-info">
                        <span className="stats-label">Goal Split</span>
                        <div className="stats-value-row">
                            <span className="text-orange">{stats.loss} Loss</span>
                            <span className="text-green">{stats.gain} Gain</span>
                        </div>
                        <div className="stats-subtext">
                            {stats.maintain} Maintaining
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="controls-row">
                <div className="search-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filters-group">
                    <select
                        className="filter-select"
                        value={filterGender}
                        onChange={(e) => setFilterGender(e.target.value)}
                    >
                        <option value="All">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>

                    <select
                        className="filter-select"
                        value={filterGoal}
                        onChange={(e) => setFilterGoal(e.target.value)}
                    >
                        <option value="All">All Goals</option>
                        <option value="Loss">Weight Loss</option>
                        <option value="Gain">Weight Gain</option>
                        <option value="Maintain">Maintain</option>
                    </select>

                    <button className="btn-secondary">
                        <Download size={18} className="mr-2" />
                        Export
                    </button>
                </div>
            </div>

            {/* List Header */}
            <div className="users-list-header">
                <span className="header-label">User Profile</span>
                <span className="header-label">Physical Stats</span>
                <span className="header-label">Goals & Preferences</span>
                <span className="header-label">Joined Date</span>
            </div>

            {/* Users List */}
            <div className="users-list">
                {isLoading ? (
                    // Skeletons
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="skeleton-row-user">
                            <div className="skeleton-circle"></div>
                            <div className="skeleton-lines">
                                <div className="line long"></div>
                                <div className="line short"></div>
                            </div>
                        </div>
                    ))
                ) : filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <UserRow
                            key={user.userId}
                            user={user}
                            onClick={(u) => {
                                setSelectedUser(u);
                                setIsDrawerOpen(true);
                            }}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <Users size={48} className="mute-icon" />
                        <h3>No users found</h3>
                        <p>Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>

            {/* User Details Drawer */}
            <UserDetailsDrawer
                user={selectedUser}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </div>
    );
};
