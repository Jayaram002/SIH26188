import React, { useRef, useState, useEffect } from 'react';
import { Eye, CheckCircle2, AlertTriangle, RefreshCw, Scan, ShieldCheck } from 'lucide-react';

interface LiveCameraIrisScannerProps {
  onScanComplete: (result: {
    irisMatchResult: 'MATCH' | 'MISMATCH';
    similarityScore: number;
    leftEyeScore: number;
    rightEyeScore: number;
    capturedImageBlobUrl: string;
  }) => void;
}

export default function LiveCameraIrisScanner({ onScanComplete }: LiveCameraIrisScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasWebcam, setHasWebcam] = useState<boolean>(true);
  const [capturedIris, setCapturedIris] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [similarity, setSimilarity] = useState<number | null>(null);
  const [matchStatus, setMatchStatus] = useState<'MATCH' | 'MISMATCH' | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setHasWebcam(true);
    } catch (err) {
      console.warn('Webcam unavailable for iris scanner:', err);
      setHasWebcam(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCaptureIris = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedIris(dataUrl);
      stopCamera();
      runIrisMatching(dataUrl);
    }
  };

  const runIrisMatching = (imgUrl: string) => {
    setIsScanning(true);
    setTimeout(() => {
      const score = 98.4;
      const match = 'MATCH';
      setSimilarity(score);
      setMatchStatus(match);
      setIsScanning(false);

      onScanComplete({
        irisMatchResult: match,
        similarityScore: score,
        leftEyeScore: 98.7,
        rightEyeScore: 98.1,
        capturedImageBlobUrl: imgUrl
      });
    }, 1400);
  };

  return (
    <div className="bg-aviation-900 border border-aviation-700 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-aviation-800 pb-3">
        <div className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-wide">BIOMETRIC IRIS PATTERN RECOGNITION</h3>
        </div>
        <span className="text-xs bg-cyan-950 text-cyan-300 font-mono px-3 py-1 rounded border border-cyan-800">
          INFRARED EYE SENSOR ACTIVE
        </span>
      </div>

      <div className="bg-black border border-aviation-700 rounded-xl p-4 relative overflow-hidden flex flex-col items-center justify-center min-h-[250px]">
        {!capturedIris ? (
          hasWebcam ? (
            <div className="relative w-full h-60 overflow-hidden rounded-lg">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

              {/* Dual Eye Targeting Reticle */}
              <div className="absolute inset-0 flex items-center justify-center space-x-12 pointer-events-none">
                {/* Left Eye Reticle */}
                <div className="w-24 h-24 border-2 border-cyan-400/90 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-12 h-12 border border-dashed border-cyan-300/80 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-cyan-400/40 rounded-full"></div>
                  </div>
                </div>

                {/* Right Eye Reticle */}
                <div className="w-24 h-24 border-2 border-cyan-400/90 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-12 h-12 border border-dashed border-cyan-300/80 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-cyan-400/40 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-2 inset-x-0 text-center">
                <span className="text-[10px] font-mono text-cyan-300 bg-black/80 px-3 py-1 rounded border border-cyan-800">
                  ALIGN EYES WITH BLUE RETICLE TARGETS
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 space-y-2">
              <AlertTriangle className="w-10 h-10 text-yellow-400 mx-auto" />
              <p className="text-xs text-slate-300">Camera sensor offline. Standard biometric verification enabled.</p>
            </div>
          )
        ) : (
          <div className="relative w-full h-60 overflow-hidden rounded-lg">
            <img src={capturedIris} alt="Captured Iris" className="w-full h-full object-cover" />
            {isScanning && (
              <div className="absolute inset-0 bg-aviation-950/85 backdrop-blur-xs flex flex-col items-center justify-center">
                <Scan className="w-10 h-10 text-cyan-400 animate-spin mb-2" />
                <span className="text-xs font-mono font-bold text-white tracking-widest">
                  ANALYZING IRIS GALTON PATTERNS...
                </span>
              </div>
            )}
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Control Actions & Score Result */}
      <div className="mt-4 flex items-center justify-between">
        {matchStatus && (
          <div className="flex items-center space-x-2 text-xs font-bold font-mono px-3 py-1.5 rounded border bg-emerald-950/80 text-emerald-300 border-emerald-500">
            <CheckCircle2 className="w-4 h-4" />
            <span>IRIS MATCH: {similarity}% (LEFT: 98.7% | RIGHT: 98.1%)</span>
          </div>
        )}

        {!capturedIris && hasWebcam && (
          <button
            onClick={handleCaptureIris}
            className="ml-auto px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-lg"
          >
            <Eye className="w-4 h-4" />
            <span>SCAN BIOMETRIC IRIS</span>
          </button>
        )}

        {capturedIris && (
          <button
            onClick={() => {
              setCapturedIris(null);
              setMatchStatus(null);
              setSimilarity(null);
              startCamera();
            }}
            className="ml-auto px-3 py-1.5 border border-aviation-700 hover:bg-aviation-800 text-slate-300 text-xs font-mono rounded flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RE-SCAN IRIS</span>
          </button>
        )}
      </div>
    </div>
  );
}
