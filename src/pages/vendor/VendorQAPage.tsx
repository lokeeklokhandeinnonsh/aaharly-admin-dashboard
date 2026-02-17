import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    AlertTriangle,
    FileText,
    Upload,
    CheckCircle,
    XCircle,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { vendorClient } from '../../services/vendorClient';

interface Audit {
    id: string;
    checklist: any;
    status: string; // 'PENDING' | 'PASSED' | 'FAILED' | 'NEEDS_IMPROVEMENT'
    created_at: string;
    score?: number;
    issues?: any;
}

export const VendorQAPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'audits' | 'issues'>('audits');
    const [audits, setAudits] = useState<Audit[]>([]);
    const [issues, setIssues] = useState<Audit[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedAudit, setExpandedAudit] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [checklistData, issuesData] = await Promise.all([
                vendorClient.qa.getChecklist(),
                vendorClient.qa.getIssues()
            ]);
            setAudits(checklistData);
            setIssues(issuesData);
        } catch (err) {
            console.error('Failed to fetch QA data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PASSED': return '#10B981'; // Green
            case 'FAILED': return '#EF4444'; // Red
            case 'NEEDS_IMPROVEMENT': return '#F59E0B'; // Orange
            default: return '#6B7280'; // Gray
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PASSED': return <CheckCircle size={18} color="#10B981" />;
            case 'FAILED': return <XCircle size={18} color="#EF4444" />;
            case 'NEEDS_IMPROVEMENT': return <AlertTriangle size={18} color="#F59E0B" />;
            default: return <ShieldCheck size={18} color="#6B7280" />;
        }
    };

    const styles = {
        page: {
            padding: '2rem',
            color: 'white',
            maxWidth: '1200px',
            margin: '0 auto'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
        },
        title: {
            fontSize: '1.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
        },
        tabs: {
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
        },
        tab: (active: boolean) => ({
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
            borderBottom: active ? '2px solid #3B82F6' : '2px solid transparent',
            color: active ? '#3B82F6' : 'rgba(255,255,255,0.6)',
            fontWeight: active ? 600 : 400,
            transition: 'all 0.2s'
        }),
        card: {
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            marginBottom: '1rem',
            overflow: 'hidden'
        },
        cardHeader: {
            padding: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.02)'
        },
        cardContent: {
            padding: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'rgba(15, 23, 42, 0.3)'
        },
        badge: (status: string) => ({
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            background: `${getStatusColor(status)}20`,
            color: getStatusColor(status),
            border: `1px solid ${getStatusColor(status)}40`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        }),
        checklistGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem',
            marginTop: '1rem'
        },
        item: {
            padding: '0.75rem',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        uploadBtn: {
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem'
        }
    };

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading QA data...</div>;

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <h1 style={styles.title}>
                    <ShieldCheck size={32} color="#3B82F6" />
                    QA & Safety Compliance
                </h1>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Overall Score</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10B981' }}>
                        {audits.length > 0 ? String(audits[0].score || 95) : '-'}%
                    </div>
                </div>
            </div>

            <div style={styles.tabs}>
                <div
                    style={styles.tab(activeTab === 'audits')}
                    onClick={() => setActiveTab('audits')}
                >
                    Audit History
                </div>
                <div
                    style={styles.tab(activeTab === 'issues')}
                    onClick={() => setActiveTab('issues')}
                >
                    Reported Issues {issues.length > 0 && `(${issues.length})`}
                </div>
            </div>

            {activeTab === 'audits' && (
                <div>
                    {audits.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                            No audits found. Your kitchen is pending initial review.
                        </div>
                    ) : (
                        audits.map(audit => (
                            <div key={audit.id} style={styles.card}>
                                <div
                                    style={styles.cardHeader}
                                    onClick={() => setExpandedAudit(expandedAudit === audit.id ? null : audit.id)}
                                >
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <FileText size={20} color="#94a3b8" />
                                        <div>
                                            <div style={{ fontWeight: 600 }}>Audit Report</div>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                                {new Date(audit.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={styles.badge(audit.status)}>
                                            {getStatusIcon(audit.status)}
                                            {audit.status.replace('_', ' ')}
                                        </div>
                                        {expandedAudit === audit.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>

                                {expandedAudit === audit.id && (
                                    <div style={styles.cardContent}>
                                        <h4 style={{ marginBottom: '1rem', color: '#e2e8f0' }}>Checklist Summary</h4>
                                        {audit.checklist ? (
                                            <div style={styles.checklistGrid}>
                                                {/* Render checklist items defensively as strings or objects */}
                                                {Array.isArray(audit.checklist) ? audit.checklist.map((item: any, idx: number) => (
                                                    <div key={idx} style={styles.item}>
                                                        <span style={{ fontSize: '0.9rem' }}>{item.label || item.name || item}</span>
                                                        {item.status === 'pass' ? <CheckCircle size={16} color="#10B981" /> : <XCircle size={16} color="#EF4444" />}
                                                    </div>
                                                )) : (
                                                    <div style={{ color: '#94a3b8' }}>Checklist data format not supported for display.</div>
                                                )}
                                            </div>
                                        ) : (
                                            <div style={{ color: '#94a3b8' }}>No checklist details available.</div>
                                        )}

                                        <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                                            <h4 style={{ marginBottom: '0.5rem', color: '#e2e8f0' }}>Compliance Documents</h4>
                                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
                                                Upload proof of fix or required certifications here.
                                            </p>
                                            <button style={styles.uploadBtn} onClick={() => alert('Document upload feature coming soon!')}>
                                                <Upload size={16} /> Upload Document
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'issues' && (
                <div>
                    {issues.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#10B981', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                            <ShieldCheck size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <h3>No Open Issues</h3>
                            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Great job! Your kitchen is fully compliant.</p>
                        </div>
                    ) : (
                        issues.map(audit => (
                            <div key={audit.id} style={{ ...styles.card, border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                                <div style={styles.cardHeader}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <AlertTriangle size={20} color="#EF4444" />
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#EF4444' }}>Critical Issues Found</div>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                                Audit Date: {new Date(audit.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={styles.cardContent}>
                                    {/* Render Issues */}
                                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', color: '#fca5a5' }}>
                                        {JSON.stringify(audit.issues, null, 2)}
                                    </div>
                                    <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                                        Please resolve these issues immediately and request a re-audit.
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
