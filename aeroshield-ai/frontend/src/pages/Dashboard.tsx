import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '@/store/authStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full bg-bg-primary text-text-primary p-6 overflow-y-auto">
      <header className="flex justify-between items-center mb-8 border-b border-border-primary pb-4">
        <div className="text-xl font-bold tracking-wider">
          ✈ AEROSHIELD AI | <span className="text-accent-secondary">TERMINAL 2</span> | INTERNATIONAL SECURITY OPERATIONS
        </div>
        <div className="text-lg font-mono text-accent-primary">{time}</div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="font-semibold">{user?.full_name || 'OFFICER'}</div>
            <div className="text-xs text-text-secondary">{user?.role || 'IMMIGRATION'} • {user?.shift || 'DAY'}</div>
          </div>
          <div className="w-10 h-10 bg-accent-primary rounded-full flex items-center justify-center font-bold">
            {user?.full_name?.charAt(0) || 'O'}
          </div>
        </div>
      </header>
      
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="aviation-panel p-4 border-t-4 border-t-info">
          <div className="text-sm text-text-secondary mb-1">PASSENGERS SCREENED</div>
          <div className="text-3xl font-bold">1,284 <span className="text-sm text-verified font-normal">↑3.2%</span></div>
        </div>
        <div className="aviation-panel p-4 border-t-4 border-t-verified glow-verified">
          <div className="text-sm text-text-secondary mb-1">VERIFIED</div>
          <div className="text-3xl font-bold">1,198 <span className="text-sm text-text-secondary font-normal">93.3%</span></div>
        </div>
        <div className="aviation-panel p-4 border-t-4 border-t-review glow-review">
          <div className="text-sm text-text-secondary mb-1">REVIEW REQUIRED</div>
          <div className="text-3xl font-bold">64 <span className="text-sm text-text-secondary font-normal">5.0%</span></div>
        </div>
        <div className="aviation-panel p-4 border-t-4 border-t-highrisk glow-highrisk">
          <div className="text-sm text-text-secondary mb-1">HIGH RISK</div>
          <div className="text-3xl font-bold">22 <span className="text-sm text-text-secondary font-normal">1.7%</span></div>
        </div>
        <div className="aviation-panel p-4 border-t-4 border-t-accent-secondary">
          <div className="text-sm text-text-secondary mb-1">AVG SCREENING TIME</div>
          <div className="text-3xl font-bold">8.7s</div>
        </div>
      </div>
      
      <div className="flex gap-6 mb-8">
        <div className="w-3/5 aviation-panel p-6 min-h-[400px] relative">
          <h3 className="text-lg font-semibold mb-4 text-text-secondary">SECURITY OPERATIONS MAP - T2</h3>
          <div className="w-full h-full border border-border-primary bg-bg-secondary rounded flex items-center justify-center overflow-hidden relative">
            <div className="scan-animation absolute inset-0"></div>
            <div className="text-text-muted">Map Visualization Active</div>
            {/* Dots */}
            <div className="absolute top-1/4 left-1/4 status-dot online"></div>
            <div className="absolute top-1/3 left-1/2 status-dot online"></div>
            <div className="absolute top-1/2 left-2/3 status-dot warning"></div>
            <div className="absolute bottom-1/3 left-1/3 status-dot offline"></div>
          </div>
        </div>
        <div className="w-2/5 aviation-panel p-6">
          <h3 className="text-lg font-semibold mb-4 text-text-secondary">LIVE SCREENING FEED</h3>
          <div className="space-y-3 h-[340px] overflow-y-auto pr-2">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="flex justify-between items-center p-3 bg-bg-secondary border border-border-primary rounded">
                <div>
                  <div className="font-mono text-sm">AV-IND-{(1000+i).toString()}</div>
                  <div className="text-xs text-text-secondary">Gate G1{i} • T2</div>
                </div>
                {i % 3 === 0 ? 
                  <span className="px-2 py-1 bg-review/20 text-review text-xs rounded border border-review">REVIEW</span> :
                  i % 5 === 0 ?
                  <span className="px-2 py-1 bg-highrisk/20 text-highrisk text-xs rounded border border-highrisk">HIGH RISK</span> :
                  <span className="px-2 py-1 bg-verified/20 text-verified text-xs rounded border border-verified">VERIFIED</span>
                }
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-6 mt-8">
        <button 
          onClick={() => navigate('/verify')}
          className="px-8 py-4 bg-accent-primary text-white font-bold rounded shadow-[0_0_15px_rgba(35,82,160,0.5)] hover:bg-accent-secondary transition-colors flex items-center text-lg"
        >
          <span className="mr-3">✈</span> START PASSENGER SCREENING
        </button>
        <button className="px-8 py-4 bg-bg-card border border-border-primary text-text-secondary font-bold rounded hover:bg-bg-card-hover transition-colors flex items-center text-lg">
          <span className="mr-3">🎮</span> DEMO MODE
        </button>
      </div>
    </div>
  );
}
