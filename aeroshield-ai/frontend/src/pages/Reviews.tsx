import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_CASES = [
  { id: 'CASE-2026-T2-000045', passenger: 'JAMES ALEXANDER MORRISON', passengerId: 'AV-GBR-000458', risk: 52, reason: 'Document Tampering', flags: ['POSSIBLE_TAMPERING', 'OCR_LOW_CONFIDENCE'], time: '21:43:11', officer: 'IMM001', status: 'PENDING', flight: 'BA 112', gate: 'G04' },
  { id: 'CASE-2026-T2-000046', passenger: 'MICHAEL DAVID CHEN', passengerId: 'AV-USA-000891', risk: 68, reason: 'Biometric Conflict', flags: ['FACE_MISMATCH', 'BIOMETRIC_CONFLICT'], time: '21:38:22', officer: 'IMM001', status: 'IN_REVIEW', flight: 'UA 505', gate: 'G22' },
  { id: 'CASE-2026-T2-000047', passenger: 'UNKNOWN SUBJECT', passengerId: 'AV-UNKNOWN-999', risk: 91, reason: 'Multiple Conflicts', flags: ['POSSIBLE_TAMPERING', 'FACE_MISMATCH', 'IRIS_MISMATCH', 'BIOMETRIC_CONFLICT', 'DOCUMENT_EXPIRED'], time: '21:22:55', officer: 'SEC001', status: 'ESCALATED', flight: 'UNKNOWN', gate: '???' },
  { id: 'CASE-2026-T2-000044', passenger: 'LI XIAO MING', passengerId: 'AV-CHN-001204', risk: 45, reason: 'Visa Expired', flags: ['VISA_EXPIRED'], time: '21:10:33', officer: 'IMM001', status: 'APPROVED', flight: 'CA 836', gate: 'G31' },
  { id: 'CASE-2026-T2-000043', passenger: 'AISHA IBRAHIM HASSAN', passengerId: 'AV-UAE-000312', risk: 38, reason: 'OCR Mismatch', flags: ['OCR_LOW_CONFIDENCE', 'NAME_MISMATCH'], time: '20:55:14', officer: 'IMM001', status: 'PENDING', flight: 'EK 511', gate: 'G08' },
  { id: 'CASE-2026-T2-000042', passenger: 'CARLOS MENDEZ GARCIA', passengerId: 'AV-MEX-000567', risk: 31, reason: 'Document Anomaly', flags: ['METADATA_ANOMALY'], time: '20:42:07', officer: 'SEC001', status: 'APPROVED', flight: 'AM 112', gate: 'G15' },
];

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-review/20 text-review border-review',
  IN_REVIEW: 'bg-info/20 text-info border-info',
  ESCALATED: 'bg-highrisk/20 text-highrisk border-highrisk',
  APPROVED: 'bg-verified/20 text-verified border-verified',
  REJECTED: 'bg-highrisk/20 text-highrisk border-highrisk',
};

const RISK_COLOR = (r: number) => r >= 70 ? 'text-highrisk' : r >= 30 ? 'text-review' : 'text-verified';

