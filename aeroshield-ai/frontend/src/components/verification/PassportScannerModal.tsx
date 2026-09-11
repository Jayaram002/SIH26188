import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Upload, CheckCircle2, AlertCircle, Scan } from 'lucide-react';

interface PassportScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (scannedData: {
    passportNumber: string;
    fullName: string;
    nationality: string;
    dob: string;
    expiryDate: string;
    gender: string;
    imageBlobUrl: string;
  }) => void;
}

export default function PassportScannerModal({ isOpen, onClose, onScanComplete }: PassportScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasWebcam, setHasWebcam] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState<number>(0);

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedImage]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setHasWebcam(true);
    } catch (err) {
      console.warn('Webcam permission denied or unavailable:', err);
      setHasWebcam(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      stopCamera();
      runScanProcess(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setCapturedImage(dataUrl);
        stopCamera();
        runScanProcess(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const runScanProcess = (imgUrl: string) => {
    setIsScanning(true);
    setScanProgress(10);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          // Standard simulated OCR extract from document scan
          onScanComplete({
            passportNumber: 'N4820194',
            fullName: 'Rajesh Sharma',
            nationality: 'IND',
            dob: '1985-04-12',
            expiryDate: '2030-08-20',
            gender: 'M',
            imageBlobUrl: imgUrl
          });
          onClose();
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-aviation-900 border border-aviation-600 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-aviation-700 bg-aviation-950 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-aviation-300" />
            <h3 className="font-bold text-white tracking-wide text-lg">LIVE PASSPORT OPTICAL SCANNER</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-aviation-800 rounded text-aviation-300 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Camera Body */}
        <div className="p-6">
          {!capturedImage ? (
            <div className="relative bg-black rounded-lg overflow-hidden border border-aviation-700 aspect-video flex items-center justify-center">
              {hasWebcam ? (
                <>
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  
                  {/* Passport Optical Reticle Framing */}
                  <div className="absolute inset-6 border-2 border-dashed border-aviation-300/80 rounded-lg pointer-events-none flex flex-col justify-between p-4 animate-pulse">
                    <div className="flex justify-between items-start text-xs font-mono text-aviation-200 bg-aviation-950/70 px-2 py-1 rounded">
                      <span>ALIGN PASSPORT DOCUMENT</span>
                      <span>ICAO 9303 STANDARDS</span>
                    </div>

                    {/* MRZ Zone Bar */}
                    <div className="border-t-2 border-emerald-400/90 bg-emerald-950/40 p-2 rounded text-center">
                      <span className="text-xs font-mono text-emerald-300 tracking-widest uppercase font-bold">
                        P&lt;INDSHARMA&lt;&lt;RAJESH&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt; MRZ TARGET AREA
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-3">
                  <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto" />
                  <p className="text-aviation-200 text-sm font-semibold">Webcam not detected or camera access restricted.</p>
                  <label className="inline-flex items-center space-x-2 px-4 py-2 bg-aviation-600 hover:bg-aviation-500 text-white rounded cursor-pointer font-bold text-sm">
                    <Upload className="w-4 h-4" />
                    <span>Upload Passport Image</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              )}
            </div>
          ) : (
            <div className="relative bg-black rounded-lg overflow-hidden border border-aviation-700 aspect-video flex items-center justify-center">
              <img src={capturedImage} alt="Captured Passport" className="w-full h-full object-contain" />
              {isScanning && (
                <div className="absolute inset-0 bg-aviation-950/85 flex flex-col items-center justify-center p-6">
                  <Scan className="w-12 h-12 text-aviation-300 animate-spin mb-4" />
                  <p className="text-lg font-bold text-white font-mono mb-2">SCANNING DOCUMENT OCR ({scanProgress}%)</p>
                  <div className="w-64 bg-aviation-900 rounded-full h-2 overflow-hidden border border-aviation-700">
                    <div className="bg-aviation-300 h-full transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {/* Action buttons */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-xs text-aviation-300 font-mono">
              STATUS: {hasWebcam ? 'WEBCAM ACTIVE' : 'FILE INPUT READY'}
            </div>

            <div className="flex space-x-3">
              {capturedImage && !isScanning && (
                <button
                  onClick={() => {
                    setCapturedImage(null);
                    startCamera();
                  }}
                  className="px-4 py-2 border border-aviation-600 hover:bg-aviation-800 text-white text-sm font-semibold rounded flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>RETRACT & RETAKE</span>
                </button>
              )}

              {!capturedImage && hasWebcam && (
                <button
                  onClick={handleCapture}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded shadow flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>CAPTURE PASSPORT</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
