import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, CheckCircle2, AlertTriangle, ShieldCheck, User, Plane, ArrowRight, Scan, RefreshCw, Eye, FileText, Lock, ShieldAlert, Zap
} from 'lucide-react';
import PassportScannerModal from '../components/verification/PassportScannerModal';
import LiveCameraFaceVerification from '../components/verification/LiveCameraFaceVerification';
import LiveCameraIrisScanner from '../components/verification/LiveCameraIrisScanner';
import { broadcastRedFlag } from '../lib/supabase';

interface PassengerDossier {
  id: string;
  name: string;
  flight: string;
  gate: string;
  passport: string;
  prevRiskScore: number;
  prevRiskStatus: 'LOW' | 'MEDIUM' | 'HIGH';
  lastScreened: string;
  visaType: string;
  visaExpiry: string;
  visaValid: boolean;
  status: 'VERIFIED' | 'REVIEW' | 'HIGH_RISK';
}

const DEFAULT_PASSENGER: PassengerDossier = { 
  id: 'AV-IND-000123', 
  name: 'RAJESH KUMAR SHARMA', 
  flight: 'AX 204', 
  gate: 'G18', 
  passport: 'N4820194',
  prevRiskScore: 8,
  prevRiskStatus: 'LOW',
  lastScreened: '2026-08-10 (DELHI T3)',
  visaType: 'B1/B2 Tourist Visa',
  visaExpiry: '2030-05-20',
  visaValid: true,
  status: 'VERIFIED' 
};

const FRAUD_PASSENGER: PassengerDossier = { 
  id: 'AV-USA-000891', 
  name: 'MICHAEL DAVID CHEN', 
  flight: 'UA 505', 
  gate: 'G22', 
  passport: 'P9021844',
  prevRiskScore: 68,
  prevRiskStatus: 'HIGH',
  lastScreened: '2026-09-01 (JFK T4)',
  visaType: 'Tourist Entry Permit',
  visaExpiry: '2026-08-15',
  visaValid: false,
  status: 'HIGH_RISK' 
};

