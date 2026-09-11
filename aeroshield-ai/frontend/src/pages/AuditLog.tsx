import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AUDIT_ACTIONS = [
  { id: 1, time: '22:08:01', action: 'OFFICER_LOGIN', officer: 'IMM001', passenger: null, result: 'SUCCESS', details: 'Officer logged in from Terminal T2', icon: '🔐' },
  { id: 2, time: '22:08:15', action: 'SESSION_STARTED', officer: 'IMM001', passenger: 'AV-IND-000123', result: 'SUCCESS', details: 'Verification session VER-2026-T2-000128 started', icon: '▶' },
  { id: 3, time: '22:08:17', action: 'PASSENGER_SEARCH', officer: 'IMM001', passenger: 'AV-IND-000123', result: 'FOUND', details: 'Passenger record located in database', icon: '🔍' },
  { id: 4, time: '22:08:22', action: 'DOCUMENT_UPLOAD', officer: 'IMM001', passenger: 'AV-IND-000123', result: 'SUCCESS', details: 'Passport document uploaded (size: 2.1MB)', icon: '📄' },
  { id: 5, time: '22:08:24', action: 'OCR_PERFORMED', officer: 'IMM001', passenger: 'AV-IND-000123', result: 'SUCCESS', details: 'OCR confidence: 97.4% • MRZ detected: YES', icon: '🔬' },
  { id: 6, time: '22:08:25', action: 'DOCUMENT_VALIDATION', officer: 'IMM001', passenger: 'AV-IND-000123', result: 'VALID', details: 'All 6 validation checks passed', icon: '✓' },
  { id: 7, time: '22:08:27', action: 'FORENSIC_ANALYSIS', officer: 'IMM001', passenger: 'AV-IND-000123', result: 'CLEAR', details: 'No tampering indicators detected • Risk: LOW', icon: '🔭' },
  { id: 8, time: '22:08:30', action: 'FACE_VERIFICATION', officer: 'IMM001', passenger: 'AV-IND-000123', result: 'MATCH', details: 'Similarity: 96.7% • Liveness: PASS • PAD: PASS', icon: '👤' },
  { id: 9, time: '22:08:32', action: 'FINGERPRINT_VERIFICATION', officer: 'IMM001', passenger: 'AV-IND-000123', result: 'MATCH', details: 'Similarity: 98.8% • Quality: GOOD • PAD: PASS', icon: '👆' },
  { id: 10, time: '22:08:34', action: 'IRIS_VERIFICATION', officer: 'IMM001', passenger: 'AV-IND-000123', result: 'MATCH', details: 'Similarity: 99.1% • Quality: GOOD • PAD: PASS', icon: '👁' },
  { id: 11, time: '22:08:35', action: 'RISK_CALCULATED', officer: 'IMM001', passenger: 'AV-IND-000123', result: 'LOW_RISK', details: 'Risk score: 8/100 • Status: VERIFIED • Red flags: 0', icon: '⚖' },
  { id: 12, time: '22:08:38', action: 'FINAL_DECISION', officer: 'IMM001', passenger: 'AV-IND-000123', result: 'VERIFIED', details: 'Passenger approved by Officer IMM001 • VER-2026-T2-000128', icon: '✅' },
  { id: 13, time: '21:43:11', action: 'SESSION_STARTED', officer: 'IMM001', passenger: 'AV-GBR-000458', result: 'SUCCESS', details: 'Verification session VER-2026-T2-000127 started', icon: '▶' },
  { id: 14, time: '21:43:18', action: 'FORENSIC_ANALYSIS', officer: 'IMM001', passenger: 'AV-GBR-000458', result: 'ANOMALY', details: 'Potential alteration in passport number region (confidence: 82%)', icon: '⚠' },
  { id: 15, time: '21:43:22', action: 'RISK_CALCULATED', officer: 'IMM001', passenger: 'AV-GBR-000458', result: 'REVIEW_REQUIRED', details: 'Risk score: 52/100 • Red flags: 2', icon: '⚖' },
  { id: 16, time: '21:43:25', action: 'REVIEW_ASSIGNED', officer: 'IMM001', passenger: 'AV-GBR-000458', result: 'ASSIGNED', details: 'Case CASE-2026-T2-000045 created for manual review', icon: '📋' },
];

const RESULT_COLORS: Record<string, string> = {
  SUCCESS: 'text-verified', FOUND: 'text-verified', VALID: 'text-verified', CLEAR: 'text-verified',
  MATCH: 'text-verified', LOW_RISK: 'text-verified', VERIFIED: 'text-verified', APPROVED: 'text-verified',
  REVIEW_REQUIRED: 'text-review', ANOMALY: 'text-review', ASSIGNED: 'text-review',
  FAIL: 'text-highrisk', MISMATCH: 'text-highrisk', HIGH_RISK: 'text-highrisk', REJECTED: 'text-highrisk',
};

export default function AuditLog() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  const filtered = AUDIT_ACTIONS.filter(a => {
    const matchSearch = !search || a.officer.includes(search.toUpperCase()) || (a.passenger || '').includes(search.toUpperCase()) || a.details.toLowerCase().includes(search.toLowerCase());
    const matchAction = filterAction === 'ALL' || a.action === filterAction;
    return matchSearch && matchAction;
  });

  const actionTypes = ['ALL', ...Array.from(new Set(AUDIT_ACTIONS.map(a => a.action)))];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <header className="border-b border-border-primary p-4 flex justify-between items-center bg-bg-secondary">
        <div>
          <div className="text-xl font-bold">✈ AEROSHIELD AI — SECURITY AUDIT LOG</div>
          <div className="text-xs text-text-muted mt-1">Immutable Action Trail • Terminal T2 • {AUDIT_ACTIONS.length} entries</div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-accent-primary text-white rounded text-sm font-bold">Export CSV</button>
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 border border-border-primary rounded hover:bg-bg-card text-sm">← Dashboard</button>
        </div>
      </header>

      <div className="p-6">
        {/* Filters */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by officer, passenger, or details..."
            className="flex-1 bg-bg-card border border-border-primary rounded px-4 py-2 text-sm text-white placeholder-text-muted focus:outline-none focus:border-accent-primary"
          />
          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            className="bg-bg-card border border-border-primary rounded px-4 py-2 text-sm text-white focus:outline-none"
          >
            {actionTypes.map(a => <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border-primary"></div>
          <div className="space-y-4">
            {filtered.map((entry) => (
              <div key={entry.id} className="flex gap-4 relative animate-fade-in">
                <div className="w-16 flex-shrink-0 flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-bg-card border-2 border-border-accent flex items-center justify-center text-lg z-10">
                    {entry.icon}
                  </div>
                </div>
                <div className="flex-1 aviation-panel p-4 mb-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm">{entry.action.replace(/_/g, ' ')}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${RESULT_COLORS[entry.result] || 'text-text-muted'}`}>
                        {entry.result}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-text-muted">{entry.time}</span>
                  </div>
                  <div className="text-sm text-text-secondary">{entry.details}</div>
                  <div className="flex gap-4 mt-2 text-xs text-text-muted">
                    <span>Officer: <span className="text-accent-secondary font-mono">{entry.officer}</span></span>
                    {entry.passenger && <span>Passenger: <span className="text-accent-secondary font-mono">{entry.passenger}</span></span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-text-muted py-12">No audit entries match your search.</div>
        )}
      </div>
    </div>
  );
}
