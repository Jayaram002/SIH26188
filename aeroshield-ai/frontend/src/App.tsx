import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Verification from './pages/Verification';
import Reviews from './pages/Reviews';
import AuditLog from './pages/AuditLog';
import Passengers from './pages/Passengers';
import AdminSettings from './pages/AdminSettings';
import SystemHealth from './pages/SystemHealth';
import Reports from './pages/Reports';
import PassengerPortal from './pages/PassengerPortal';
import RedFlagAlertBanner from './components/shared/RedFlagAlertBanner';
import { getUser, clearUser, isAdmin } from './store/authStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('aeroshield_token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

interface NavItemProps {
  to: string;
  icon: string;
  label: string;
  badge?: number;
}

function NavItem({ to, icon, label, badge }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition-colors ${
          isActive
            ? 'bg-accent-primary/20 text-white border border-accent-primary/30'
            : 'text-text-secondary hover:bg-bg-card hover:text-white'
        }`
      }
    >
      <span className="text-base">{icon}</span>
      <span className="font-medium flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="px-1.5 py-0.5 bg-review text-black text-xs font-bold rounded-full min-w-[20px] text-center">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

function AppSidebar() {
  const navigate = useNavigate();
  const user = getUser();
  const admin = isAdmin();

  const handleLogout = () => {
    clearUser();
    navigate('/login');
  };

  return (
    <aside className="w-56 bg-bg-secondary border-r border-border-primary flex flex-col flex-shrink-0 h-screen">
      {/* Logo */}
      <div className="p-4 border-b border-border-primary">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-accent-primary rounded-lg flex items-center justify-center text-lg">✈</div>
          <div>
            <div className="font-black text-sm tracking-wider text-white">AEROSHIELD</div>
            <div className="text-xs text-accent-secondary font-medium">TERMINAL 2</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        <div className="mb-1">
          <div className="text-xs font-bold text-text-muted tracking-widest px-3 mb-2 mt-1">OPERATIONS</div>
          <NavItem to="/dashboard" icon="📊" label="Dashboard" />
          <NavItem to="/verify" icon="🔍" label="Screening" />
          <NavItem to="/reviews" icon="📋" label="Review Queue" badge={3} />
        </div>

        <div className="mb-1">
          <div className="text-xs font-bold text-text-muted tracking-widest px-3 mb-2 mt-4">INTELLIGENCE</div>
          <NavItem to="/passengers" icon="👤" label="Passengers" />
          <NavItem to="/audit" icon="📜" label="Audit Log" />
          <NavItem to="/reports" icon="📑" label="Reports" />
        </div>

        {admin && (
          <div className="mb-1">
            <div className="text-xs font-bold text-text-muted tracking-widest px-3 mb-2 mt-4">ADMIN</div>
            <NavItem to="/admin/settings" icon="⚙️" label="Settings" />
            <NavItem to="/admin/health" icon="💊" label="System Health" />
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border-primary">
        <div className="mb-3">
          <div className="text-xs text-text-muted">OFFICER</div>
          <div className="font-semibold text-sm truncate text-white">{user?.full_name || 'Officer'}</div>
          <div className="text-xs text-accent-secondary">{user?.officer_id} • {user?.shift}</div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="status-dot online"></span>
          <span className="text-xs text-verified font-medium">OPERATIONAL</span>
          <span className="ml-auto text-xs text-review px-1.5 py-0.5 border border-review/50 rounded">DEMO</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2 border border-border-primary rounded text-xs text-text-muted hover:bg-bg-card hover:text-white transition-colors"
        >
          SIGN OUT
        </button>
      </div>
    </aside>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-bg-primary overflow-hidden">
      <RedFlagAlertBanner />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/passenger-kiosk" element={<PassengerPortal />} />
        <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/verify" element={<ProtectedRoute><Verification /></ProtectedRoute>} />
        <Route path="/reviews" element={<ProtectedRoute><AppLayout><Reviews /></AppLayout></ProtectedRoute>} />
        <Route path="/audit" element={<ProtectedRoute><AppLayout><AuditLog /></AppLayout></ProtectedRoute>} />
        <Route path="/passengers" element={<ProtectedRoute><AppLayout><Passengers /></AppLayout></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><AppLayout><AdminSettings /></AppLayout></ProtectedRoute>} />
        <Route path="/admin/health" element={<ProtectedRoute><AppLayout><SystemHealth /></AppLayout></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><AppLayout><Reports /></AppLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
