import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, X, CheckCircle, Bell, ExternalLink } from 'lucide-react';
import { getActiveRedFlags, RedFlagAlert } from '../../lib/supabase';

export default function RedFlagAlertBanner() {
  const [activeFlags, setActiveFlags] = useState<RedFlagAlert[]>([]);
  const [currentAlert, setCurrentAlert] = useState<RedFlagAlert | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  const loadFlags = async () => {
    const flags = await getActiveRedFlags();
    setActiveFlags(flags);
    const unresolved = flags.filter(f => f.status === 'ACTIVE');
    if (unresolved.length > 0) {
      setCurrentAlert(unresolved[0]);
    }
  };

  useEffect(() => {
    loadFlags();

    const handleNewAlert = (e: any) => {
      const newFlag = e.detail as RedFlagAlert;
      setCurrentAlert(newFlag);
      setIsDismissed(false);
      loadFlags();
    };

    window.addEventListener('aeroshield_red_flag_alert', handleNewAlert);
    const interval = setInterval(loadFlags, 10000);

    return () => {
      window.removeEventListener('aeroshield_red_flag_alert', handleNewAlert);
      clearInterval(interval);
    };
  }, []);

  if (!currentAlert || isDismissed) return null;

  return (
    <div className="bg-red-950/90 border-y border-red-500/80 px-4 py-3 text-white shadow-2xl relative z-50 backdrop-blur-md animate-pulse-slow">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-600 rounded-full animate-ping-slow">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-red-600 text-white text-xs font-extrabold px-2 py-0.5 rounded tracking-wider uppercase">
                🚨 RED FLAG BROADCAST — {currentAlert.severity}
              </span>
              <span className="text-xs text-red-200 font-mono">
                {currentAlert.terminal} // {currentAlert.checkpoint}
              </span>
            </div>
            <div className="text-sm font-bold text-red-100 mt-0.5 flex items-center gap-2">
              <span>Passenger: {currentAlert.passenger_name} ({currentAlert.passport_number})</span>
              <span className="text-red-300">•</span>
              <span className="text-red-200 italic">{currentAlert.description}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {
              window.location.href = `/reviews?flagId=${currentAlert.id}`;
            }}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded shadow transition-colors flex items-center gap-1"
          >
            <span>SECURITY ACTION QUEUE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setIsDismissed(true)}
            className="p-1 hover:bg-red-900/50 rounded text-red-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
