import React, { useEffect, useRef, useState } from 'react';
import { VisualObject } from '../types';

interface CameraOverlayProps {
  visualObject: VisualObject;
  onClose: () => void;
  onCapture: () => void;
}

const CameraOverlay: React.FC<CameraOverlayProps> = ({ visualObject, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [scale, setScale] = useState(1); // 1 = 100%
  const [showSuccess, setShowSuccess] = useState(false);

  // --- SVG PATHS FOR OVERLAYS ---
  const getOverlaySVG = (id: string) => {
    const commonProps = {
      stroke: "white",
      strokeWidth: "3",
      fill: "none",
      filter: "drop-shadow(0px 0px 4px rgba(0,0,0,0.8))"
    };

    switch (id) {
      case 'deck-of-cards': // 2.5" x 3.5" ratio
        return (
          <svg viewBox="0 0 100 140" className="w-full h-full" style={{ overflow: 'visible' }}>
            <rect x="5" y="5" width="90" height="130" rx="8" {...commonProps} />
            <path d="M50 40 L60 60 L50 80 L40 60 Z" fill="rgba(255,255,255,0.2)" opacity="0.5" />
          </svg>
        );
      case 'tennis-ball':
      case 'golf-ball':
      case 'sphere':
      case 'circle': // Circular items
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" style={{ overflow: 'visible' }}>
            <circle cx="50" cy="50" r="45" {...commonProps} />
            {/* Tennis ball curve */}
            {id === 'tennis-ball' && (
              <path d="M15 25 Q 50 50 85 25 M15 75 Q 50 50 85 75" {...commonProps} strokeWidth="2" strokeOpacity="0.8" />
            )}
          </svg>
        );
      case 'fist':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" style={{ overflow: 'visible' }}>
            <path d="M25 40 Q20 40 20 55 Q20 70 30 80 Q40 95 60 95 Q80 95 85 75 Q90 55 85 40 Q80 25 60 25 Q50 25 45 35" {...commonProps} />
            <path d="M45 35 Q50 10 70 15" {...commonProps} /> {/* Thumb */}
            <path d="M30 50 L80 50 M30 65 L80 65" {...commonProps} strokeWidth="1" /> {/* Knuckles */}
          </svg>
        );
      case 'thumb':
        return (
           <svg viewBox="0 0 100 140" className="w-full h-full" style={{ overflow: 'visible' }}>
             <path d="M30 130 L30 60 Q30 20 50 20 Q70 20 70 60 L70 130" {...commonProps} />
             <path d="M35 50 Q50 55 65 50" {...commonProps} strokeWidth="1" /> {/* Knuckle */}
             <path d="M40 35 Q50 30 60 35" {...commonProps} strokeWidth="1" opacity="0.6" /> {/* Nail base */}
           </svg>
        );
      case 'computer-mouse':
        return (
          <svg viewBox="0 0 100 140" className="w-full h-full" style={{ overflow: 'visible' }}>
            <path d="M20 50 L20 100 Q20 135 50 135 Q80 135 80 100 L80 50 Q80 10 50 10 Q20 10 20 50 Z" {...commonProps} />
            <path d="M50 10 L50 50" {...commonProps} strokeWidth="1" />
            <path d="M20 50 L80 50" {...commonProps} strokeWidth="1" />
          </svg>
        );
      case 'checkbook':
        return (
           <svg viewBox="0 0 160 80" className="w-full h-full" style={{ overflow: 'visible' }}>
             <rect x="5" y="5" width="150" height="70" rx="2" {...commonProps} />
             <line x1="15" y1="25" x2="100" y2="25" {...commonProps} strokeWidth="1" />
             <line x1="15" y1="45" x2="145" y2="45" {...commonProps} strokeWidth="1" />
           </svg>
        );
      case 'dice':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" style={{ overflow: 'visible' }}>
            <rect x="25" y="25" width="50" height="50" rx="4" {...commonProps} />
            <rect x="35" y="10" width="50" height="50" rx="4" {...commonProps} opacity="0.6" strokeDasharray="4 2"/>
          </svg>
        );
      default: // Generic Square fallback
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" style={{ overflow: 'visible' }}>
            <rect x="10" y="10" width="80" height="80" rx="8" {...commonProps} strokeDasharray="5,5" />
            <text x="50" y="50" fill="white" textAnchor="middle" dy=".3em" fontSize="12" filter="drop-shadow(0 0 2px black)">{visualObject.name}</text>
          </svg>
        );
    }
  };

  // --- CAMERA INIT ---
  useEffect(() => {
    let mediaStream: MediaStream;

    const startCamera = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access failed:", err);
        setError("Unable to access camera. Please ensure you have granted permissions.");
      }
    };

    startCamera();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // --- CAPTURE LOGIC ---
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Match canvas size to video actual size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // In a real app we might capture the image dataURL here, but for this prompt
        // we just trigger the success flow and log prompt.
        
        setShowSuccess(true);
        // Wait 1.5s for success animation then trigger log prompt in parent
        setTimeout(() => {
          onCapture();
        }, 1500);
      }
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
        <i className="bi bi-camera-video-off display-1 text-danger mb-3"></i>
        <h3 className="text-white mb-2">Camera Unavailable</h3>
        <p className="text-secondary mb-4">{error}</p>
        <button onClick={onClose} className="btn btn-outline-light px-4">Close Camera</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden animate-fade-in" role="dialog" aria-label="AR Camera View">
      
      {/* 1. Full Screen Camera Feed */}
      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Hidden Canvas for capture */}
      <canvas ref={canvasRef} className="d-none" />

      {/* 2. AR Overlay Layer */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
        <div 
          style={{ 
            width: '250px', 
            height: '250px', 
            transform: `scale(${scale})`, 
            transition: 'transform 0.1s ease-out'
          }}
          className="d-flex items-center justify-center"
        >
          {getOverlaySVG(visualObject.id)}
        </div>
        
        {/* Helper Text attached to center */}
        <div className="absolute top-1/2 mt-40 text-center w-full" style={{ transform: 'translateY(120px)' }}>
             <span className="badge bg-black/50 backdrop-blur-sm border border-white/10 px-3 py-2 text-white shadow-lg">
                Align {visualObject.name} here
             </span>
        </div>
      </div>

      {/* 3. Top Bar (Object Info) */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start">
         <div className="text-white drop-shadow-md">
            <h5 className="mb-0 fw-bold"><i className="bi bi-eye me-2"></i>PortionVision AR</h5>
            <small className="opacity-75">Match object to outline</small>
         </div>
         <button onClick={onClose} className="btn btn-sm btn-dark rounded-circle bg-black/40 border-0 text-white" style={{ width: '40px', height: '40px'}} aria-label="Close Camera">
            <i className="bi bi-x-lg"></i>
         </button>
      </div>

      {/* 4. Bottom Controls (Glassmorphism) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-5 z-20" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
         <div className="container max-w-md mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-3 shadow-lg">
            
            {/* Slider Row */}
            <div className="mb-3 px-2">
               <div className="d-flex justify-content-between text-white text-xs fw-bold mb-2 uppercase tracking-wide small">
                  <span>Scale: {Math.round(scale * 100)}%</span>
                  <span className="text-info">{visualObject.dimensions}</span>
               </div>
               <input 
                  type="range" 
                  min="0.5" 
                  max="2.0" 
                  step="0.05" 
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="form-range" 
                  style={{ filter: 'hue-rotate(15deg)' }}
                  aria-label="Adjust scale of reference object"
               />
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3">
               <button onClick={onClose} className="btn btn-outline-light flex-grow-1 border-white/30 text-white">
                  Cancel
               </button>
               <button 
                  onClick={handleCapture}
                  className="btn btn-primary flex-grow-1 fw-bold d-flex align-items-center justify-content-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #60a5fa, #c084fc)', border: 'none' }}
               >
                  <i className="bi bi-camera-fill"></i> Capture
               </button>
            </div>

         </div>
      </div>

      {/* 5. Success Flash / Toast */}
      {showSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center animate-fade-in bg-white/20 backdrop-blur-sm">
           <div className="bg-white text-dark p-4 rounded-3xl shadow-2xl text-center animate-scale-in">
              <div className="display-1 text-success mb-2"><i className="bi bi-check-circle-fill"></i></div>
              <h2 className="fw-bold">Captured!</h2>
              <p className="text-secondary mb-0">Processing...</p>
           </div>
        </div>
      )}

    </div>
  );
};

export default CameraOverlay;