import React from 'react';

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
    return (
        <div className="auth-input-group">
            <label className="auth-label">{label}</label>
            <div className="auth-input-wrapper">
                <div className="auth-input-icon">{icon}</div>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="auth-input"
                />
            </div>
        </div>
    );
};
