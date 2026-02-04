import React from 'react';

interface CustomerStatusBadgeProps {
    status: 'active' | 'paused' | 'expired';
}

export const CustomerStatusBadge: React.FC<CustomerStatusBadgeProps> = ({ status }) => {
    const getStyles = (status: string) => {
        switch (status) {
            case 'active':
                return {
                    bg: 'rgba(16, 185, 129, 0.12)',
                    border: 'rgba(16, 185, 129, 0.25)',
                    text: '#34D399',
                    icon: '●'
                };
            case 'paused':
                return {
                    bg: 'rgba(245, 158, 11, 0.12)',
                    border: 'rgba(245, 158, 11, 0.25)',
                    text: '#FBBF24',
                    icon: '⏸'
                };
            case 'expired':
                return {
                    bg: 'rgba(156, 163, 175, 0.12)',
                    border: 'rgba(156, 163, 175, 0.25)',
                    text: '#9CA3AF',
                    icon: 'x'
                };
            default:
                return {
                    bg: 'rgba(59, 130, 246, 0.12)',
                    border: 'rgba(59, 130, 246, 0.25)',
                    text: '#60A5FA',
                    icon: '?'
                };
        }
    };

    const style = getStyles(status);

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: '8px',
                color: style.text,
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                width: 'fit-content'
            }}
        >
            <span style={{ fontSize: '0.6rem' }}>{style.icon}</span>
            {status}
        </span>
    );
};
