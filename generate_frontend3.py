import os

frontend_dir = r"d:\temp C\all filess\ram\SIHH\aeroshield-ai\frontend"

def write_file(path, content):
    full_path = os.path.join(frontend_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

write_file("src/pages/Reviews.tsx", """
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Reviews() {
  const navigate = useNavigate();
  return (
    <div className="p-8 text-white min-h-screen bg-bg-primary">
      <h1 className="text-3xl font-bold mb-4">Security Review Queue</h1>
      <button onClick={() => navigate('/dashboard')} className="mb-4 px-4 py-2 bg-accent-primary rounded text-sm">← Back to Dashboard</button>
      <div className="aviation-panel p-6">
        <p className="text-text-secondary">No pending reviews at this time.</p>
      </div>
    </div>
  );
}
""")

write_file("src/pages/AuditLog.tsx", """
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuditLog() {
  const navigate = useNavigate();
  return (
    <div className="p-8 text-white min-h-screen bg-bg-primary">
      <h1 className="text-3xl font-bold mb-4">System Audit Log</h1>
      <button onClick={() => navigate('/dashboard')} className="mb-4 px-4 py-2 bg-accent-primary rounded text-sm">← Back to Dashboard</button>
      <div className="aviation-panel p-6">
        <p className="text-text-secondary">System audit records will appear here.</p>
      </div>
    </div>
  );
}
""")

write_file("src/pages/Passengers.tsx", """
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Passengers() {
  const navigate = useNavigate();
  return (
    <div className="p-8 text-white min-h-screen bg-bg-primary">
      <h1 className="text-3xl font-bold mb-4">Passenger Database</h1>
      <button onClick={() => navigate('/dashboard')} className="mb-4 px-4 py-2 bg-accent-primary rounded text-sm">← Back to Dashboard</button>
      <div className="aviation-panel p-6">
        <p className="text-text-secondary">Search passenger records.</p>
      </div>
    </div>
  );
}
""")

write_file("src/pages/AdminSettings.tsx", """
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminSettings() {
  const navigate = useNavigate();
  return (
    <div className="p-8 text-white min-h-screen bg-bg-primary">
      <h1 className="text-3xl font-bold mb-4">Administration & Settings</h1>
      <button onClick={() => navigate('/dashboard')} className="mb-4 px-4 py-2 bg-accent-primary rounded text-sm">← Back to Dashboard</button>
      <div className="aviation-panel p-6">
        <p className="text-text-secondary">System configuration parameters.</p>
      </div>
    </div>
  );
}
""")

write_file("src/pages/SystemHealth.tsx", """
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SystemHealth() {
  const navigate = useNavigate();
  return (
    <div className="p-8 text-white min-h-screen bg-bg-primary">
      <h1 className="text-3xl font-bold mb-4">System Health Dashboard</h1>
      <button onClick={() => navigate('/dashboard')} className="mb-4 px-4 py-2 bg-accent-primary rounded text-sm">← Back to Dashboard</button>
      <div className="grid grid-cols-3 gap-4">
        <div className="aviation-panel p-6 flex flex-col items-center">
          <div className="status-dot online w-4 h-4 mb-2"></div>
          <div className="font-bold">Core API</div>
          <div className="text-sm text-verified">99.9% Uptime</div>
        </div>
        <div className="aviation-panel p-6 flex flex-col items-center">
          <div className="status-dot online w-4 h-4 mb-2"></div>
          <div className="font-bold">Biometric Engine</div>
          <div className="text-sm text-verified">Operational</div>
        </div>
        <div className="aviation-panel p-6 flex flex-col items-center">
          <div className="status-dot online w-4 h-4 mb-2"></div>
          <div className="font-bold">Database</div>
          <div className="text-sm text-verified">Replicating</div>
        </div>
      </div>
    </div>
  );
}
""")

write_file("src/pages/Reports.tsx", """
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Reports() {
  const navigate = useNavigate();
  return (
    <div className="p-8 text-white min-h-screen bg-bg-primary">
      <h1 className="text-3xl font-bold mb-4">Screening Reports</h1>
      <button onClick={() => navigate('/dashboard')} className="mb-4 px-4 py-2 bg-accent-primary rounded text-sm">← Back to Dashboard</button>
      <div className="aviation-panel p-6">
        <p className="text-text-secondary">Generate and view operational reports.</p>
      </div>
    </div>
  );
}
""")

write_file("src/App.tsx", """
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Verification from './pages/Verification';
import Reviews from './pages/Reviews';
import AuditLog from './pages/AuditLog';
import Passengers from './pages/Passengers';
import AdminSettings from './pages/AdminSettings';
import SystemHealth from './pages/SystemHealth';
import Reports from './pages/Reports';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('aeroshield_token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/verify" element={<ProtectedRoute><Verification /></ProtectedRoute>} />
        <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
        <Route path="/audit" element={<ProtectedRoute><AuditLog /></ProtectedRoute>} />
        <Route path="/passengers" element={<ProtectedRoute><Passengers /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
        <Route path="/admin/health" element={<ProtectedRoute><SystemHealth /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
""")
