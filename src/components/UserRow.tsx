import React from 'react';
import { Mail, Phone, Chrome } from 'lucide-react';
import { type User } from '../api/adminClient';

interface UserRowProps {
    user: User;
    onClick: (user: User) => void;
}

export const UserRow: React.FC<UserRowProps> = ({ user, onClick }) => {
    // Helper for initials
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Helper for date formatting
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Helper for login method icon
    const getLoginIcon = (method: string) => {
        switch (method) {
            case 'email':
                return <Mail size={12} />;
            case 'google':
                return <Chrome size={12} />;
            case 'phone':
                return <Phone size={12} />;
            default:
                return null;
        }
    };

    return (
        <div className="user-row glass-panel" onClick={() => onClick(user)}>
            {/* Left: Basic Info */}
            <div className="user-basic-info">
                <div className="user-avatar">
                    {getInitials(user.basic.name)}
                </div>
                <div className="user-details-stack">
                    <h3 className="user-name">{user.basic.name}</h3>
                    <span className="user-demographics">
                        {user.basic.gender}, {user.basic.age} yrs
                    </span>
                    {user.account && (
                        <div className="user-account-info">
                            <span className="account-contact">
                                {user.account.email || user.account.phone || 'No contact'}
                            </span>
                            <span className="login-method-badge">
                                {getLoginIcon(user.account.loginMethod)}
                                <span>{user.account.loginMethod}</span>
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Center: Physical Stats */}
            <div className="user-physical-stats">
                <div className="stat-pill">
                    <span className="stat-label">Height</span>
                    <span className="stat-val">{user.physicalStats.height} cm</span>
                </div>
                <div className="stat-pill">
                    <span className="stat-label">Weight</span>
                    <span className="stat-val">{user.physicalStats.weight} kg</span>
                </div>
                <div className="activity-badge">
                    {user.physicalStats.activityLevel?.replace('_', ' ') || 'Not specified'}
                </div>
            </div>

            {/* Right: Goals & Preferences */}
            <div className="user-goals">
                <div className={`goal-badge goal-${(user.goalPref.weightGoal || '').toLowerCase().includes('loss') ? 'loss' : (user.goalPref.weightGoal || '').toLowerCase().includes('gain') ? 'gain' : 'maintain'}`}>
                    {user.goalPref.weightGoal?.replace(/_/g, ' ') || 'Not set'}
                </div>
                <div className="diet-badge">
                    {user.goalPref.dietType || 'Not specified'}
                </div>
                {user.goalPref.allergies && user.goalPref.allergies !== 'None' && (
                    <div className="allergy-badge">
                        ⚠️ {user.goalPref.allergies}
                    </div>
                )}
            </div>

            {/* Meta: Created At */}
            <div className="user-meta">
                <span className="meta-date">Joined {formatDate(user.createdAt)}</span>
            </div>
        </div>
    );
};
