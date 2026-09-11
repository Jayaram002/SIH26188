import os

frontend_dir = r"d:\temp C\all filess\ram\SIHH\aeroshield-ai\frontend"

def write_file(path, content):
    full_path = os.path.join(frontend_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

write_file("Dockerfile", """
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
""")

write_file("nginx.conf", """
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
""")

write_file("src/pages/Login.tsx", """
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
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setOfficerId('ADMIN'); setPassword('demo'); }} className="p-2 border border-border-primary rounded bg-bg-card hover:bg-bg-card-hover text-sm">Admin</button>
              <button onClick={() => { setOfficerId('IMM001'); setPassword('demo'); }} className="p-2 border border-border-primary rounded bg-bg-card hover:bg-bg-card-hover text-sm">Immigration</button>
              <button onClick={() => { setOfficerId('SEC002'); setPassword('demo'); }} className="p-2 border border-border-primary rounded bg-bg-card hover:bg-bg-card-hover text-sm">Security</button>
              <button onClick={() => { setOfficerId('AUDIT99'); setPassword('demo'); }} className="p-2 border border-border-primary rounded bg-bg-card hover:bg-bg-card-hover text-sm">Auditor</button>
            </div>
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
""")

write_file("src/pages/Dashboard.tsx", """
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
    <div className="min-h-screen bg-bg-primary text-text-primary p-6">
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
""")

write_file("src/pages/Verification.tsx", """
import React, { useState } from 'react';
import { DEMO_SCENARIOS } from '../services/demoData';
import { useNavigate } from 'react-router-dom';

const steps = [
  'IDENTIFY', 'DOCUMENT', 'FORENSICS', 'FACE', 'FINGERPRINT', 'IRIS', 'RISK', 'DECISION'
];

export default function Verification() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scenario, setScenario] = useState(DEMO_SCENARIOS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep(prev => prev + 1);
      }, 1000);
    }
  };

  const handleFullAuto = () => {
    let step = 0;
    const interval = setInterval(() => {
      if (step >= steps.length - 1) {
        clearInterval(interval);
      } else {
        setCurrentStep(++step);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-bg-primary text-text-primary">
      {/* Header / Steps */}
      <div className="p-6 border-b border-border-primary bg-bg-secondary flex justify-between items-center">
        <div className="flex space-x-2 w-full justify-between max-w-5xl">
          {steps.map((step, idx) => (
            <div key={step} className="flex items-center text-sm font-semibold">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 
                ${idx < currentStep ? 'bg-verified text-white' : idx === currentStep ? 'bg-accent-primary text-white glow-blue' : 'bg-bg-card text-text-muted border border-border-primary'}`}>
                {idx < currentStep ? '✓' : idx + 1}
              </div>
              <span className={idx <= currentStep ? 'text-white' : 'text-text-muted'}>{step}</span>
              {idx < steps.length - 1 && <span className="mx-4 text-text-muted">→</span>}
            </div>
          ))}
        </div>
        <div>
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 border border-border-primary rounded hover:bg-bg-card-hover text-sm">EXIT</button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Passenger Summary */}
        <div className="w-1/3 border-r border-border-primary bg-bg-card p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4 text-accent-secondary border-b border-border-primary pb-2">PASSENGER SUMMARY</h3>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-xs text-text-muted">FULL NAME</span>
                <span className="font-bold text-lg">{scenario.passenger.full_name}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-text-muted">PASSENGER ID</span>
                  <span className="font-mono">{scenario.passenger.passenger_id}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-text-muted">NATIONALITY</span>
                  <span>{scenario.passenger.nationality_full}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-text-muted">DOB</span>
                  <span>{scenario.passenger.date_of_birth}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-text-muted">FLIGHT / GATE</span>
                  <span>{scenario.passenger.flight} • {scenario.passenger.gate}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h4 className="text-sm font-bold text-text-secondary mb-3">DEMO SCENARIO SELECTOR</h4>
            <div className="space-y-2">
              {DEMO_SCENARIOS.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => { setScenario(s); setCurrentStep(0); }}
                  className={`p-3 border rounded cursor-pointer text-sm ${s.id === scenario.id ? 'border-accent-primary bg-accent-primary/10' : 'border-border-primary bg-bg-secondary hover:border-text-secondary'}`}
                >
                  <div className="font-bold">{s.name}</div>
                  <div className="text-xs text-text-muted truncate">{s.description}</div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleFullAuto}
              className="mt-6 w-full py-3 bg-panel-card border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white rounded transition-colors font-bold"
            >
              RUN FULL AUTO SCREENING
            </button>
          </div>
        </div>
        
        {/* Right Panel - Active Step */}
        <div className="w-2/3 p-8 bg-bg-primary overflow-y-auto flex flex-col justify-between">
          <div className="flex-1">
            {isProcessing ? (
              <div className="h-full flex items-center justify-center flex-col">
                <div className="w-16 h-16 border-4 border-accent-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-xl font-mono text-accent-secondary">PROCESSING {steps[currentStep]}...</div>
              </div>
            ) : (
              <div className="h-full animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-border-primary pb-2">0{currentStep + 1} // {steps[currentStep]}</h2>
                
                {/* Step Content Placeholders based on currentStep */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="p-6 aviation-panel border-l-4 border-l-verified bg-verified/5">
                      <h3 className="text-verified font-bold mb-2 flex items-center"><span className="mr-2">✓</span> PASSENGER IDENTIFIED</h3>
                      <p>Passenger record found in database. Proceeding to document verification.</p>
                    </div>
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="aviation-panel p-4 flex items-center justify-center h-64 border-dashed relative">
                      <div className="scan-animation absolute inset-0"></div>
                      <span className="text-text-muted">Document Scan Viewer</span>
                    </div>
                    <div className="aviation-panel p-4">
                      <h3 className="font-bold mb-4 text-accent-secondary">OCR EXTRACTION</h3>
                      <ul className="space-y-2 font-mono text-sm">
                        <li className="flex justify-between border-b border-border-primary pb-1"><span>CONFIDENCE:</span> <span className="text-verified">{scenario.ocr.confidence}%</span></li>
                        <li className="flex justify-between border-b border-border-primary pb-1"><span>MRZ DETECTED:</span> <span>{scenario.ocr.mrz_detected ? 'YES' : 'NO'}</span></li>
                      </ul>
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="aviation-panel p-6 h-64 flex flex-col items-center justify-center relative">
                    <div className="text-xl font-bold mb-2">FORENSICS ANALYSIS: {scenario.forensics.overall_risk} RISK</div>
                    {scenario.forensics.tampering ? (
                      <div className="text-highrisk mt-4 p-4 bg-highrisk/10 border border-highrisk rounded">
                        Potential tampering detected in multiple regions.
                      </div>
                    ) : (
                      <div className="text-verified mt-4 p-4 bg-verified/10 border border-verified rounded">
                        Document integrity verified. No tampering detected.
                      </div>
                    )}
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div className="aviation-panel p-4">
                      <div className="h-48 bg-bg-secondary border border-border-primary rounded mb-4"></div>
                      <div className="font-bold">DOCUMENT PHOTO</div>
                    </div>
                    <div className="aviation-panel p-4 relative">
                      <div className="absolute top-2 right-2 px-2 py-1 bg-highrisk text-xs font-bold rounded z-10">DEMO SENSOR</div>
                      <div className="h-48 bg-bg-secondary border border-border-primary rounded mb-4 relative overflow-hidden">
                         <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-24 h-32 border-2 border-accent-secondary rounded-[40%] animate-pulse-slow"></div>
                         </div>
                      </div>
                      <div className="font-bold mb-2">LIVE CAPTURE</div>
                      <div className={`text-lg font-bold ${scenario.face.match === 'MATCH' ? 'text-verified' : 'text-highrisk'}`}>
                        {scenario.face.similarity}% SIMILARITY
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 4 && (
                  <div className="aviation-panel p-8 text-center flex flex-col items-center justify-center relative h-64">
                    <div className="absolute top-2 right-2 px-2 py-1 bg-highrisk text-xs font-bold rounded z-10">DEMO SENSOR</div>
                    <div className="text-4xl mb-4 opacity-50">👆</div>
                    <div className="font-bold text-xl mb-2 text-accent-secondary">FINGERPRINT SCAN</div>
                    <div className={`text-lg font-bold ${scenario.fingerprint.match === 'MATCH' ? 'text-verified' : scenario.fingerprint.match === 'MISMATCH' ? 'text-highrisk' : 'text-review'}`}>
                      {scenario.fingerprint.match} - {scenario.fingerprint.similarity}%
                    </div>
                  </div>
                )}
                {currentStep === 5 && (
                  <div className="aviation-panel p-8 text-center flex flex-col items-center justify-center relative h-64">
                    <div className="absolute top-2 right-2 px-2 py-1 bg-highrisk text-xs font-bold rounded z-10">DEMO SENSOR</div>
                    <div className="text-4xl mb-4 opacity-50">👁️</div>
                    <div className="font-bold text-xl mb-2 text-accent-secondary">IRIS SCAN</div>
                    <div className={`text-lg font-bold ${scenario.iris.match === 'MATCH' ? 'text-verified' : scenario.iris.match === 'MISMATCH' ? 'text-highrisk' : 'text-review'}`}>
                      {scenario.iris.match} - {scenario.iris.similarity}%
                    </div>
                  </div>
                )}
                {currentStep === 6 && (
                  <div className="aviation-panel p-6">
                    <h3 className="text-xl font-bold mb-6 text-center">AI RISK ASSESSMENT</h3>
                    <div className="flex justify-center mb-8">
                       <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center text-3xl font-bold shadow-lg
                        ${scenario.risk.status === 'VERIFIED' ? 'border-verified text-verified glow-verified' : 
                          scenario.risk.status === 'HIGH_RISK' ? 'border-highrisk text-highrisk glow-highrisk' : 'border-review text-review glow-review'}
                       `}>
                         {scenario.risk.score}
                       </div>
                    </div>
                    
                    {scenario.red_flags.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-bold text-highrisk mb-2">DETECTED ANOMALIES:</h4>
                        <ul className="space-y-2">
                          {scenario.red_flags.map((flag, i) => (
                            <li key={i} className="bg-highrisk/20 border border-highrisk p-2 text-sm rounded flex items-start">
                              <span className="mr-2 mt-1">⚠️</span>
                              <div>
                                <div className="font-bold text-highrisk">{flag.type}</div>
                                <div>{flag.description}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                {currentStep === 7 && (
                  <div className={`aviation-panel p-8 h-full flex flex-col items-center justify-center text-center
                    ${scenario.risk.status === 'VERIFIED' ? 'bg-verified/10 border-verified glow-verified' : 
                      scenario.risk.status === 'HIGH_RISK' ? 'bg-highrisk/10 border-highrisk glow-highrisk' : 'bg-review/10 border-review glow-review'}
                  `}>
                    <h2 className="text-4xl font-bold mb-4">FINAL DECISION</h2>
                    <div className={`text-5xl font-black mb-8 tracking-widest
                      ${scenario.risk.status === 'VERIFIED' ? 'text-verified' : 
                        scenario.risk.status === 'HIGH_RISK' ? 'text-highrisk' : 'text-review'}
                    `}>
                      {scenario.risk.status.replace('_', ' ')}
                    </div>
                    
                    <div className="text-left w-full max-w-md p-4 bg-bg-card rounded border border-border-primary mb-8">
                      <h4 className="font-bold text-accent-secondary border-b border-border-primary pb-2 mb-2">EXPLAINABLE AI SUMMARY</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {scenario.explanation.map((exp, i) => (
                          <li key={i}>{exp}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex gap-4">
                      {scenario.risk.status === 'VERIFIED' ? (
                        <button className="px-8 py-3 bg-verified text-white font-bold rounded hover:bg-verified-dark transition">APPROVE PASSENGER</button>
                      ) : (
                        <button className="px-8 py-3 bg-review text-black font-bold rounded hover:bg-review-dark transition">SEND TO REVIEW</button>
                      )}
                      <button onClick={() => setCurrentStep(0)} className="px-8 py-3 border border-border-primary font-bold rounded hover:bg-bg-card-hover transition">NEW SCREENING</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-8 pt-4 border-t border-border-primary flex justify-end">
            {currentStep < steps.length - 1 && (
              <button 
                onClick={handleNext}
                disabled={isProcessing}
                className="px-6 py-2 bg-accent-primary text-white font-semibold rounded hover:bg-accent-secondary disabled:opacity-50"
              >
                NEXT STEP →
              </button>
            )}
          </div>
        </div>
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
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
""")