export default function PassengerPortal() {
  const navigate = useNavigate();
  const [selectedPassenger, setSelectedPassenger] = useState<PassengerDossier>(DEFAULT_PASSENGER);
  const [isFraudMode, setIsFraudMode] = useState<boolean>(false);
  const [stage, setStage] = useState<'START' | 'SCAN_DOCUMENT' | 'VISA_VALIDATION' | 'VERIFY_FACE' | 'SCAN_IRIS' | 'PROCESSING' | 'RESULT'>('START');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedDoc, setScannedDoc] = useState<any>(null);
  const [faceResult, setFaceResult] = useState<any>(null);
  const [irisResult, setIrisResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const toggleFraudDemo = () => {
    const nextFraudState = !isFraudMode;
    setIsFraudMode(nextFraudState);
    if (nextFraudState) {
      setSelectedPassenger(FRAUD_PASSENGER);
    } else {
      setSelectedPassenger(DEFAULT_PASSENGER);
    }
  };

  const handleScanDocComplete = (data: any) => {
    setScannedDoc(data);
    if (data.fullName) {
      setSelectedPassenger(prev => ({
        ...prev,
        name: data.fullName.toUpperCase(),
        passport: data.passportNumber
      }));
    }
  };

  const startAutoVerification = () => {
    setStage('PROCESSING');
    setProgress(10);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStage('RESULT');

          if (isFraudMode || selectedPassenger.status === 'HIGH_RISK' || !selectedPassenger.visaValid) {
            broadcastRedFlag({
              verification_id: 'VER-KIOSK-' + Date.now().toString().slice(-5),
              passenger_id: selectedPassenger.id,
              passenger_name: selectedPassenger.name,
              passport_number: selectedPassenger.passport,
              flag_type: isFraudMode ? 'IRIS_AND_FACE_MISMATCH' : (!selectedPassenger.visaValid ? 'VISA_EXPIRED' : 'KIOSK_BIOMETRIC_ANOMALY'),
              severity: 'CRITICAL',
              description: isFraudMode 
                ? 'CRITICAL FRAUD: Iris scan failed (38.1%) & facial vector mismatch detected on Smart Gate 02.' 
                : (!selectedPassenger.visaValid ? 'Travel visa expired on ' + selectedPassenger.visaExpiry : 'Biometric mismatch during self-verification.'),
              terminal: 'TERMINAL 2 KIOSK',
              checkpoint: 'SMART GATE 02',
              officer_id: 'SYSTEM_KIOSK',
              status: 'ACTIVE'
            });
          }
          return 100;
        }
        return prev + 20;
      });
    }, 450);
  };

  return (
    <div className="min-h-screen bg-aviation-950 text-slate-100 flex flex-col justify-between p-6 font-sans">
      {/* Kiosk Header */}
      <header className="flex justify-between items-center border-b border-aviation-800 pb-4 max-w-5xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-aviation-500 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg">
            ✈
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-wide">AEROSHIELD SMART GATE</h1>
            <p className="text-xs text-aviation-300 font-mono">AUTOMATED PASSENGER SELF-SERVICE KIOSK 02</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleFraudDemo}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 border ${
              isFraudMode 
                ? 'bg-red-600 text-white border-red-400 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.6)]' 
                : 'bg-aviation-900 text-slate-300 border-aviation-700 hover:border-red-500'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isFraudMode ? '🚨 FRAUD DEMO MODE ON' : 'SIMULATE FRAUD DETECTED DEMO'}</span>
          </button>

          <button 
            onClick={() => navigate('/login')}
            className="px-3 py-1.5 border border-aviation-700 hover:bg-aviation-800 rounded text-xs font-mono text-slate-300 transition-colors"
          >
            OFFICER PORTAL →
          </button>
        </div>
      </header>

      {/* Main Kiosk Content */}
      <main className="max-w-3xl mx-auto w-full my-auto py-6">
        {/* STAGE 1: START DIRECTLY WITH OPTICAL SCANNER */}
        {stage === 'START' && (
          <div className="bg-aviation-900 border border-aviation-800 rounded-2xl p-10 shadow-2xl text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-aviation-950 border border-aviation-700 rounded-full flex items-center justify-center mx-auto text-aviation-300 shadow-inner">
              <Scan className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white">EXPRESS BOARDING CHECK-IN</h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Scan your passport document to begin automated multi-modal biometric verification.
              </p>
            </div>

            <div className="bg-aviation-950 p-6 rounded-xl border border-aviation-800 max-w-md mx-auto text-center space-y-4">
              <button
                onClick={() => {
                  setIsScannerOpen(true);
                  setStage('SCAN_DOCUMENT');
                }}
                className="w-full py-5 bg-aviation-800 hover:bg-aviation-700 border border-aviation-500 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-xl group"
              >
                <Camera className="w-6 h-6 text-aviation-300 group-hover:scale-110 transition-transform" />
                <span>OPEN PASSPORT CAMERA SCANNER</span>
              </button>
              <p className="text-[11px] text-slate-400 font-mono">
                COMPLIANT WITH ICAO 9303 & ISO 19794 BIOMETRIC STANDARDS
              </p>
            </div>

            <button
              onClick={() => setStage('SCAN_DOCUMENT')}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xl transition-all inline-flex items-center gap-2"
            >
              <span>PROCEED TO VERIFICATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STAGE 2: DOCUMENT CAMERA SCAN */}
        {stage === 'SCAN_DOCUMENT' && (
          <div className="bg-aviation-900 border border-aviation-800 rounded-2xl p-8 shadow-2xl text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-aviation-950 border border-aviation-700 rounded-full flex items-center justify-center mx-auto text-aviation-300">
              <Scan className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">STEP 1: SCAN PASSPORT DOCUMENT</h2>
              <p className="text-xs text-slate-300 mt-1">Position passport under the optical camera sensor.</p>
            </div>

            <div className="bg-aviation-950 p-6 rounded-xl border border-aviation-800 max-w-md mx-auto text-center space-y-4">
              {scannedDoc ? (
                <div className="space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <p className="text-xs font-mono text-emerald-300 font-bold">PASSPORT OCR & MRZ EXTRACTED</p>
                  <p className="text-xs text-slate-400">Passport: {scannedDoc.passportNumber} ({scannedDoc.fullName})</p>
                </div>
              ) : (
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="w-full py-4 bg-aviation-800 hover:bg-aviation-700 border border-aviation-600 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Camera className="w-5 h-5 text-aviation-300" />
                  <span>OPEN LIVE PASSPORT CAMERA SCANNER</span>
                </button>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              <button onClick={() => setStage('START')} className="px-4 py-2 border border-aviation-700 hover:bg-aviation-800 text-slate-300 text-xs rounded-lg">
                BACK
              </button>
              <button onClick={() => setStage('VISA_VALIDATION')} className="px-6 py-2 bg-aviation-600 hover:bg-aviation-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-1.5">
                <span>NEXT: VISA VALIDATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: VISA VALIDATION MODULE */}
        {stage === 'VISA_VALIDATION' && (
          <div className="bg-aviation-900 border border-aviation-800 rounded-2xl p-8 shadow-2xl text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-aviation-950 border border-aviation-700 rounded-full flex items-center justify-center mx-auto text-aviation-300">
              <FileText className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">STEP 2: TRAVEL VISA VALIDATION</h2>
              <p className="text-xs text-slate-300 mt-1">Checking visa validity against international border authority database.</p>
            </div>

            <div className="bg-aviation-950 p-6 rounded-xl border border-aviation-800 max-w-md mx-auto text-left space-y-3">
              <div className="flex justify-between items-center border-b border-aviation-800 pb-2">
                <span className="text-xs font-mono text-slate-400">VISA CATEGORY:</span>
                <span className="text-xs font-bold text-white">{selectedPassenger.visaType}</span>
              </div>
              <div className="flex justify-between items-center border-b border-aviation-800 pb-2">
                <span className="text-xs font-mono text-slate-400">EXPIRY DATE:</span>
                <span className="text-xs font-mono text-slate-200">{selectedPassenger.visaExpiry}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-slate-400">STATUS:</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                  selectedPassenger.visaValid && !isFraudMode ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
                }`}>
                  {selectedPassenger.visaValid && !isFraudMode ? '✓ VISA VALID & ACTIVE' : '🚨 VISA EXPIRED / INVALID'}
                </span>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button onClick={() => setStage('SCAN_DOCUMENT')} className="px-4 py-2 border border-aviation-700 hover:bg-aviation-800 text-slate-300 text-xs rounded-lg">
                BACK
              </button>
              <button onClick={() => setStage('VERIFY_FACE')} className="px-6 py-2 bg-aviation-600 hover:bg-aviation-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-1.5">
                <span>NEXT: WEBCAM FACE VERIFICATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 4: LIVE WEBCAM FACE VERIFICATION */}
        {stage === 'VERIFY_FACE' && (
          <div className="bg-aviation-900 border border-aviation-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">STEP 3: WEBCAM FACIAL RECOGNITION</h2>
              <p className="text-xs text-slate-300 mt-1">Look into the webcam for facial feature comparison.</p>
            </div>

            <LiveCameraFaceVerification
              passportPhotoUrl={scannedDoc?.imageBlobUrl}
              onVerificationComplete={(res) => setFaceResult(res)}
            />

            <div className="flex justify-center space-x-4">
              <button onClick={() => setStage('VISA_VALIDATION')} className="px-4 py-2 border border-aviation-700 hover:bg-aviation-800 text-slate-300 text-xs rounded-lg">
                BACK
              </button>
              <button onClick={() => setStage('SCAN_IRIS')} className="px-6 py-2 bg-aviation-600 hover:bg-aviation-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-1.5">
                <span>NEXT: IRIS BIOMETRIC SCAN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 5: BIOMETRIC IRIS SCANNER */}
        {stage === 'SCAN_IRIS' && (
          <div className="bg-aviation-900 border border-aviation-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">STEP 4: BIOMETRIC IRIS SCANNER</h2>
              <p className="text-xs text-slate-300 mt-1">Align eyes with reticle targets for infrared iris scan.</p>
            </div>

            <LiveCameraIrisScanner
              isFraudDemo={isFraudMode}
              onScanComplete={(res) => setIrisResult(res)}
            />

            <div className="flex justify-center space-x-4">
              <button onClick={() => setStage('VERIFY_FACE')} className="px-4 py-2 border border-aviation-700 hover:bg-aviation-800 text-slate-300 text-xs rounded-lg">
                BACK
              </button>
              <button onClick={startAutoVerification} className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-lg flex items-center gap-2">
                <span>EXECUTE FINAL SYSTEM CLEARANCE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 6: AUTOMATED SYSTEM PROCESSING (BACKEND PROCESS HIDDEN) */}
        {stage === 'PROCESSING' && (
          <div className="bg-aviation-900 border border-aviation-800 rounded-2xl p-12 shadow-2xl text-center space-y-6 animate-fade-in">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-aviation-500/20 border-t-aviation-300 rounded-full animate-spin"></div>
              <ShieldCheck className="w-10 h-10 text-aviation-300 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-wide">VERIFYING MULTI-SIGNAL BIOMETRICS...</h2>
              <p className="text-xs font-mono text-aviation-300">SYSTEM CHECK IN PROGRESS ({progress}%)</p>
            </div>

            <div className="w-64 bg-aviation-950 rounded-full h-2 mx-auto overflow-hidden border border-aviation-800">
              <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Comparing facial vectors, iris Galton patterns, visa validation, and historical risk profile.
            </p>
          </div>
        )}

        {/* STAGE 7: FINAL RESULT */}
        {stage === 'RESULT' && (
          <div className={`border rounded-2xl p-10 shadow-2xl text-center space-y-6 animate-fade-in ${
            !isFraudMode && selectedPassenger.status === 'VERIFIED' && selectedPassenger.visaValid
              ? 'bg-emerald-950/40 border-emerald-600/80' 
              : 'bg-red-950/60 border-red-500'
          }`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-2xl ${
              !isFraudMode && selectedPassenger.status === 'VERIFIED' && selectedPassenger.visaValid ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
            }`}>
              {!isFraudMode && selectedPassenger.status === 'VERIFIED' && selectedPassenger.visaValid ? <CheckCircle2 className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12" />}
            </div>

            <div className="space-y-2">
              <h2 className={`text-3xl font-black tracking-wider ${
                !isFraudMode && selectedPassenger.status === 'VERIFIED' && selectedPassenger.visaValid ? 'text-emerald-300' : 'text-red-300 animate-pulse'
              }`}>
                {!isFraudMode && selectedPassenger.status === 'VERIFIED' && selectedPassenger.visaValid ? 'CLEARANCE APPROVED' : '🚨 SECURITY ASSISTANCE REQUIRED'}
              </h2>
              <p className="text-sm text-slate-200">
                {!isFraudMode && selectedPassenger.status === 'VERIFIED' && selectedPassenger.visaValid
                  ? `Passenger ${selectedPassenger.name} is cleared to proceed to Gate ${selectedPassenger.gate}.`
                  : `Biometric fraud / risk anomaly detected. Please step aside to Desk 04. An officer has been dispatched.`}
              </p>
            </div>

            <div className="bg-aviation-950/80 p-4 rounded-xl border border-aviation-800 max-w-md mx-auto text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-aviation-800 pb-1">
                <span className="text-slate-400">PASSENGER NAME:</span>
                <span className="font-bold text-white">{selectedPassenger.name}</span>
              </div>
              <div className="flex justify-between border-b border-aviation-800 pb-1">
                <span className="text-slate-400">HISTORICAL RISK SCORE:</span>
                <span className={selectedPassenger.prevRiskScore < 20 && !isFraudMode ? 'text-emerald-400' : 'text-red-400 font-bold'}>
                  {selectedPassenger.prevRiskScore} / 100 ({selectedPassenger.prevRiskStatus})
                </span>
              </div>
              <div className="flex justify-between border-b border-aviation-800 pb-1">
                <span className="text-slate-400">VISA VALIDITY:</span>
                <span className={selectedPassenger.visaValid && !isFraudMode ? 'text-emerald-400' : 'text-red-400 font-bold'}>
                  {selectedPassenger.visaValid && !isFraudMode ? 'VALID' : 'EXPIRED / INVALID'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">IRIS BIOMETRIC MATCH:</span>
                <span className={!isFraudMode ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold animate-pulse'}>
                  {!isFraudMode ? '98.4% (MATCH)' : '38.1% (FRAUD DETECTED)'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setStage('START');
                setScannedDoc(null);
                setFaceResult(null);
                setIrisResult(null);
              }}
              className="px-8 py-3 bg-aviation-700 hover:bg-aviation-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>NEW PASSENGER VERIFICATION</span>
            </button>
          </div>
        )}
      </main>

      {/* Kiosk Footer */}
      <footer className="text-center text-[11px] font-mono text-slate-500 max-w-5xl mx-auto w-full pt-4 border-t border-aviation-800">
        AEROSHIELD AI SMART GATE V4.2 • MULTI-MODAL BIOMETRIC SELF-VERIFICATION & FRAUD DETECTION
      </footer>

      {/* Passport Camera Scanner Modal */}
      <PassportScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanComplete={handleScanDocComplete}
      />
    </div>
  );
}
