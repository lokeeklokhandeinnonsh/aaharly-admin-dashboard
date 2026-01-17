import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import './DashboardLayout.css';

export const DashboardLayout: React.FC = () => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};
