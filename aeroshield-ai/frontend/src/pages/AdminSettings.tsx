import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '@/store/authStore';

const SETTINGS = [
  { key: 'face_similarity_threshold', label: 'Face Similarity Threshold', value: 80, unit: '%', category: 'BIOMETRIC', min: 50, max: 99, warning: 'Lowering this threshold increases acceptance rate and may allow mismatches.' },
  { key: 'fingerprint_threshold', label: 'Fingerprint Match Threshold', value: 85, unit: '%', category: 'BIOMETRIC', min: 50, max: 99, warning: 'Lowering reduces security. Ensure secondary verification is enabled.' },
  { key: 'iris_threshold', label: 'Iris Match Threshold', value: 85, unit: '%', category: 'BIOMETRIC', min: 50, max: 99, warning: 'Iris matching is highly accurate; only lower under expert guidance.' },
  { key: 'ocr_confidence_threshold', label: 'OCR Confidence Threshold', value: 75, unit: '%', category: 'DOCUMENT', min: 50, max: 99, warning: 'Low OCR confidence may indicate document quality issues.' },
  { key: 'risk_review_threshold', label: 'Risk Score — Manual Review Trigger', value: 30, unit: '/100', category: 'RISK', min: 10, max: 70, warning: 'Setting too high may allow borderline cases to pass without review.' },
  { key: 'risk_high_threshold', label: 'Risk Score — High Risk Flag', value: 70, unit: '/100', category: 'RISK', min: 40, max: 95, warning: 'Setting too high reduces high-risk flagging sensitivity.' },
  { key: 'document_expiry_days_warning', label: 'Document Expiry Warning (days)', value: 30, unit: 'days', category: 'DOCUMENT', min: 7, max: 180, warning: null },
  { key: 'session_timeout_minutes', label: 'Officer Session Timeout', value: 480, unit: 'min', category: 'SESSION', min: 30, max: 720, warning: 'Longer sessions reduce security during unattended workstations.' },
];

const DEMO_OFFICERS = [
  { id: 'ADMIN001', name: 'Commander Sarah Mitchell', role: 'ADMIN', status: 'ACTIVE', terminal: 'T2', lastLogin: '2026-09-10 21:30' },
  { id: 'IMM001', name: 'Officer James Patel', role: 'IMMIGRATION_OFFICER', status: 'ACTIVE', terminal: 'T2', lastLogin: '2026-09-10 22:05' },
  { id: 'SEC001', name: 'Officer Priya Nair', role: 'SECURITY_OFFICER', status: 'ACTIVE', terminal: 'T2', lastLogin: '2026-09-10 20:15' },
  { id: 'AUD001', name: 'Auditor Rahul Verma', role: 'AUDITOR', status: 'ACTIVE', terminal: 'T2', lastLogin: '2026-09-10 18:00' },
];

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'text-highrisk border-highrisk',
  IMMIGRATION_OFFICER: 'text-verified border-verified',
  SECURITY_OFFICER: 'text-info border-info',
  AUDITOR: 'text-review border-review',
};

