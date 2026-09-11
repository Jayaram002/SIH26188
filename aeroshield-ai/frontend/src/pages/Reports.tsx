import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMO_SCENARIOS } from '@/services/demoData';

export default function Reports() {
  const navigate = useNavigate();
  const [scenarioId, setScenarioId] = useState(1);
  const scenario = DEMO_SCENARIOS.find(s => s.id === scenarioId) || DEMO_SCENARIOS[0];
  const now = new Date().toLocaleString();
  const verificationId = `VER-2026-T2-00012${scenario.id}`;

  const STATUS_STYLE: Record<string, string> = {
    VERIFIED: 'text-verified',
    REVIEW_REQUIRED: 'text-review',
    HIGH_RISK: 'text-highrisk',
    LOW_RISK: 'text-verified',
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pb-20">
      <header className="border-b border-border-primary p-4 flex justify-between items-center bg-bg-secondary print:hidden">
        <div className="text-xl font-bold">✈ AEROSHIELD AI — VERIFICATION REPORT</div>
        <div className="flex gap-3">
          <select 
            value={scenarioId} 
            onChange={e => setScenarioId(Number(e.target.value))}
            className="bg-bg-card border border-border-primary rounded px-4 py-2 text-sm text-white"
          >
            {DEMO_SCENARIOS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button onClick={() => window.print()} className="px-6 py-2 bg-accent-primary text-white rounded font-bold hover:bg-accent-secondary">🖨 PRINT REPORT</button>
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 border border-border-primary rounded hover:bg-bg-card text-sm">← Dashboard</button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-8 print:p-0 print:text-black print:bg-white bg-bg-primary">
        {/* Report Header */}
        <div className="text-center mb-10 border-b-2 border-accent-primary pb-8 print:border-gray-800">
          <div className="text-4xl font-black mb-2 print:text-black text-white">✈ AEROSHIELD AI</div>
          <div className="text-xl font-semibold text-text-secondary print:text-gray-600 mb-1">AIRPORT IDENTITY SCREENING REPORT</div>
          <div className="text-sm text-text-muted print:text-gray-500">TERMINAL 2 • INTERNATIONAL SECURITY OPERATIONS</div>
          <div className="mt-4 flex justify-center gap-8 text-sm print:text-black">
            <div><span className="text-text-muted print:text-gray-600">Verification ID:</span> <span className="font-mono font-bold text-accent-secondary print:text-blue-700">{verificationId}</span></div>
            <div><span className="text-text-muted print:text-gray-600">Date/Time:</span> <span className="font-mono">{now}</span></div>
            <div><span className="text-text-muted print:text-gray-600">Officer:</span> <span className="font-mono">IMM001</span></div>
          </div>
        </div>

        {/* Final Decision */}
        <div className={`aviation-panel p-8 mb-8 text-center border-2 print:bg-gray-100 ${
          scenario.risk.status === 'VERIFIED' ? 'border-verified print:border-green-600' :
          scenario.risk.status === 'HIGH_RISK' ? 'border-highrisk print:border-red-600' : 'border-review print:border-yellow-600'
        }`}>
          <div className="text-sm font-bold text-text-muted tracking-widest mb-2 print:text-gray-600">FINAL SCREENING DECISION</div>
          <div className={`text-4xl font-black mb-2 ${STATUS_STYLE[scenario.risk.status] || ''} print:text-black`}>
            {scenario.risk.status.replace(/_/g, ' ')}
          </div>
          <div className="text-lg text-text-secondary print:text-gray-800">Risk Score: <span className="font-bold text-white print:text-black">{scenario.risk.score}/100</span></div>
        </div>

        {/* Summary Explanation */}
        <div className="mb-8">
          <h3 className="text-lg font-bold border-b border-border-primary pb-2 mb-4 print:border-gray-300 print:text-black">EXECUTIVE SUMMARY</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-text-secondary print:text-gray-800">
            {scenario.explanation.map((exp, i) => <li key={i}>{exp}</li>)}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Passenger Details */}
          <div>
            <h3 className="text-lg font-bold border-b border-border-primary pb-2 mb-4 print:border-gray-300 print:text-black">PASSENGER IDENTITY</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border-primary/30 pb-1 print:border-gray-200"><span className="text-text-muted print:text-gray-600">ID Number</span><span className="font-mono text-accent-secondary print:text-blue-700">{scenario.passenger.passenger_id}</span></div>
              <div className="flex justify-between border-b border-border-primary/30 pb-1 print:border-gray-200"><span className="text-text-muted print:text-gray-600">Full Name</span><span className="font-bold print:text-black">{scenario.passenger.full_name}</span></div>
              <div className="flex justify-between border-b border-border-primary/30 pb-1 print:border-gray-200"><span className="text-text-muted print:text-gray-600">Nationality</span><span className="print:text-black">{scenario.passenger.nationality_full} ({scenario.passenger.nationality})</span></div>
              <div className="flex justify-between border-b border-border-primary/30 pb-1 print:border-gray-200"><span className="text-text-muted print:text-gray-600">DOB</span><span className="font-mono print:text-black">{scenario.passenger.date_of_birth}</span></div>
              <div className="flex justify-between border-b border-border-primary/30 pb-1 print:border-gray-200"><span className="text-text-muted print:text-gray-600">Gender</span><span className="print:text-black">{scenario.passenger.gender}</span></div>
              <div className="flex justify-between border-b border-border-primary/30 pb-1 print:border-gray-200"><span className="text-text-muted print:text-gray-600">Passport</span><span className="font-mono print:text-black">{scenario.passenger.passport_number_masked}</span></div>
              <div className="flex justify-between border-b border-border-primary/30 pb-1 print:border-gray-200"><span className="text-text-muted print:text-gray-600">Expiry</span><span className="font-mono print:text-black">{scenario.passenger.passport_expiry}</span></div>
              <div className="flex justify-between border-b border-border-primary/30 pb-1 print:border-gray-200"><span className="text-text-muted print:text-gray-600">Flight/Gate</span><span className="font-mono print:text-black">{scenario.passenger.flight} / {scenario.passenger.gate}</span></div>
            </div>
          </div>

          {/* Biometrics */}
          <div>
            <h3 className="text-lg font-bold border-b border-border-primary pb-2 mb-4 print:border-gray-300 print:text-black">BIOMETRIC VERIFICATION</h3>
            <div className="space-y-4">
              <div className="bg-bg-secondary p-3 rounded border border-border-primary print:border-gray-300 print:bg-white print:text-black">
                <div className="flex justify-between font-bold text-sm mb-1">
                  <span>Face Recognition</span>
                  <span className={scenario.face.match === 'MATCH' ? 'text-verified print:text-green-600' : 'text-highrisk print:text-red-600'}>{scenario.face.match}</span>
                </div>
                <div className="text-xs text-text-muted print:text-gray-600 flex justify-between">
                  <span>Similarity: {scenario.face.similarity}%</span>
                  <span>Liveness: {scenario.face.liveness}</span>
                </div>
              </div>
              
              <div className="bg-bg-secondary p-3 rounded border border-border-primary print:border-gray-300 print:bg-white print:text-black">
                <div className="flex justify-between font-bold text-sm mb-1">
                  <span>Fingerprint</span>
                  <span className={scenario.fingerprint.match === 'MATCH' ? 'text-verified print:text-green-600' : scenario.fingerprint.match === 'UNCERTAIN' ? 'text-review print:text-yellow-600' : 'text-highrisk print:text-red-600'}>{scenario.fingerprint.match}</span>
                </div>
                <div className="text-xs text-text-muted print:text-gray-600 flex justify-between">
                  <span>Similarity: {scenario.fingerprint.similarity}%</span>
                  <span>Quality: {scenario.fingerprint.quality}</span>
                </div>
              </div>

              <div className="bg-bg-secondary p-3 rounded border border-border-primary print:border-gray-300 print:bg-white print:text-black">
                <div className="flex justify-between font-bold text-sm mb-1">
                  <span>Iris Scan</span>
                  <span className={scenario.iris.match === 'MATCH' ? 'text-verified print:text-green-600' : 'text-highrisk print:text-red-600'}>{scenario.iris.match}</span>
                </div>
                <div className="text-xs text-text-muted print:text-gray-600 flex justify-between">
                  <span>Similarity: {scenario.iris.similarity}%</span>
                  <span>Quality: {scenario.iris.quality}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* OCR & Forensics */}
        <div className="mb-8">
          <h3 className="text-lg font-bold border-b border-border-primary pb-2 mb-4 print:border-gray-300 print:text-black">DOCUMENT FORENSICS & OCR</h3>
          <div className="grid grid-cols-2 gap-4 text-sm print:text-black">
            <div className="bg-bg-secondary p-4 rounded print:bg-white print:border print:border-gray-300">
              <div className="font-bold mb-2">OCR Extraction</div>
              <div className="flex justify-between mb-1"><span className="text-text-muted print:text-gray-600">Confidence</span><span>{scenario.ocr.confidence}%</span></div>
              <div className="flex justify-between"><span className="text-text-muted print:text-gray-600">MRZ Detected</span><span>{scenario.ocr.mrz_detected ? 'YES' : 'NO'}</span></div>
            </div>
            <div className="bg-bg-secondary p-4 rounded print:bg-white print:border print:border-gray-300">
              <div className="font-bold mb-2">Forensic Analysis</div>
              <div className="flex justify-between mb-1"><span className="text-text-muted print:text-gray-600">Tampering</span><span className={scenario.forensics.tampering ? 'text-highrisk print:text-red-600 font-bold' : 'text-verified print:text-green-600'}>{scenario.forensics.tampering ? 'DETECTED' : 'CLEAR'}</span></div>
              <div className="flex justify-between"><span className="text-text-muted print:text-gray-600">Risk Level</span><span className={STATUS_STYLE[scenario.forensics.overall_risk] || ''}>{scenario.forensics.overall_risk}</span></div>
            </div>
          </div>
          {scenario.forensics.suspicious_regions && (
             <div className="mt-4 p-4 border border-review bg-review/10 rounded print:border-yellow-600 print:bg-yellow-50 print:text-black">
               <div className="font-bold text-review mb-2 print:text-yellow-800">Suspicious Regions Detected:</div>
               <ul className="list-disc pl-5 text-sm">
                 {scenario.forensics.suspicious_regions.map((reg: any, i: number) => (
                   <li key={i}>{reg.region} ({reg.confidence * 100}% confidence) - {reg.description}</li>
                 ))}
               </ul>
             </div>
          )}
        </div>

        {/* Red Flags */}
        {scenario.red_flags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold border-b border-border-primary pb-2 mb-4 print:border-gray-300 print:text-black">SECURITY FLAGS</h3>
            <div className="space-y-2 print:text-black">
              {scenario.red_flags.map((flag: any, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-highrisk/10 border border-highrisk/30 rounded print:border-red-300 print:bg-red-50">
                  <div className="text-highrisk print:text-red-600 font-bold mt-0.5">⚠</div>
                  <div>
                    <div className="font-bold text-highrisk print:text-red-800">{flag.type.replace(/_/g, ' ')}</div>
                    <div className="text-sm print:text-gray-800">{flag.description}</div>
                  </div>
                  <div className="ml-auto text-xs font-bold px-2 py-1 bg-highrisk text-white rounded print:bg-red-600">{flag.severity}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center text-xs text-text-muted mt-12 pt-4 border-t border-border-primary print:border-gray-300 print:text-gray-500">
          AeroShield AI Security Operations Platform • Confidential Report • Authorized Personnel Only
        </div>
      </div>
    </div>
  );
}
