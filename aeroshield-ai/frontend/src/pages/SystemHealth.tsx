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