export default function AdminSettings() {
  const navigate = useNavigate();
  const user = getUser();
  const [activeTab, setActiveTab] = useState<'thresholds' | 'users' | 'system'>('thresholds');
  const [settings, setSettings] = useState(SETTINGS);
  const [showWarning, setShowWarning] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="aviation-panel p-12 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-highrisk mb-2">ACCESS DENIED</h1>
          <p className="text-text-secondary mb-6">Administrator privileges required.</p>
          <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-accent-primary text-white rounded">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (key: string, val: number) => {
    const s = SETTINGS.find(x => x.key === key);
    if (s?.warning) setShowWarning(key);
    setSettings(prev => prev.map(x => x.key === key ? { ...x, value: val } : x));
  };

  const TABS = [
    { id: 'thresholds', label: 'Security Thresholds' },
    { id: 'users', label: 'Officer Management' },
    { id: 'system', label: 'System Configuration' },
  ] as const;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Header */}
      <header className="border-b border-border-primary p-4 flex justify-between items-center bg-bg-secondary">
        <div>
          <div className="text-xl font-bold">✈ AEROSHIELD AI — SECURITY CONFIGURATION</div>
          <div className="text-xs text-text-muted mt-1">Administrator Panel • Terminal T2 • All changes are logged</div>
        </div>
        <div className="flex items-center gap-4">
          {saved && <div className="px-4 py-2 bg-verified/20 text-verified border border-verified rounded text-sm font-bold">✓ Settings Saved</div>}
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 border border-border-primary rounded hover:bg-bg-card text-sm">← Dashboard</button>
        </div>
      </header>

      <div className="p-6">
        {/* Warning Banner */}
        {showWarning && (
          <div className="mb-6 p-4 bg-review/10 border border-review rounded flex items-start gap-3">
            <span className="text-review text-xl">⚠</span>
            <div>
              <div className="font-bold text-review">SECURITY WARNING</div>
              <div className="text-sm text-text-secondary">{SETTINGS.find(x => x.key === showWarning)?.warning}</div>
              <button onClick={() => setShowWarning(null)} className="mt-2 text-xs text-review underline">Acknowledge</button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border-primary">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-accent-secondary border-b-2 border-accent-secondary'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >{tab.label}</button>
          ))}
        </div>

        {/* Thresholds Tab */}
        {activeTab === 'thresholds' && (
          <div>
            <div className="mb-4 p-3 bg-info/10 border border-info/30 rounded text-sm text-text-secondary">
              ℹ These thresholds determine when the system flags passengers for review. Changes take effect immediately and are audit-logged.
            </div>
            {(['BIOMETRIC', 'DOCUMENT', 'RISK', 'SESSION'] as const).map(cat => (
              <div key={cat} className="mb-8">
                <h3 className="text-xs font-bold text-text-muted tracking-widest mb-4 border-b border-border-primary pb-2">{cat} SETTINGS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {settings.filter(s => s.category === cat).map(setting => (
                    <div key={setting.key} className="aviation-panel p-5">
                      <div className="flex justify-between mb-3">
                        <div className="font-semibold text-sm">{setting.label}</div>
                        <div className="font-mono font-bold text-accent-secondary">{setting.value}{setting.unit}</div>
                      </div>
                      <input
                        type="range"
                        min={setting.min}
                        max={setting.max}
                        value={setting.value}
                        onChange={e => handleChange(setting.key, Number(e.target.value))}
                        className="w-full h-2 bg-border-primary rounded-full appearance-none cursor-pointer accent-accent-secondary"
                      />
                      <div className="flex justify-between text-xs text-text-muted mt-1">
                        <span>{setting.min}{setting.unit}</span>
                        <span>{setting.max}{setting.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <button onClick={handleSave} className="px-8 py-3 bg-accent-primary text-white font-bold rounded hover:bg-accent-secondary transition-colors">
                SAVE CONFIGURATION
              </button>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between mb-6">
              <h2 className="text-lg font-bold">OFFICER ACCOUNTS</h2>
              <button className="px-4 py-2 bg-accent-primary text-white rounded text-sm font-bold">+ Add Officer</button>
            </div>
            <div className="aviation-panel overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-primary text-text-muted text-xs">
                    {['OFFICER ID', 'NAME', 'ROLE', 'TERMINAL', 'STATUS', 'LAST LOGIN', 'ACTIONS'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEMO_OFFICERS.map((officer, i) => (
                    <tr key={officer.id} className={`border-b border-border-primary hover:bg-bg-card-hover transition-colors ${ i % 2 === 0 ? '' : 'bg-bg-secondary/30' }`}>
                      <td className="px-4 py-4 font-mono text-sm">{officer.id}</td>
                      <td className="px-4 py-4 font-semibold">{officer.name}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 border rounded text-xs font-bold ${ROLE_COLORS[officer.role] || ''}`}>
                          {officer.role.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-text-secondary">{officer.terminal}</td>
                      <td className="px-4 py-4"><span className="flex items-center gap-2"><span className="status-dot online"></span> {officer.status}</span></td>
                      <td className="px-4 py-4 font-mono text-xs text-text-muted">{officer.lastLogin}</td>
                      <td className="px-4 py-4">
                        <button className="text-xs px-3 py-1 border border-border-primary rounded hover:bg-bg-card mr-2">Edit</button>
                        <button className="text-xs px-3 py-1 border border-highrisk/50 text-highrisk rounded hover:bg-highrisk/10">Suspend</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="grid grid-cols-2 gap-6">
            {[
              { title: 'Demo Mode', desc: 'Simulate AI/biometric responses without real hardware', value: true, type: 'toggle' },
              { title: 'Audit Logging', desc: 'Log all officer actions to immutable audit trail', value: true, type: 'toggle' },
              { title: 'Rate Limiting', desc: 'Limit API requests to prevent brute force', value: true, type: 'toggle' },
              { title: 'Multi-Factor Auth', desc: 'Require MFA for all officer logins (production)', value: false, type: 'toggle' },
            ].map(setting => (
              <div key={setting.title} className="aviation-panel p-5 flex justify-between items-center">
                <div>
                  <div className="font-semibold">{setting.title}</div>
                  <div className="text-xs text-text-muted mt-1">{setting.desc}</div>
                </div>
                <button className={`w-12 h-6 rounded-full transition-colors relative ${ setting.value ? 'bg-verified' : 'bg-border-primary' }`}>
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${ setting.value ? 'translate-x-7' : 'translate-x-1' }`}></span>
                </button>
              </div>
            ))}
            <div className="aviation-panel p-5 col-span-2">
              <div className="text-sm text-text-muted mb-3">PRIVACY & COMPLIANCE NOTICE</div>
              <p className="text-xs text-text-secondary leading-relaxed">This prototype demonstrates multimodal identity screening. Production deployment requires compliance with applicable privacy, biometric data protection, aviation security, cybersecurity, and government regulations. All biometric integrations in this demo are simulated (DEMO MODE). No real biometric data is collected or stored.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
