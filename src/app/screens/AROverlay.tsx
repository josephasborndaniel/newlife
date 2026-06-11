import { useState } from "react";
import { useNavigate } from "react-router";
import { X, Camera, Scan, Eye, Maximize2 } from "lucide-react";

export default function AROverlay() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [detected, setDetected] = useState(false);

  const handleStartScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setDetected(true);
      setIsScanning(false);
    }, 3000);
  };

  return (
    <div className="h-full w-full flex flex-col bg-black relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />

      <div className="relative z-10 flex items-center justify-between p-4">
        <button
          onClick={() => navigate("/home")}
          className="bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">AR Mode</span>
          </div>
        </div>

        <button className="bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20">
          <Maximize2 className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="relative w-full max-w-sm aspect-[3/4]">
          <div className="absolute inset-0 border-4 border-white/30 rounded-3xl" />

          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-blue-400 rounded-tl-2xl" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-blue-400 rounded-tr-2xl" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-blue-400 rounded-bl-2xl" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-blue-400 rounded-br-2xl" />

          {isScanning && (
            <>
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div
                  className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"
                  style={{
                    animation: "scan 2s linear infinite",
                  }}
                />
              </div>
              <style>{`
                @keyframes scan {
                  0% { top: 0; }
                  100% { top: 100%; }
                }
              `}</style>
            </>
          )}

          {detected && (
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 w-full">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-3">
                    <Scan className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Lesion Detected</h3>
                  <p className="text-blue-200 text-sm">AI boundary overlay active</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Confidence:</span>
                    <span className="text-white font-semibold">87%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Size:</span>
                    <span className="text-white font-semibold">12mm x 8mm</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Shape:</span>
                    <span className="text-white font-semibold">Irregular</span>
                  </div>
                </div>

                <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{ width: "87%" }}
                  />
                </div>

                <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 mt-4">
                  <p className="text-red-200 text-xs text-center">
                    ⚠️ High severity detected. Please consult a dermatologist.
                  </p>
                </div>
              </div>

              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 300 400"
              >
                <ellipse
                  cx="150"
                  cy="180"
                  rx="60"
                  ry="40"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  opacity="0.8"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="10"
                    dur="0.5s"
                    repeatCount="indefinite"
                  />
                </ellipse>

                <circle cx="150" cy="180" r="3" fill="#ef4444" opacity="0.6" />
                <circle cx="120" cy="165" r="2" fill="#ef4444" opacity="0.6" />
                <circle cx="180" cy="170" r="2" fill="#ef4444" opacity="0.6" />
                <circle cx="135" cy="195" r="2" fill="#ef4444" opacity="0.6" />
                <circle cx="165" cy="200" r="2" fill="#ef4444" opacity="0.6" />
              </svg>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 p-6 space-y-3">
        {!detected && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-4">
            <p className="text-white text-center text-sm">
              {isScanning
                ? "Scanning area with AI detection..."
                : "Position the skin area within the frame. The AR overlay will highlight detected boundaries in real-time."}
            </p>
          </div>
        )}

        {!detected && !isScanning && (
          <button
            onClick={handleStartScan}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl font-semibold shadow-xl flex items-center justify-center gap-3"
          >
            <Camera className="w-5 h-5" />
            Start AR Scan
          </button>
        )}

        {detected && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/analyzing")}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
            >
              Capture & Analyze
            </button>

            <button
              onClick={() => setDetected(false)}
              className="border-2 border-white/50 text-white hover:bg-white/10 py-3 rounded-xl font-semibold"
            >
              Scan Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
