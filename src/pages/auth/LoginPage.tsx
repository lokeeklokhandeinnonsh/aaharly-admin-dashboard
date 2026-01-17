import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Shield, User, Sparkles, Zap } from 'lucide-react';
import { AuthInput } from '../../components/auth/AuthInput';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay for better UX
        setTimeout(() => {
            if (login(email, password)) {
                navigate('/');
            } else {
                setError('Invalid credentials. Try the quick login options below.');
                setIsLoading(false);
            }
        }, 800);
    };

    const fillCredentials = (role: 'admin' | 'vendor' | 'staff') => {
        if (role === 'admin') {
            setEmail('admin@aaharly.com');
            setPassword('admin123');
        }
        if (role === 'vendor') {
            setEmail('vendor@aaharly.com');
            setPassword('vendor123');
        }
        if (role === 'staff') {
            setEmail('staff@aaharly.com');
            setPassword('staff123');
        }
        setError('');
    };

    return (
        <div className="login-page">
            {/* Animated Background */}
            <div className="login-bg">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            {/* Left Side - Branding */}
            <div className="login-brand">
                <div className="brand-content">
                    <div className="brand-logo-wrapper">
                        <div className="brand-logo-glow"></div>
                        <img src="/logo.svg" alt="Aaharly" className="brand-logo-img" />
                    </div>
                    <p className="brand-tagline">Powering Smart Nutrition Operations</p>

                    <div className="brand-features">
                        <div className="feature-item">
                            <Sparkles size={20} />
                            <span>Premium Meal Management</span>
                        </div>
                        <div className="feature-item">
                            <Zap size={20} />
                            <span>Real-time Analytics</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Card */}
            <div className="login-main">
                <div className="login-card">
                    <div className="card-header">
                        <h2 className="card-title">Admin Portal</h2>
                    
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        <AuthInput
                            type="email"
                            value={email}
                            onChange={setEmail}
                            placeholder="admin@aaharly.com"
                            icon={<Mail size={20} />}
                            label="Email Address"
                        />

                        <AuthInput
                            type="password"
                            value={password}
                            onChange={setPassword}
                            placeholder="••••••••"
                            icon={<Lock size={20} />}
                            label="Password"
                        />

                        {error && (
                            <div className="error-message">
                                <div className="error-icon">!</div>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-signin"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="spinner"></div>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Dev Quick Login */}
                    <div className="quick-login">
                        <div className="divider">
                            <span>Quick Login (Dev Only)</span>
                        </div>

                        <div className="quick-login-buttons">
                            <button
                                className="quick-btn quick-btn-admin"
                                onClick={() => fillCredentials('admin')}
                            >
                                <Shield size={18} />
                                <div className="quick-btn-content">
                                    <span className="quick-btn-title">Super Admin</span>
                                    <span className="quick-btn-email">admin@aaharly.com</span>
                                </div>
                            </button>

                            <button
                                className="quick-btn quick-btn-vendor"
                                onClick={() => fillCredentials('vendor')}
                            >
                                <User size={18} />
                                <div className="quick-btn-content">
                                    <span className="quick-btn-title">Vendor Admin</span>
                                    <span className="quick-btn-email">vendor@aaharly.com</span>
                                </div>
                            </button>

                            <button
                                className="quick-btn quick-btn-staff"
                                onClick={() => fillCredentials('staff')}
                            >
                                <User size={18} />
                                <div className="quick-btn-content">
                                    <span className="quick-btn-title">Staff</span>
                                    <span className="quick-btn-email">staff@aaharly.com</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <p className="login-footer">
                    © 2024 Aaharly. All rights reserved.
                </p>
            </div>
        </div>
    );
};
