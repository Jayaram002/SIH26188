import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUser } from '@/store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      officer_id: officerId || 'IMM001',
      full_name: 'John Doe',
      role: 'IMMIGRATION_OFFICER',
      terminal: 'T2',
      shift: 'Day Shift',
      access_token: 'fake-token'
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex text-text-primary bg-bg-primary">
      <div className="w-3/5 p-12 flex flex-col justify-center border-r border-border-primary bg-bg-secondary relative overflow-hidden">
        <div className="z-10 relative">
          <h1 className="text-6xl font-bold mb-4">✈ AEROSHIELD AI</h1>
          <h2 className="text-2xl text-accent-secondary mb-6">Airport Identity Security & Screening Platform</h2>
          <p className="text-xl text-text-secondary mb-8">One Passenger. Multiple Signals. One Explainable Security Decision.</p>
          <ul className="space-y-4 text-lg">
            <li className="flex items-center"><span className="mr-3 text-verified">✓</span> Multi-modal Biometrics Verification</li>
            <li className="flex items-center"><span className="mr-3 text-verified">✓</span> Advanced Document Forensics</li>
            <li className="flex items-center"><span className="mr-3 text-verified">✓</span> Explainable AI Risk Assessment</li>
          </ul>
        </div>
        <div className="absolute bottom-4 left-12 text-sm text-text-muted">
          AeroShield AI © 2026. Authorized personnel only. All access is logged and monitored.
        </div>
      </div>
      <div className="w-2/5 p-12 flex flex-col justify-center bg-bg-primary">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center">OFFICER LOGIN</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Officer ID</label>
              <input 
                type="text" 
                value={officerId}
                onChange={e => setOfficerId(e.target.value)}
                className="w-full bg-bg-card border border-border-primary rounded-md px-4 py-3 text-white focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
                placeholder="Enter ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
              <input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-bg-card border border-border-primary rounded-md px-4 py-3 text-white focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
                placeholder="Enter password"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold py-3 rounded-md hover:from-accent-secondary hover:to-accent-primary transition-all shadow-[0_0_15px_rgba(35,82,160,0.4)]"
            >
              SIGN IN
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-border-primary">
            <h3 className="text-sm font-medium text-text-secondary mb-4">Quick Demo Access</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={() => { setOfficerId('ADMIN'); setPassword('demo'); }} className="p-2 border border-border-primary rounded bg-bg-card hover:bg-bg-card-hover text-sm">Admin</button>
              <button onClick={() => { setOfficerId('IMM001'); setPassword('demo'); }} className="p-2 border border-border-primary rounded bg-bg-card hover:bg-bg-card-hover text-sm">Immigration</button>
              <button onClick={() => { setOfficerId('SEC002'); setPassword('demo'); }} className="p-2 border border-border-primary rounded bg-bg-card hover:bg-bg-card-hover text-sm">Security</button>
              <button onClick={() => { setOfficerId('AUDIT99'); setPassword('demo'); }} className="p-2 border border-border-primary rounded bg-bg-card hover:bg-bg-card-hover text-sm">Auditor</button>
            </div>

            <button
              onClick={() => navigate('/passenger-kiosk')}
              className="w-full py-3 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500 text-emerald-300 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              <span>✈ LAUNCH PASSENGER SELF-SERVICE KIOSK</span>
            </button>
          </div>
          
          <div className="mt-8 flex items-center justify-center space-x-4 text-xs text-text-muted">
            <div className="flex items-center"><span className="status-dot online mr-2"></span> System Online</div>
            <div className="flex items-center"><span className="status-dot online mr-2"></span> Biometrics Active</div>
          </div>
        </div>
      </div>
    </div>
  );
}
