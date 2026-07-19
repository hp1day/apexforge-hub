import React, { useState } from 'react';
import { Camera, RefreshCw, AlertTriangle, CheckCircle, UploadCloud, Eye } from 'lucide-react';

export default function DefectDetector() {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [activeFrame, setActiveFrame] = useState('nominal'); // nominal, fracture, misalignment
  const [customImage, setCustomImage] = useState(null);

  // Predefined frames representing casings
  const sampleFrames = {
    nominal: {
      name: 'Nominal Spindle Casing',
      desc: 'Component surfaces are aligned within standard industrial tolerance.',
      status: 'PASS',
      confidence: 99.6,
      svg: (
        <svg className="w-full h-full bg-slate-900" viewBox="0 0 400 240">
          {/* Casing Outer Metal */}
          <rect x="80" y="50" width="240" height="140" rx="10" fill="#2d3748" stroke="#4a5568" strokeWidth="4" />
          {/* Spindle Core Shaft */}
          <rect x="40" y="100" width="320" height="40" fill="#718096" stroke="#4a5568" strokeWidth="2" />
          {/* Grid Calibration Marks */}
          <line x1="200" y1="20" x2="200" y2="220" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="20" y1="120" x2="380" y2="120" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" strokeDasharray="5,5" />
          {/* Alignment Crosshairs */}
          <circle cx="200" cy="120" r="8" fill="none" stroke="#10b981" strokeWidth="1" />
        </svg>
      )
    },
    fracture: {
      name: 'Composite Casing - Fracture Detected',
      desc: 'Vertex AI Vision identifies micro-fracture anomalies along the central metal core load line.',
      status: 'FAIL',
      errorType: 'Micro-fracture anomaly',
      confidence: 94.8,
      bbox: { x: 120, y: 80, width: 60, height: 60 },
      svg: (
        <svg className="w-full h-full bg-slate-900" viewBox="0 0 400 240">
          {/* Casing Outer Metal */}
          <rect x="80" y="50" width="240" height="140" rx="10" fill="#2d3748" stroke="#4a5568" strokeWidth="4" />
          {/* Spindle Core Shaft */}
          <rect x="40" y="100" width="320" height="40" fill="#718096" stroke="#4a5568" strokeWidth="2" />
          {/* Fractures Draw */}
          <path d="M 130 90 L 145 105 L 138 115 L 160 130" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 140 100 L 155 95" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Alignment Crosshairs */}
          <circle cx="200" cy="120" r="8" fill="none" stroke="#f43f5e" strokeWidth="1" />
        </svg>
      )
    },
    misalignment: {
      name: 'Assembly Line Spindle Misalignment',
      desc: 'Edge alignment calculations exceed maximum tolerance bound of 1.25mm.',
      status: 'FAIL',
      errorType: 'Edge alignment deviation',
      confidence: 97.4,
      bbox: { x: 300, y: 85, width: 50, height: 70 },
      svg: (
        <svg className="w-full h-full bg-slate-900" viewBox="0 0 400 240">
          {/* Casing Outer Metal */}
          <rect x="80" y="50" width="240" height="140" rx="10" fill="#2d3748" stroke="#4a5568" strokeWidth="4" />
          {/* Misaligned Core Shaft (rotated/skewed) */}
          <rect x="40" y="100" width="320" height="40" transform="rotate(3 200 120)" fill="#718096" stroke="#f59e0b" strokeWidth="2" />
          {/* Grid lines */}
          <line x1="200" y1="20" x2="200" y2="220" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="20" y1="120" x2="380" y2="120" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="1" strokeDasharray="5,5" />
          {/* Alignment Crosshairs */}
          <circle cx="200" cy="120" r="8" fill="none" stroke="#f59e0b" strokeWidth="1" />
        </svg>
      )
    }
  };

  const handleScan = () => {
    setScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setScanning(false);
      if (customImage) {
        // Custom upload fails/passes randomly
        const rand = Math.random() > 0.5;
        setScanResult({
          name: 'Custom Inspection Frame Upload',
          status: rand ? 'PASS' : 'FAIL',
          errorType: rand ? null : 'Subsurface structure micro-void',
          confidence: parseFloat((92 + Math.random() * 7).toFixed(1)),
          desc: rand 
            ? 'Surface scan matches blueprint parameters perfectly.' 
            : 'Potential structural fatigue or casting void detected.'
        });
      } else {
        setScanResult(sampleFrames[activeFrame]);
      }
    }, 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target.result);
        setActiveFrame(null);
        setScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="glass-panel p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">Vertex AI Edge Defect Vision Simulator</h2>
          <p className="text-xs text-gray-400 font-mono">Simulates real-time image classification and bounding box anomaly detection</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(sampleFrames).map(([key, value]) => (
            <button
              key={key}
              onClick={() => {
                setActiveFrame(key);
                setCustomImage(null);
                setScanResult(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all duration-300 ${
                activeFrame === key
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40 font-bold'
                  : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
              }`}
            >
              {key === 'nominal' ? 'Nominal Frame' : key === 'fracture' ? 'Fracture Frame' : 'Misaligned Frame'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inspection Camera Panel Viewport */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="relative aspect-[5/3] w-full rounded-xl border border-white/10 bg-slate-950 overflow-hidden flex items-center justify-center">
            {/* SVG Camera Render or Custom Upload */}
            {customImage ? (
              <img src={customImage} alt="Custom inspection upload" className="object-cover w-full h-full" />
            ) : (
              sampleFrames[activeFrame].svg
            )}

            {/* Scan Sweep overlay */}
            {scanning && (
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {/* Horizontal scan line */}
                <div className="w-full h-1 bg-cyan-400 absolute animated-scanline shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
                {/* Blue matrix tint */}
                <div className="w-full h-full bg-cyan-500/5 backdrop-blur-[0.5px]"></div>
              </div>
            )}

            {/* Bounding box highlight if scan completes and is a failure */}
            {!scanning && scanResult && scanResult.status === 'FAIL' && (
              <div className="absolute border-2 border-rose-500 bg-rose-500/10 shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse rounded pointer-events-none"
                style={{
                  left: scanResult.bbox ? `${(scanResult.bbox.x / 400) * 100}%` : '35%',
                  top: scanResult.bbox ? `${(scanResult.bbox.y / 240) * 100}%` : '30%',
                  width: scanResult.bbox ? `${(scanResult.bbox.width / 400) * 100}%` : '30%',
                  height: scanResult.bbox ? `${(scanResult.bbox.height / 240) * 100}%` : '40%',
                }}
              >
                <span className="absolute -top-5 left-0 bg-rose-500 text-white font-mono text-[9px] px-1 py-0.5 rounded shadow">
                  ANOMALY DETECTED
                </span>
              </div>
            )}

            {/* Camera Overlay indicators */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[9px] font-mono text-cyan-400 flex items-center gap-1.5 uppercase">
              <span className={`w-1.5 h-1.5 rounded-full ${scanning ? 'bg-cyan-400 live-pulse' : 'bg-red-500'}`}></span>
              <span>CAM FEED 01_SPINDLE</span>
            </div>
            
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[9px] font-mono text-gray-400">
              400x240 @ 60FPS
            </div>
          </div>

          {/* Trigger controls */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <label className="flex items-center justify-center gap-2 bg-slate-900 border border-white/10 hover:bg-slate-800 text-gray-300 hover:text-white px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300">
              <UploadCloud className="w-4 h-4 text-gray-400" />
              <span>Upload Custom Frame</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={handleScan}
              disabled={scanning}
              className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:bg-cyan-800 disabled:text-slate-900 font-bold px-4 py-2.5 rounded-lg text-xs transition-all duration-300 active:scale-95 disabled:active:scale-100"
            >
              {scanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Vertex AI processing...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Execute Visual Check</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Prediction Results Display */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/40 border border-white/10 rounded-xl p-5">
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">Vertex AI Classification</h3>
            
            {!scanResult ? (
              <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500 space-y-2">
                <Eye className="w-8 h-8 opacity-40 text-cyan-400 animate-pulse" />
                <p className="text-xs font-mono uppercase tracking-wider">Awaiting inspection</p>
                <p className="text-[10px] text-gray-600 font-sans max-w-[200px]">Click "Execute Visual Check" to run model validation on the frame.</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Target Object:</span>
                  <div className="text-sm font-semibold text-white mt-0.5">{scanResult.name}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Decision Yield:</span>
                    <div className="mt-1">
                      {scanResult.status === 'PASS' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-500/10 border border-emerald-500/40 text-emerald-400">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>PASS</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-rose-500/10 border border-rose-500/40 text-rose-400">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>FAIL</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Model Confidence:</span>
                    <div className="text-xl font-bold font-mono text-white mt-0.5">
                      {scanResult.confidence}%
                    </div>
                  </div>
                </div>

                {scanResult.errorType && (
                  <div>
                    <span className="text-[10px] font-mono text-rose-400 uppercase">Identified Anomaly Type:</span>
                    <div className="text-xs font-mono text-rose-300 font-semibold mt-0.5">{scanResult.errorType}</div>
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Model Assessment:</span>
                  <div className="text-xs text-gray-300 leading-relaxed font-sans mt-0.5">{scanResult.desc}</div>
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-white/10 my-4"></div>

          {/* Supervisor Action Recommendations */}
          <div className="bg-slate-900/60 rounded-lg p-3 text-[10px] font-mono border border-white/5">
            <span className="text-cyan-400 font-bold uppercase block mb-1">Recommended Response:</span>
            {scanResult && scanResult.status === 'FAIL' ? (
              <span className="text-rose-300">
                Trigger Google Workspace equipment alert to team immediately. Schedule downtime using the Margin protection desk.
              </span>
            ) : (
              <span className="text-gray-400">
                Visual pipeline passes within parameters. Maintain regular mechanical operational guidelines.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
