import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_PASSENGERS = [
  { id: 'AV-IND-000123', name: 'RAJESH KUMAR SHARMA', nationality: 'IND', dob: '1990-03-15', passport: '****K5821', expiry: '2031-03-14', flight: 'AX 204', gate: 'G18', risk: 'LOW', screenings: [{ date: '10 Sep 2026', terminal: 'T2', result: 'VERIFIED' }, { date: '05 Sep 2026', terminal: 'T1', result: 'VERIFIED' }] },
  { id: 'AV-GBR-000458', name: 'JAMES ALEXANDER MORRISON', nationality: 'GBR', dob: '1985-07-22', passport: '****M2341', expiry: '2029-07-21', flight: 'BA 112', gate: 'G04', risk: 'MEDIUM', screenings: [{ date: '10 Sep 2026', terminal: 'T2', result: 'REVIEW' }] },
  { id: 'AV-USA-000891', name: 'MICHAEL DAVID CHEN', nationality: 'USA', dob: '1992-11-08', passport: '****C7012', expiry: '2030-11-07', flight: 'UA 505', gate: 'G22', risk: 'HIGH', screenings: [{ date: '10 Sep 2026', terminal: 'T2', result: 'REVIEW' }, { date: '28 Aug 2026', terminal: 'T2', result: 'VERIFIED' }] },
  { id: 'AV-CHN-001204', name: 'LI XIAO MING', nationality: 'CHN', dob: '1988-05-30', passport: '****X3311', expiry: '2028-05-29', flight: 'CA 836', gate: 'G31', risk: 'MEDIUM', screenings: [{ date: '10 Sep 2026', terminal: 'T2', result: 'REVIEW' }] },
  { id: 'AV-UAE-000312', name: 'AISHA IBRAHIM HASSAN', nationality: 'UAE', dob: '1994-02-14', passport: '****H4421', expiry: '2032-02-13', flight: 'EK 511', gate: 'G08', risk: 'LOW', screenings: [{ date: '10 Sep 2026', terminal: 'T2', result: 'REVIEW' }, { date: '01 Sep 2026', terminal: 'T1', result: 'VERIFIED' }] },
  { id: 'AV-MEX-000567', name: 'CARLOS MENDEZ GARCIA', nationality: 'MEX', dob: '1987-09-03', passport: '****G7891', expiry: '2027-09-02', flight: 'AM 112', gate: 'G15', risk: 'LOW', screenings: [{ date: '10 Sep 2026', terminal: 'T2', result: 'VERIFIED' }] },
  { id: 'AV-JPN-000234', name: 'YUKI TANAKA', nationality: 'JPN', dob: '1995-06-20', passport: '****T3301', expiry: '2033-06-19', flight: 'NH 802', gate: 'G25', risk: 'LOW', screenings: [{ date: '10 Sep 2026', terminal: 'T2', result: 'VERIFIED' }, { date: '20 Aug 2026', terminal: 'T2', result: 'VERIFIED' }] },
  { id: 'AV-FRA-000678', name: 'PIERRE MARTIN DUBOIS', nationality: 'FRA', dob: '1983-11-12', passport: '****D5512', expiry: '2030-11-11', flight: 'AF 225', gate: 'G09', risk: 'LOW', screenings: [{ date: '10 Sep 2026', terminal: 'T2', result: 'VERIFIED' }] },
];

const RISK_STYLE: Record<string, string> = {
  LOW: 'text-verified bg-verified/10 border-verified/30',
  MEDIUM: 'text-review bg-review/10 border-review/30',
  HIGH: 'text-highrisk bg-highrisk/10 border-highrisk/30',
};

const RESULT_STYLE: Record<string, string> = {
  VERIFIED: 'text-verified', REVIEW: 'text-review', 'HIGH RISK': 'text-highrisk'
};

