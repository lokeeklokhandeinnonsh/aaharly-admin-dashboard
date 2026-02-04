import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Shield, User, Sparkles, Zap } from 'lucide-react';
import { AuthInput } from '../../components/auth/AuthInput';

export const LoginPage: React.FC = () => {
    // Logic State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // UI/Responsive State
    const [width, setWidth] = useState(window.innerWidth);
    const [signInHover, setSignInHover] = useState(false);
    const [signInActive, setSignInActive] = useState(false);
    const [hoveredQuickBtn, setHoveredQuickBtn] = useState<string | null>(null);
    const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isLaptop = width <= 1024;
    const isMobile = width <= 640;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const cleanEmail = email.trim();
        const cleanPassword = password.trim();

        try {
            const success = await login(cleanEmail, cleanPassword);
            if (success) {
                navigate('/');
            } else {
                setError('Invalid credentials.');
                setIsLoading(false);
            }
        } catch (err) {
            setError('Login failed. Please try again.');
            setIsLoading(false);
        }
    };

    const fillCredentials = (role: 'admin' | 'vendor' | 'staff') => {
        if (role === 'admin') {
            setEmail('admin@aaharly.com');
            setPassword('admin123');
        }
        if (role === 'vendor') {
            setEmail('ravet.vendor@aaharly.com');
            setPassword('ravet@123');
        }
        if (role === 'staff') {
            setEmail('staff@aaharly.com');
            setPassword('staff123');
        }
        setError('');
    };

    // --- STYLES ---
    const styles = {
        page: {
            minHeight: '100vh',
            display: 'flex',
            position: 'relative' as const,
            overflow: 'hidden',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            background: '#0a0e27', // Fallback
        },
        bg: {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #0a0e27 0%, #000000 100%)',
            zIndex: 0,
        },
        orbBase: {
            position: 'absolute' as const,
            borderRadius: '50%',
            filter: 'blur(80px)',
            opacity: 0.4,
            animation: 'float 20s infinite ease-in-out',
        },
        orb1: {
            width: '500px',
            height: '500px',
            background: 'linear-gradient(135deg, #FF7A18 0%, #FF5722 100%)',
            top: '-250px',
            left: '-250px',
            animationDelay: '0s',
        },
        orb2: {
            width: '400px',
            height: '400px',
            background: 'linear-gradient(135deg, #FF5722 0%, #FF7A18 100%)',
            bottom: '-200px',
            right: '-200px',
            animationDelay: '7s',
        },
        orb3: {
            width: '300px',
            height: '300px',
            background: 'linear-gradient(135deg, #FF7A18 0%, #FF5722 100%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDelay: '14s',
        },
        // Branding (Left Side)
        brand: {
            flex: 1,
            display: isLaptop ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem',
            position: 'relative' as const,
            zIndex: 1,
        },
        brandContent: {
            maxWidth: '500px',
            animation: 'slideInLeft 0.8s ease-out',
        },
        logoWrapper: {
            position: 'relative' as const,
            width: 'fit-content',
            marginBottom: '3rem',
        },
        logoGlow: {
            position: 'absolute' as const,
            inset: '-30px',
            background: 'radial-gradient(circle, rgba(255, 122, 24, 0.4) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse 3s infinite',
        },
        logoImg: {
            position: 'relative' as const,
            width: isMobile ? '180px' : '240px',
            height: 'auto',
            filter: 'drop-shadow(0 20px 60px rgba(255, 122, 24, 0.4))',
        },
        tagline: {
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: '0 0 3rem 0',
            lineHeight: 1.6,
            fontWeight: 500,
        },
        brandFeatures: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '1rem',
        },
        featureItem: (hovered: boolean) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            background: hovered ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: hovered ? '1px solid rgba(255, 122, 24, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.875rem',
            transition: 'all 0.3s ease',
            transform: hovered ? 'translateX(5px)' : 'none',
            cursor: 'default',
        }),
        featureIcon: {
            color: '#FF7A18',
        },
        // Login Main (Right Side)
        main: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '2rem 1rem' : '4rem 2rem',
            position: 'relative' as const,
            zIndex: 1,
        },
        card: {
            width: '100%',
            maxWidth: '480px',
            padding: isMobile ? '2rem 1.5rem' : '3rem',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            animation: 'slideInRight 0.8s ease-out',
        },
        cardHeader: {
            textAlign: 'center' as const,
            marginBottom: '2.5rem',
        },
        cardTitle: {
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: 700,
            color: 'white',
            margin: 0,
            textAlign: 'center' as const,
        },
        form: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '1.5rem',
            marginBottom: '2rem',
        },
        errorMsg: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            color: '#ef4444',
            fontSize: '0.875rem',
            animation: 'shake 0.4s ease',
        },
        errorIcon: {
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#ef4444',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.75rem',
            flexShrink: 0,
        },
        btnSignin: {
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, #FF7A18 0%, #FF5722 100%)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: signInHover && !isLoading ? '0 12px 32px rgba(255, 122, 24, 0.5)' : '0 8px 24px rgba(255, 122, 24, 0.3)',
            transform: signInActive && !isLoading ? 'translateY(0)' : signInHover && !isLoading ? 'translateY(-2px)' : 'none',
            opacity: isLoading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
        },
        spinner: {
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
        },
        quickLogin: {
            marginTop: '2rem',
        },
        divider: {
            position: 'relative' as const,
            textAlign: 'center' as const,
            marginBottom: '1.5rem',
        },
        dividerLine: {
            position: 'absolute' as const,
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            background: 'rgba(255, 255, 255, 0.1)',
        },
        dividerText: {
            position: 'relative' as const,
            display: 'inline-block',
            padding: '0 1rem',
            background: 'rgba(255, 255, 255, 0.03)', // This needs to match the card bg to "cut" the line visually, but card bg is transparent blur. Actually original CSS said `background: rgba(255, 255, 255, 0.03)`.
            // Wait, if it's transparent, the line behind it is visible? No, because z-index/stacking context or just it's on top.
            // But if the bg is semi-transparent, the line shows through.
            // The original CSS used `background: rgba(255, 255, 255, 0.03)`.
            // I'll stick to that.
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
            borderRadius: '4px', // Added small radius just in case
        },
        quickLoginButtons: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '0.75rem',
        },
        quickBtn: (role: string, hovered: boolean) => {
            let borderColor = 'rgba(255, 255, 255, 0.05)';
            let transform = 'none';
            if (hovered) {
                transform = 'translateX(4px)';
                if (role === 'admin') borderColor = 'rgba(34, 197, 94, 0.3)';
                else if (role === 'vendor') borderColor = 'rgba(59, 130, 246, 0.3)';
                else if (role === 'staff') borderColor = 'rgba(156, 163, 175, 0.3)';
                else borderColor = 'rgba(255, 122, 24, 0.3)';
            }
            return {
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: hovered ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${borderColor}`,
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left' as const,
                transform,
            };
        },
        quickBtnIcon: (role: string, hovered: boolean) => {
            let color = 'inherit';
            if (hovered) {
                if (role === 'admin') color = '#22c55e';
                else if (role === 'vendor') color = '#3b82f6';
                else if (role === 'staff') color = '#9ca3af';
            }
            return {
                flexShrink: 0,
                opacity: hovered ? 1 : 0.7,
                color,
            };
        },
        quickBtnContent: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '0.125rem',
        },
        quickBtnTitle: {
            fontSize: '0.875rem',
            fontWeight: 600,
        },
        quickBtnEmail: {
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.5)',
        },
        footer: {
            marginTop: '2rem',
            textAlign: 'center' as const,
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '0.75rem',
        }
    };

    const keyframes = `
        @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(50px, -50px) scale(1.1); }
            66% { transform: translate(-50px, 50px) scale(0.9); }
        }
        @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;

    return (
        <div style={styles.page}>
            <style>{keyframes}</style>

            {/* Animated Background */}
            <div style={styles.bg}>
                <div style={{ ...styles.orbBase, ...styles.orb1 }}></div>
                <div style={{ ...styles.orbBase, ...styles.orb2 }}></div>
                <div style={{ ...styles.orbBase, ...styles.orb3 }}></div>
            </div>

            {/* Left Side - Branding */}
            <div style={styles.brand}>
                <div style={styles.brandContent}>
                    <div style={styles.logoWrapper}>
                        <div style={styles.logoGlow}></div>
                        <img src="/logo.svg" alt="Aaharly" style={styles.logoImg} />
                    </div>
                    <p style={styles.tagline}>Powering Smart Nutrition Operations</p>

                    <div style={styles.brandFeatures}>
                        {[
                            { icon: <Sparkles size={20} style={styles.featureIcon} />, text: "Premium Meal Management" },
                            { icon: <Zap size={20} style={styles.featureIcon} />, text: "Real-time Analytics" }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                style={styles.featureItem(hoveredFeature === idx)}
                                onMouseEnter={() => setHoveredFeature(idx)}
                                onMouseLeave={() => setHoveredFeature(null)}
                            >
                                {item.icon}
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Login Card */}
            <div style={styles.main}>
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.cardTitle}>Admin Portal</h2>
                    </div>

                    <form onSubmit={handleLogin} style={styles.form}>
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
                            <div style={styles.errorMsg}>
                                <div style={styles.errorIcon}>!</div>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            style={styles.btnSignin}
                            disabled={isLoading}
                            onMouseEnter={() => setSignInHover(true)}
                            onMouseLeave={() => { setSignInHover(false); setSignInActive(false); }}
                            onMouseDown={() => setSignInActive(true)}
                            onMouseUp={() => setSignInActive(false)}
                        >
                            {isLoading ? (
                                <>
                                    <div style={styles.spinner}></div>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Dev Quick Login */}
                    <div style={styles.quickLogin}>
                        <div style={styles.divider}>
                            <div style={styles.dividerLine}></div>
                            <span style={styles.dividerText}>Quick Login (Dev Only)</span>
                        </div>

                        <div style={styles.quickLoginButtons}>
                            {[
                                { role: 'admin', icon: Shield, title: 'Super Admin', email: 'admin@aaharly.com', color: '#22c55e' },
                                { role: 'vendor', icon: User, title: 'Vendor Admin', email: 'ravet.vendor@aaharly.com', color: '#3b82f6' },
                                { role: 'staff', icon: User, title: 'Staff', email: 'staff@aaharly.com', color: '#9ca3af' }
                            ].map((btn) => (
                                <button
                                    key={btn.role}
                                    style={styles.quickBtn(btn.role, hoveredQuickBtn === btn.role)}
                                    // @ts-ignore
                                    onClick={() => fillCredentials(btn.role)}
                                    onMouseEnter={() => setHoveredQuickBtn(btn.role)}
                                    onMouseLeave={() => setHoveredQuickBtn(null)}
                                >
                                    <btn.icon size={18} style={styles.quickBtnIcon(btn.role, hoveredQuickBtn === btn.role)} />
                                    <div style={styles.quickBtnContent}>
                                        <span style={styles.quickBtnTitle}>{btn.title}</span>
                                        <span style={styles.quickBtnEmail}>{btn.email}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <p style={styles.footer}>
                    © 2024 Aaharly. All rights reserved.
                </p>
            </div>
        </div>
    );
};
