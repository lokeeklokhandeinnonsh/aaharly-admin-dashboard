import React, { useState } from 'react';

interface AuthInputProps {
    type: 'email' | 'password' | 'text';
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    icon: React.ReactNode;
    label: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
    type,
    value,
    onChange,
    placeholder,
    icon,
    label
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const styles = {
        group: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '0.5rem',
        },
        label: {
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.9)',
        },
        wrapper: {
            position: 'relative' as const,
            display: 'flex',
            alignItems: 'center',
        },
        icon: {
            position: 'absolute' as const,
            left: '1rem',
            color: isFocused ? '#FF7A18' : 'rgba(255, 255, 255, 0.4)',
            pointerEvents: 'none' as const,
            transition: 'color 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        input: {
            width: '100%',
            padding: '1rem 1rem 1rem 3rem',
            background: isFocused ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.05)',
            border: isFocused ? '1px solid #FF7A18' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            outline: 'none',
            boxShadow: isFocused ? '0 0 0 3px rgba(255, 122, 24, 0.15)' : 'none',
        }
    };

    return (
        <div style={styles.group}>
            <label style={styles.label}>{label}</label>
            <div style={styles.wrapper}>
                <div style={styles.icon}>
                    {icon}
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={styles.input}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </div>
            {/* Styles to handle placeholder color since it can't be done inline on input easily without a style tag or styled-components */}
            <style>
                {`
                input::placeholder {
                    color: rgba(255, 255, 255, 0.3);
                }
                `}
            </style>
        </div>
    );
};