export default function Reviews() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const [selected, setSelected] = useState<typeof MOCK_CASES[0] | null>(null);
  const [notes, setNotes] = useState('');
  const [justification, setJustification] = useState('');
  const [actionDone, setActionDone] = useState<string | null>(null);

  const FILTERS = ['ALL', 'PENDING', 'IN_REVIEW', 'ESCALATED', 'HIGH_RISK', 'BIOMETRIC_CONFLICT'];

  const filtered = MOCK_CASES.filter(c => {
    if (filter === 'ALL') return true;
    if (filter === 'HIGH_RISK') return c.risk >= 70;
    if (filter === 'BIOMETRIC_CONFLICT') return c.flags.includes('BIOMETRIC_CONFLICT');
    return c.status === filter;
  });

  const counts = {
    PENDING: MOCK_CASES.filter(c => c.status === 'PENDING').length,
    IN_REVIEW: MOCK_CASES.filter(c => c.status === 'IN_REVIEW').length,
    ESCALATED: MOCK_CASES.filter(c => c.status === 'ESCALATED').length,
  };

  const handleAction = (action: string) => {
    if ((action === 'REJECT' || action === 'ESCALATE') && !justification) {
      alert('Justification is required for this action.');
      return;
    }
    setActionDone(action);
    setTimeout(() => { setActionDone(null); setSelected(null); }, 2000);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <header className="border-b border-border-primary p-4 flex justify-between items-center bg-bg-secondary">
        <div>
          <div className="text-xl font-bold">✈ AEROSHIELD AI — SECURITY REVIEW QUEUE</div>
          <div className="text-xs text-text-muted mt-1">Manual Review Center • Terminal T2</div>
        </div>
        <button onClick={() => navigate('/dashboard')} className="px-4 py-2 border border-border-primary rounded hover:bg-bg-card text-sm">← Dashboard</button>
      </header>

      {/* Count Cards */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="aviation-panel p-4 border-l-4 border-l-review">
            <div className="text-2xl font-bold">{counts.PENDING}</div>
            <div className="text-sm text-text-muted">PENDING REVIEW</div>
          </div>
          <div className="aviation-panel p-4 border-l-4 border-l-info">
            <div className="text-2xl font-bold">{counts.IN_REVIEW}</div>
            <div className="text-sm text-text-muted">IN REVIEW</div>
          </div>
          <div className="aviation-panel p-4 border-l-4 border-l-highrisk">
            <div className="text-2xl font-bold">{counts.ESCALATED}</div>
            <div className="text-sm text-text-muted">ESCALATED</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded text-sm font-semibold border transition-colors ${
                filter === f
                  ? 'bg-accent-primary text-white border-accent-primary'
                  : 'border-border-primary text-text-secondary hover:bg-bg-card'
              }`}
            >{f.replace(/_/g, ' ')}</button>
          ))}
        </div>

        {/* Table */}
        <div className="aviation-panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-primary text-text-muted text-xs">
                {['CASE ID', 'PASSENGER', 'RISK', 'REASON', 'FLAGS', 'TIME', 'STATUS', 'ACTIONS'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`border-b border-border-primary hover:bg-bg-card-hover transition-colors cursor-pointer ${
                    i % 2 === 0 ? '' : 'bg-bg-secondary/20'
                  } ${selected?.id === c.id ? 'bg-accent-primary/10' : ''}`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-accent-secondary">{c.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-sm">{c.passenger}</div>
                    <div className="text-xs text-text-muted">{c.passengerId}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-mono font-bold text-lg ${RISK_COLOR(c.risk)}`}>{c.risk}</span>
                    <span className="text-text-muted text-xs">/100</span>
                  </td>
                  <td className="px-4 py-3 text-sm">{c.reason}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.flags.slice(0, 2).map(f => (
                        <span key={f} className="px-1 py-0.5 bg-highrisk/10 text-highrisk border border-highrisk/30 rounded text-xs">{f.replace(/_/g,' ')}</span>
                      ))}
                      {c.flags.length > 2 && <span className="text-xs text-text-muted">+{c.flags.length-2}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-text-muted">{c.time}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 border rounded text-xs font-bold ${STATUS_STYLES[c.status] || ''}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={e => { e.stopPropagation(); setSelected(c); }} className="text-xs px-3 py-1 border border-accent-primary text-accent-secondary rounded hover:bg-accent-primary/10">REVIEW</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Case Detail Drawer */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={() => setSelected(null)}>
            <div className="w-[600px] bg-bg-secondary border-l border-border-primary h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between mb-6">
                  <h2 className="text-xl font-bold">CASE REVIEW</h2>
                  <button onClick={() => setSelected(null)} className="text-text-muted hover:text-white text-2xl">×</button>
                </div>

                {actionDone && (
                  <div className="mb-4 p-3 bg-verified/20 text-verified border border-verified rounded font-bold text-center">
                    ✓ Action: {actionDone} recorded successfully
                  </div>
                )}

                <div className="space-y-4">
                  <div className="aviation-panel p-4">
                    <div className="text-xs text-text-muted mb-1">CASE ID</div>
                    <div className="font-mono font-bold">{selected.id}</div>
                  </div>
                  <div className="aviation-panel p-4">
                    <div className="text-xs text-text-muted mb-1">PASSENGER</div>
                    <div className="font-bold">{selected.passenger}</div>
                    <div className="text-sm text-text-muted">{selected.passengerId} • Flight {selected.flight} • Gate {selected.gate}</div>
                  </div>
                  <div className="aviation-panel p-4">
                    <div className="text-xs text-text-muted mb-1">RISK SCORE</div>
                    <div className={`text-4xl font-black ${RISK_COLOR(selected.risk)}`}>{selected.risk}<span className="text-lg font-normal text-text-muted">/100</span></div>
                  </div>
                  <div className="aviation-panel p-4">
                    <div className="text-xs text-text-muted mb-3">DETECTED FLAGS</div>
                    <div className="space-y-2">
                      {selected.flags.map(f => (
                        <div key={f} className="flex items-center gap-2 p-2 bg-highrisk/10 border border-highrisk/30 rounded text-sm">
                          <span className="text-highrisk">⚠</span>
                          <span>{f.replace(/_/g, ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="aviation-panel p-4">
                    <div className="text-xs text-text-muted mb-2">OFFICER NOTES</div>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Add investigation notes..."
                      className="w-full bg-bg-card border border-border-primary rounded p-2 text-sm text-white resize-none h-20 focus:outline-none focus:border-accent-primary"
                    />
                  </div>
                  <div className="aviation-panel p-4">
                    <div className="text-xs text-text-muted mb-2">JUSTIFICATION (required for Reject/Escalate)</div>
                    <textarea
                      value={justification}
                      onChange={e => setJustification(e.target.value)}
                      placeholder="Provide justification for adverse decision..."
                      className="w-full bg-bg-card border border-border-primary rounded p-2 text-sm text-white resize-none h-20 focus:outline-none focus:border-accent-primary"
                    />
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <button onClick={() => handleAction('APPROVE')} className="flex-1 py-3 bg-verified text-black font-bold rounded hover:bg-verified-dark transition-colors">✓ APPROVE</button>
                    <button onClick={() => handleAction('ESCALATE')} className="flex-1 py-3 bg-review text-black font-bold rounded hover:bg-review-dark transition-colors">↑ ESCALATE</button>
                    <button onClick={() => handleAction('REJECT')} className="flex-1 py-3 bg-highrisk text-white font-bold rounded hover:bg-highrisk-dark transition-colors">✗ REJECT</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
