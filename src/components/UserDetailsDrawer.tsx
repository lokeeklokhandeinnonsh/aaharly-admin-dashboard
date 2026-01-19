
import React from 'react';
import {
    X,
    Mail,
    Phone,
    Activity,
    Target,
    AlertCircle,
    Clock,
    Shield,
    Smartphone,
    Globe
} from 'lucide-react';
import { type User } from '../api/adminClient';
import './UserDetailsDrawer.css';

interface UserDetailsDrawerProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
}

export const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({ user, isOpen, onClose }) => {
    if (!user) return null;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getBMIColor = (bmi: number) => {
        if (bmi < 18.5) return 'text-blue';
        if (bmi < 25) return 'text-green';
        if (bmi < 30) return 'text-orange';
        return 'text-red';
    };

    // Calculate BMI if height/weight provided but bmi field missing
    const heightM = user.physicalStats.height / 100;
    const bmi = user.physicalStats.weight / (heightM * heightM);

    return (
        <>
            <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
            <div className={`user-details-drawer ${isOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <div className="user-header-info">
                        <div className="user-avatar-large">
                            {user.basic.name.charAt(0)}
                        </div>
                        <div className="user-title-group">
                            <h2 className="user-full-name">{user.basic.name}</h2>
                            <p className="user-id-badge">ID: {user.userId.split('-')[0].toUpperCase()}</p>
                        </div>
                    </div>
                    <button className="close-drawer-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="drawer-content">
                    {/* Account Section */}
                    <div className="drawer-section">
                        <h3 className="section-title">
                            <Shield size={18} />
                            Account Information
                        </h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Email Address</span>
                                <div className="info-value-wrapper">
                                    <Mail size={16} className="info-icon" />
                                    <span className="info-value">{user.account?.email || 'Not provided'}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Phone Number</span>
                                <div className="info-value-wrapper">
                                    <Phone size={16} className="info-icon" />
                                    <span className="info-value">{user.account?.phone || 'Not provided'}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Login Method</span>
                                <div className="info-value-wrapper">
                                    {user.account?.loginMethod === 'google' ? <Globe size={16} /> : <Smartphone size={16} />}
                                    <span className="info-value capitalize">{user.account?.loginMethod || 'Unknown'}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Join Date</span>
                                <div className="info-value-wrapper">
                                    <Clock size={16} />
                                    <span className="info-value">{formatDate(user.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Physical Stats */}
                    <div className="drawer-section">
                        <h3 className="section-title">
                            <Activity size={18} />
                            Physical Statistics
                        </h3>
                        <div className="stats-bubbles">
                            <div className="stat-bubble">
                                <span className="bubble-val">{user.physicalStats.height}</span>
                                <span className="bubble-unit">cm</span>
                                <span className="bubble-label">Height</span>
                            </div>
                            <div className="stat-bubble">
                                <span className="bubble-val">{user.physicalStats.weight}</span>
                                <span className="bubble-unit">kg</span>
                                <span className="bubble-label">Weight</span>
                            </div>
                            <div className="stat-bubble">
                                <span className={`bubble-val ${getBMIColor(bmi)}`}>{bmi.toFixed(1)}</span>
                                <span className="bubble-unit">BMI</span>
                                <span className="bubble-label">Composition</span>
                            </div>
                        </div>
                        <div className="info-grid mt-4">
                            <div className="info-item">
                                <span className="info-label">Activity Level</span>
                                <span className="info-value capitalize">{user.physicalStats.activityLevel}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Age / Gender</span>
                                <span className="info-value capitalize">{user.basic.age}y / {user.basic.gender}</span>
                            </div>
                        </div>
                    </div>

                    {/* Goals & Preferences */}
                    <div className="drawer-section">
                        <h3 className="section-title">
                            <Target size={18} />
                            Goals & Preferences
                        </h3>
                        <div className="goal-banner">
                            <div className="goal-status">
                                <span className="goal-label">Primary Goal</span>
                                <span className="goal-value capitalize">{user.goalPref.weightGoal.replace('_', ' ')}</span>
                            </div>
                            <div className="diet-status">
                                <span className="goal-label">Diet Type</span>
                                <span className="goal-value capitalize">{user.goalPref.dietType.replace('_', ' ')}</span>
                            </div>
                        </div>
                        <div className="allergy-section">
                            <span className="info-label">Allergies & Restrictions</span>
                            <div className="allergy-tags">
                                {user.goalPref.allergies ? (
                                    user.goalPref.allergies.split(',').map((a, i) => (
                                        <span key={i} className="allergy-tag">
                                            <AlertCircle size={14} />
                                            {a.trim()}
                                        </span>
                                    ))
                                ) : (
                                    <span className="no-data">No allergies disclosed</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="drawer-footer">
                        <button className="btn-secondary w-full mb-2">View Subscription History</button>
                        <button className="btn-outline-danger w-full text-red">Deactivate User Account</button>
                    </div>
                </div>
            </div>
        </>
    );
};
