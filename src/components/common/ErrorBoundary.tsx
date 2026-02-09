
import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary-fallback" style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#cbd5e1',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '16px',
                    margin: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#f87171' }}>Something went wrong.</h2>
                    <p style={{ marginBottom: '1.5rem', color: '#94a3b8' }}>
                        We're sorry, but the application encountered an unexpected error.
                    </p>
                    <div style={{
                        background: '#0f172a',
                        padding: '1rem',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        marginBottom: '1.5rem',
                        textAlign: 'left',
                        overflowX: 'auto',
                        color: '#f87171'
                    }}>
                        {this.state.error && this.state.error.toString()}
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 20px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            transition: 'background 0.2s'
                        }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