export default function Passengers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof MOCK_PASSENGERS[0] | null>(null);

  const filtered = MOCK_PASSENGERS.filter(p =>
    !search || p.name.includes(search.toUpperCase()) || p.id.includes(search.toUpperCase()) || p.nationality.includes(search.toUpperCase())
  );

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <header className="border-b border-border-primary p-4 flex justify-between items-center bg-bg-secondary">
        <div>
          <div className="text-xl font-bold">✈ AEROSHIELD AI — PASSENGER DATABASE</div>
          <div className="text-xs text-text-muted mt-1">Identity Records • Terminal T2 • DEMO DATABASE</div>
        </div>
        <button onClick={() => navigate('/dashboard')} className="px-4 py-2 border border-border-primary rounded hover:bg-bg-card text-sm">← Dashboard</button>
      </header>

      <div className="p-6 flex gap-6">
        {/* List */}
        <div className="flex-1">
          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, ID, or nationality..."
              className="w-full bg-bg-card border border-border-primary rounded px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-accent-primary text-sm"
            />
          </div>
          <div className="aviation-panel overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-primary text-text-muted text-xs">
                  {['PASSENGER ID', 'NAME', 'NATIONALITY', 'FLIGHT', 'RISK PROFILE', 'SCREENINGS', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`border-b border-border-primary hover:bg-bg-card-hover transition-colors cursor-pointer ${ i % 2 === 0 ? '' : 'bg-bg-secondary/20' } ${ selected?.id === p.id ? 'bg-accent-primary/10' : '' }`}
                    onClick={() => setSelected(p)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-accent-secondary">{p.id}</td>
                    <td className="px-4 py-3 font-semibold">{p.name}</td>
                    <td className="px-4 py-3 text-sm">{p.nationality}</td>
                    <td className="px-4 py-3 font-mono text-sm">{p.flight} • {p.gate}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 border rounded text-xs font-bold ${RISK_STYLE[p.risk] || ''}`}>{p.risk}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted">{p.screenings.length} records</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={e => { e.stopPropagation(); navigate('/verify'); }}
                        className="text-xs px-3 py-1 bg-accent-primary text-white rounded hover:bg-accent-secondary"
                      >SCREEN</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="w-80 aviation-panel p-5 flex-shrink-0 self-start animate-slide-up">
            <h3 className="font-bold text-accent-secondary mb-4 border-b border-border-primary pb-2">PASSENGER PROFILE</h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-text-muted">FULL NAME</div>
                <div className="font-bold">{selected.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><div className="text-xs text-text-muted">PASSENGER ID</div><div className="font-mono text-xs text-accent-secondary">{selected.id}</div></div>
                <div><div className="text-xs text-text-muted">NATIONALITY</div><div>{selected.nationality}</div></div>
                <div><div className="text-xs text-text-muted">DOB</div><div>{selected.dob}</div></div>
                <div><div className="text-xs text-text-muted">GENDER</div><div>M</div></div>
                <div><div className="text-xs text-text-muted">PASSPORT</div><div className="font-mono">{selected.passport}</div></div>
                <div><div className="text-xs text-text-muted">EXPIRY</div><div>{selected.expiry}</div></div>
                <div><div className="text-xs text-text-muted">FLIGHT</div><div className="font-mono">{selected.flight}</div></div>
                <div><div className="text-xs text-text-muted">GATE</div><div className="font-mono">{selected.gate}</div></div>
              </div>
              <div>
                <div className="text-xs text-text-muted">RISK PROFILE</div>
                <span className={`px-2 py-1 border rounded text-xs font-bold ${RISK_STYLE[selected.risk]}`}>{selected.risk}</span>
              </div>

              <div className="pt-3 border-t border-border-primary">
                <div className="text-xs text-text-muted mb-2">SCREENING HISTORY</div>
                <div className="space-y-2">
                  {selected.screenings.map((s, i) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-bg-secondary rounded text-sm">
                      <span className="text-text-muted">{s.date} • {s.terminal}</span>
                      <span className={`font-bold ${RESULT_STYLE[s.result] || ''}`}>{s.result}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate('/verify')}
                className="w-full py-3 bg-accent-primary text-white font-bold rounded hover:bg-accent-secondary transition-colors mt-2"
              >START SCREENING</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
