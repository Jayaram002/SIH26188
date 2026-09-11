import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, ShieldAlert, CheckCircle, AlertTriangle, FileText, UserCheck, 
  Scan, ArrowRight, RefreshCw, Lock, Sparkles, Database, ShieldCheck, Play
} from 'lucide-react';
import { DEMO_SCENARIOS } from '../services/demoData';
import PassportScannerModal from '../components/verification/PassportScannerModal';
import LiveCameraFaceVerification from '../components/verification/LiveCameraFaceVerification';
import { broadcastRedFlag, verifyPassengerInSupabase } from '../lib/supabase';

const STEPS = [
  'IDENTIFY', 'DOCUMENT SCAN', 'FORENSICS', 'FACIAL BIOMETRICS', 'FINGERPRINT', 'IRIS', 'RISK ANALYSIS', 'DECISION'
];

export default function Verification() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scenario, setScenario] = useState(DEMO_SCENARIOS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedDocument, setScannedDocument] = useState<any>(null);
  const [liveFaceResult, setLiveFaceResult] = useState<any>(null);
  const [supabaseMatch, setSupabaseMatch] = useState<any>(null);
  const [redFlagTriggered, setRedFlagTriggered] = useState(false);
  const navigate = useNavigate();

  // Check Supabase passenger database
  useEffect(() => {
    async function checkSupabase() {
      const match = await verifyPassengerInSupabase(scenario.passenger.passport_number_masked || scenario.passenger.passenger_id);
      setSupabaseMatch(match);
    }
    checkSupabase();
  }, [scenario]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);

        // If step reaches Risk Analysis or Decision, check if Red Flag should be issued to authorities
        if ((nextStep === 6 || nextStep === 7) && (scenario.risk.status === 'HIGH_RISK' || scenario.red_flags.length > 0) && !redFlagTriggered) {
          triggerRedFlagBroadcast();
        }
      }, 800);
    }
  };

  const triggerRedFlagBroadcast = async () => {
    setRedFlagTriggered(true);
    const mainFlag = scenario.red_flags[0] || { type: 'HIGH_RISK_DETECTION', description: 'Screening flagged critical identity conflicts.' };
    await broadcastRedFlag({
      verification_id: 'VER-' + Date.now().toString().slice(-6),
      passenger_id: scenario.passenger.passenger_id,
      passenger_name: scenario.passenger.full_name,
      passport_number: scenario.passenger.passport_number_masked,
      flag_type: mainFlag.type,
      severity: scenario.risk.status === 'HIGH_RISK' ? 'CRITICAL' : 'HIGH',
      description: mainFlag.description,
      terminal: 'TERMINAL 2',
      checkpoint: 'IMMIGRATION GATE 04',
      officer_id: 'IMM001',
      status: 'ACTIVE'
    });
  };

  const handleFullAuto = () => {
    let step = 0;
    const interval = setInterval(() => {
      if (step >= STEPS.length - 1) {
        clearInterval(interval);
      } else {
        step++;
        setCurrentStep(step);
        if ((step === 6 || step === 7) && (scenario.risk.status === 'HIGH_RISK' || scenario.red_flags.length > 0) && !redFlagTriggered) {
          triggerRedFlagBroadcast();
        }
      }
    }, 1200);
  };

  return (
    <div className="flex flex-col h-screen bg-aviation-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Header / Progress Stepper */}
      <div className="p-4 border-b border-aviation-800 bg-aviation-900/90 flex justify-between items-center backdrop-blur-md">
        <div className="flex space-x-2 w-full justify-between max-w-6xl overflow-x-auto">
          {STEPS.map((step, idx) => (
            <div key={step} className="flex items-center text-xs font-bold font-mono">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-1.5 transition-all
                ${idx < currentStep ? 'bg-emerald-500 text-white' : idx === currentStep ? 'bg-aviation-300 text-slate-950 font-extrabold ring-4 ring-aviation-300/30' : 'bg-aviation-950 text-slate-500 border border-aviation-800'}`}>
                {idx < currentStep ? '✓' : idx + 1}
              </div>
              <span className={idx <= currentStep ? 'text-white' : 'text-slate-500'}>{step}</span>
              {idx < STEPS.length - 1 && <span className="mx-2 text-slate-700">›</span>}
            </div>
          ))}
        </div>
        <div>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="px-3 py-1.5 border border-aviation-700 hover:bg-aviation-800 rounded text-xs font-mono text-slate-300 transition-colors"
          >
            EXIT SESSION
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Passenger Summary & Supabase Verification Status */}
        <div className="w-80 border-r border-aviation-800 bg-aviation-900/60 p-5 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-mono font-bold text-aviation-300 tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-aviation-800 pb-2">
                <UserCheck className="w-4 h-4 text-aviation-300" />
                PASSENGER BIOGRAPHIC DOSSIER
              </h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-mono text-slate-400">PASSENGER NAME</span>
                  <div className="font-bold text-base text-white">{scenario.passenger.full_name}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">PASSENGER ID</span>
                    <div className="font-mono text-slate-200">{scenario.passenger.passenger_id}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">PASSPORT NO</span>
                    <div className="font-mono text-slate-200">{scannedDocument?.passportNumber || scenario.passenger.passport_number_masked}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">NATIONALITY</span>
                    <div className="text-slate-200">{scenario.passenger.nationality_full}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">FLIGHT / GATE</span>
                    <div className="text-slate-200">{scenario.passenger.flight} • {scenario.passenger.gate}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supabase Verification Status Card */}
            <div className="bg-aviation-950 border border-aviation-800 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono font-bold text-aviation-300 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-aviation-300" /> SUPABASE DATABASE
                </span>
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${supabaseMatch?.found ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                  {supabaseMatch?.found ? 'VERIFIED RECORD' : 'UNINDEXED'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {supabaseMatch?.found 
                  ? `Match confirmed in Supabase registry. Risk tier: ${supabaseMatch.passenger.risk_profile}`
                  : 'Sample passenger record matched locally.'}
              </p>
            </div>

            {/* Demo Scenario Selector */}
            <div>
              <h4 className="text-xs font-mono font-bold text-slate-400 mb-2">SIMULATION SCENARIOS</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {DEMO_SCENARIOS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { 
                      setScenario(s); 
                      setCurrentStep(0); 
                      setRedFlagTriggered(false);
                    }}
                    className={`w-full text-left p-2.5 rounded border text-xs transition-all ${
                      s.id === scenario.id 
                        ? 'border-aviation-400 bg-aviation-800 text-white font-bold' 
                        : 'border-aviation-800 bg-aviation-950/70 text-slate-400 hover:border-aviation-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{s.name}</span>
                      <span className={`text-[10px] px-1.5 rounded ${s.risk.status === 'VERIFIED' ? 'text-emerald-400 bg-emerald-950' : 'text-red-400 bg-red-950'}`}>
                        {s.risk.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleFullAuto}
            className="w-full py-2.5 bg-aviation-600 hover:bg-aviation-500 text-white font-bold text-xs rounded transition-colors flex items-center justify-center gap-2 mt-4"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>EXECUTE AUTO SCREENING</span>
          </button>
        </div>

        {/* Center / Right Content Panel */}
        <div className="flex-1 p-6 bg-aviation-950 overflow-y-auto flex flex-col justify-between">
          <div className="flex-1">
            {isProcessing ? (
              <div className="h-full flex items-center justify-center flex-col space-y-4">
                <div className="w-12 h-12 border-4 border-aviation-300 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-sm font-mono text-aviation-300 tracking-wider">
                  EXECUTING AI ANALYTICS FOR {STEPS[currentStep]}...
                </div>
              </div>
            ) : (
              <div className="h-full animate-fade-in space-y-6">
                {/* Step Title Header */}
                <div className="flex items-center justify-between border-b border-aviation-800 pb-3">
                  <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                    <span className="font-mono text-aviation-300">0{currentStep + 1} //</span> {STEPS[currentStep]}
                  </h2>
                  <span className="text-xs font-mono text-slate-400 bg-aviation-900 px-3 py-1 rounded border border-aviation-800">
                    AIRPORT SECURITY PROTOCOL V4.2
                  </span>
                </div>

                {/* STEP 0: IDENTIFY */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="p-5 bg-emerald-950/40 border border-emerald-600/50 rounded-xl flex items-start space-x-4">
                      <CheckCircle className="w-6 h-6 text-emerald-400 mt-1" />
                      <div>
                        <h4 className="font-bold text-emerald-300 text-base">PASSENGER CHECK-IN RECORD IDENTIFIED</h4>
                        <p className="text-xs text-slate-300 mt-1">
                          Passenger biometric hash matched active departure flight boarding manifest. Ready for optical document scanning.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setIsScannerOpen(true)}
                        className="p-6 bg-aviation-900 border border-aviation-700 hover:border-aviation-500 rounded-xl text-left transition-all group"
                      >
                        <Camera className="w-8 h-8 text-aviation-300 mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-white text-sm">OPEN LIVE PASSPORT CAMERA SCANNER</h4>
                        <p className="text-xs text-slate-400 mt-1">Scan passport document live using webcam sensor.</p>
                      </button>

                      <div className="p-6 bg-aviation-900/50 border border-aviation-800 rounded-xl text-left">
                        <ShieldCheck className="w-8 h-8 text-slate-500 mb-3" />
                        <h4 className="font-bold text-slate-300 text-sm">AUTOMATED PASSPORT VERIFICATION</h4>
                        <p className="text-xs text-slate-400 mt-1">Optical OCR and MRZ checksum validation initialized.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 1: DOCUMENT SCAN */}
                {currentStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-aviation-900 border border-aviation-800 rounded-xl p-5 flex flex-col items-center justify-center min-h-[260px]">
                      {scannedDocument?.imageBlobUrl ? (
                        <img src={scannedDocument.imageBlobUrl} alt="Passport Scan" className="max-h-48 object-contain rounded border border-aviation-700" />
                      ) : (
                        <div className="text-center p-6 space-y-3">
                          <FileText className="w-12 h-12 text-aviation-300 mx-auto" />
                          <span className="text-xs font-mono text-slate-300">OPTICAL DOCUMENT SCAN COMPLETE</span>
                          <button
                            onClick={() => setIsScannerOpen(true)}
                            className="px-4 py-2 bg-aviation-700 hover:bg-aviation-600 text-white text-xs font-bold rounded flex items-center gap-2 mx-auto"
                          >
                            <Camera className="w-4 h-4" /> RE-SCAN WITH CAMERA
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="bg-aviation-900 border border-aviation-800 rounded-xl p-5 space-y-4">
                      <h4 className="font-mono text-xs font-bold text-aviation-300 tracking-wider">OPTICAL OCR EXTRACTION</h4>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between border-b border-aviation-800 pb-1.5">
                          <span className="text-slate-400">OCR CONFIDENCE SCORE:</span>
                          <span className="text-emerald-400 font-bold">{scenario.ocr.confidence}%</span>
                        </div>
                        <div className="flex justify-between border-b border-aviation-800 pb-1.5">
                          <span className="text-slate-400">MRZ CHECKSUM PASS:</span>
                          <span className={scenario.ocr.mrz_detected ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                            {scenario.ocr.mrz_detected ? 'YES' : 'NO'}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-aviation-800 pb-1.5">
                          <span className="text-slate-400">DOCUMENT EXPIRY:</span>
                          <span className="text-slate-200">2030-08-20 (VALID)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: FORENSICS */}
                {currentStep === 2 && (
                  <div className="bg-aviation-900 border border-aviation-800 rounded-xl p-6 space-y-4">
                    <h4 className="font-mono text-xs font-bold text-aviation-300 tracking-wider">DOCUMENT FORENSIC TAMPER ANALYSIS</h4>
                    
                    <div className={`p-4 rounded-lg border ${scenario.forensics.tampering ? 'bg-red-950/40 border-red-600/60 text-red-200' : 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'}`}>
                      <div className="flex items-center space-x-2 font-bold text-sm">
                        {scenario.forensics.tampering ? <AlertTriangle className="w-5 h-5 text-red-400" /> : <CheckCircle className="w-5 h-5 text-emerald-400" />}
                        <span>OVERALL FORENSIC RISK TIER: {scenario.forensics.overall_risk}</span>
                      </div>
                      <p className="text-xs mt-2">
                        {scenario.forensics.tampering 
                          ? 'Potential micro-print alteration or photo substitution detected in document layer.' 
                          : 'Holographic integrity, UV features, and print alignment verified clean.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 3: FACIAL BIOMETRICS WITH LIVE CAMERA */}
                {currentStep === 3 && (
                  <LiveCameraFaceVerification 
                    passportPhotoUrl={scannedDocument?.imageBlobUrl}
                    onVerificationComplete={(res) => setLiveFaceResult(res)}
                  />
                )}

                {/* STEP 4: FINGERPRINT */}
                {currentStep === 4 && (
                  <div className="bg-aviation-900 border border-aviation-800 rounded-xl p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-aviation-950 border border-aviation-700 rounded-full flex items-center justify-center mx-auto text-aviation-300">
                      👆
                    </div>
                    <h4 className="font-bold text-white text-base">FINGERPRINT BIOMETRIC VERIFICATION</h4>
                    <div className={`inline-block px-4 py-2 rounded-lg font-mono text-sm font-bold ${
                      scenario.fingerprint.match === 'MATCH' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-amber-950 text-amber-300 border border-amber-700'
                    }`}>
                      {scenario.fingerprint.match} — SIMILARITY: {scenario.fingerprint.similarity}%
                    </div>
                  </div>
                )}

                {/* STEP 5: IRIS */}
                {currentStep === 5 && (
                  <div className="bg-aviation-900 border border-aviation-800 rounded-xl p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-aviation-950 border border-aviation-700 rounded-full flex items-center justify-center mx-auto text-aviation-300">
                      👁️
                    </div>
                    <h4 className="font-bold text-white text-base">IRIS RECOGNITION SCAN</h4>
                    <div className={`inline-block px-4 py-2 rounded-lg font-mono text-sm font-bold ${
                      scenario.iris.match === 'MATCH' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-red-950 text-red-300 border border-red-700'
                    }`}>
                      {scenario.iris.match} — SIMILARITY: {scenario.iris.similarity}%
                    </div>
                  </div>
                )}

                {/* STEP 6: RISK ANALYSIS */}
                {currentStep === 6 && (
                  <div className="bg-aviation-900 border border-aviation-800 rounded-xl p-6 space-y-6">
                    <h3 className="text-center font-bold text-lg text-white">EXPLAINABLE AI RISK ASSESSMENT</h3>
                    
                    <div className="flex justify-center">
                      <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center font-mono text-3xl font-extrabold shadow-2xl ${
                        scenario.risk.status === 'VERIFIED' ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30' :
                        scenario.risk.status === 'HIGH_RISK' ? 'border-red-500 text-red-400 bg-red-950/30' : 'border-amber-500 text-amber-400 bg-amber-950/30'
                      }`}>
                        {scenario.risk.score}
                      </div>
                    </div>

                    {scenario.red_flags.length > 0 && (
                      <div className="bg-red-950/40 border border-red-600/70 p-4 rounded-xl space-y-2">
                        <div className="flex items-center space-x-2 text-red-400 font-bold text-xs uppercase font-mono">
                          <ShieldAlert className="w-4 h-4" />
                          <span>DETECTED ANOMALIES & RED FLAGS:</span>
                        </div>
                        {scenario.red_flags.map((flag, idx) => (
                          <div key={idx} className="text-xs text-red-200 flex items-start space-x-2">
                            <span className="text-red-400 font-bold">•</span>
                            <span><strong>{flag.type}:</strong> {flag.description}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 7: DECISION */}
                {currentStep === 7 && (
                  <div className={`p-8 rounded-xl border text-center space-y-6 ${
                    scenario.risk.status === 'VERIFIED' ? 'bg-emerald-950/30 border-emerald-600/80' :
                    scenario.risk.status === 'HIGH_RISK' ? 'bg-red-950/30 border-red-600/80' : 'bg-amber-950/30 border-amber-600/80'
                  }`}>
                    <h2 className="text-2xl font-bold text-slate-200">FINAL IMMIGRATION DECISION</h2>
                    
                    <div className={`text-4xl font-extrabold font-mono tracking-widest ${
                      scenario.risk.status === 'VERIFIED' ? 'text-emerald-400' :
                      scenario.risk.status === 'HIGH_RISK' ? 'text-red-400' : 'text-amber-400'
                    }`}>
                      {scenario.risk.status.replace('_', ' ')}
                    </div>

                    {redFlagTriggered && (
                      <div className="bg-red-600 text-white font-bold text-xs py-2 px-4 rounded-lg inline-flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" />
                        <span>RED FLAG BROADCAST DISPATCHED TO SECURITY AUTHORITIES</span>
                      </div>
                    )}

                    <div className="flex justify-center space-x-4">
                      {scenario.risk.status === 'VERIFIED' ? (
                        <button 
                          onClick={() => navigate('/dashboard')}
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded shadow transition-colors text-xs"
                        >
                          APPROVE & CLEAR PASSENGER
                        </button>
                      ) : (
                        <button 
                          onClick={() => navigate('/reviews')}
                          className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded shadow transition-colors text-xs"
                        >
                          ESCALATE TO SECURITY QUEUE
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          setCurrentStep(0);
                          setRedFlagTriggered(false);
                        }}
                        className="px-4 py-2.5 border border-aviation-700 hover:bg-aviation-800 text-white font-bold rounded text-xs"
                      >
                        NEW SCREENING
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Stepper Action Control */}
          <div className="mt-6 pt-4 border-t border-aviation-800 flex justify-between items-center">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-3 py-1.5 bg-aviation-900 border border-aviation-700 hover:border-aviation-500 text-aviation-200 text-xs font-mono rounded flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>PASSPORT CAMERA SCANNER</span>
            </button>

            {currentStep < STEPS.length - 1 && (
              <button
                onClick={handleNext}
                disabled={isProcessing}
                className="px-6 py-2 bg-aviation-600 hover:bg-aviation-500 text-white font-bold rounded shadow transition-colors text-xs flex items-center gap-2"
              >
                <span>NEXT STEP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Passport Camera Scanner Modal */}
      <PassportScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanComplete={(data) => {
          setScannedDocument(data);
        }}
      />
    </div>
  );
}
