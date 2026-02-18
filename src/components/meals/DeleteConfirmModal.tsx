import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Delete Meal Plan',
    message = 'Are you sure you want to delete this plan? This will remove all associated meals from subscriptions.',
    isDeleting = false,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 100,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onClick={onClose}
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            onClick={e => e.stopPropagation()}
                            style={{
                                background: 'rgba(15, 23, 42, 0.95)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: '20px',
                                padding: '2rem',
                                maxWidth: '420px',
                                width: '90%',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(239, 68, 68, 0.1)',
                            }}
                        >
                            {/* Icon */}
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 1.25rem auto',
                            }}>
                                <AlertTriangle size={28} color="#f87171" />
                            </div>

                            {/* Title */}
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color: 'white',
                                textAlign: 'center',
                                margin: '0 0 0.75rem 0',
                            }}>
                                {title}
                            </h3>

                            {/* Message */}
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#94a3b8',
                                textAlign: 'center',
                                lineHeight: 1.6,
                                margin: '0 0 1.75rem 0',
                            }}>
                                {message}
                            </p>

                            {/* Actions */}
                            <div style={{
                                display: 'flex',
                                gap: '0.75rem',
                                justifyContent: 'center',
                            }}>
                                <button
                                    onClick={onClose}
                                    disabled={isDeleting}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        background: 'transparent',
                                        color: '#94a3b8',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s',
                                        flex: 1,
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#e2e8f0'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#94a3b8'; }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isDeleting}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                        color: 'white',
                                        cursor: isDeleting ? 'not-allowed' : 'pointer',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.35)',
                                        opacity: isDeleting ? 0.6 : 1,
                                        transition: 'all 0.2s',
                                        flex: 1,
                                    }}
                                    onMouseEnter={e => { if (!isDeleting) e.currentTarget.style.boxShadow = '0 6px 24px rgba(239, 68, 68, 0.5)'; }}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.35)'}
                                >
                                    <Trash2 size={16} />
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
