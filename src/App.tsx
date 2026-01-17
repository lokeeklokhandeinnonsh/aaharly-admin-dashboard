import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardHome } from './pages/DashboardHome';
import { LoginPage } from './pages/auth/LoginPage';
import { UsersPage } from './pages/UsersPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { NutritionCategoriesPage } from './pages/NutritionCategoriesPage';
import { OffersPage } from './pages/OffersPage';
import { ProductionDashboard } from './pages/vendor/ProductionDashboard';
import { ReportsPage } from './pages/ReportsPage';
import { MealsPage } from './pages/MealsPage';
import { InventoryPage } from './pages/vendor/InventoryPage';
import { DispatchCenter } from './pages/vendor/DispatchCenter';
import { KitchenPrepPage } from './pages/vendor/KitchenPrepPage';
import { VendorsPage } from './pages/VendorsPage';

// Guard Component to handle redirections based on auth status and role
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Root Redirector based on Role
const RootRedirector = () => {
  const { role } = useAuth();
  if (role === 'SUPER_ADMIN') return <DashboardHome />;
  if (role === 'VENDOR_ADMIN') return <ProductionDashboard />;
  if (role === 'VENDOR_STAFF') return <Navigate to="/vendor/kitchen" replace />;
  return <DashboardHome />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<RootRedirector />} />

            {/* Management */}
            <Route path="users" element={<UsersPage />} />
            <Route path="admins" element={<UsersPage />} />
            <Route path="vendors" element={<VendorsPage />} />

            {/* Content */}
            <Route path="categories" element={<NutritionCategoriesPage />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="meals" element={<MealsPage />} />

            {/* Subscriptions */}
            <Route path="subscriptions" element={<SubscriptionsPage />} />

            {/* Vendor Routes */}
            <Route path="vendor/production" element={<ProductionDashboard />} />
            <Route path="vendor/kitchen" element={<KitchenPrepPage />} />
            <Route path="vendor/dispatch" element={<DispatchCenter />} />
            <Route path="vendor/inventory" element={<InventoryPage />} />

            {/* System */}
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<div className="p-8">Settings Placeholder (Admins Only)</div>} />

            {/* Fallback routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
