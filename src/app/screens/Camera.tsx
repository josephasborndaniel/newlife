import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Camera as CameraIcon, Image as ImageIcon, X, Flashlight, FlipHorizontal, Scan } from "lucide-react";

export default function Camera() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [hasCameraAccess, setHasCameraAccess] = useState<boolean | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start the actual live camera stream on mount
  useEffect(() => {
    if (selectedImage) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [facingMode, selectedImage]);

  const startCamera = async () => {
    stopCamera();
    try {
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCameraAccess(true);
    } catch (err) {
      console.error("Camera access failed", err);
      setHasCameraAccess(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw the current video frame onto the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setSelectedImage(dataUrl);
        stopCamera();
      }
    } else {
      // Fallback if video isn't loaded
      const mockImage = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400";
      setSelectedImage(mockImage);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFlipCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  const handleAnalyze = () => {
    if (selectedImage) {
      navigate("/analyzing", { state: { image: selectedImage } });
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-black">
      {/* Top Controls Header */}
      <div className="flex items-center justify-between p-4 z-10">
        <button
          onClick={() => {
            stopCamera();
            navigate("/home");
          }}
          className="bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => {
              stopCamera();
              navigate("/ar-overlay");
            }}
            className="bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20"
          >
            <Scan className="w-6 h-6 text-white" />
          </button>
          {!selectedImage && hasCameraAccess && (
            <button
              onClick={handleFlipCamera}
              className="bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20"
              title="Flip Camera"
            >
              <FlipHorizontal className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Frame / Live Stream Area */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {selectedImage ? (
          <div className="relative w-full max-w-sm">
            <img
              src={selectedImage}
              alt="Selected Capture"
              className="w-full rounded-3xl shadow-2xl object-cover aspect-[3/4]"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        ) : (
          <div className="relative w-full max-w-sm aspect-[3/4] border-4 border-white/30 border-dashed rounded-3xl flex items-center justify-center overflow-hidden bg-zinc-950">
            {hasCameraAccess ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="text-center text-white/60 p-4">
                <CameraIcon className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                <p className="text-sm">
                  {hasCameraAccess === false
                    ? "Camera blocked. Upload from gallery instead."
                    : "Accessing device camera..."}
                </p>
              </div>
            )}
            {/* Viewfinder Target Overlays */}
            <div className="absolute inset-0 border-[24px] border-black/30 pointer-events-none rounded-2xl" />
            <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl pointer-events-none" />
            <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl pointer-events-none" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl pointer-events-none" />
          </div>
        )}
      </div>

      {/* Action panel */}
      <div className="p-6 space-y-3">
        <p className="text-center text-white/60 text-sm mb-4">
          {selectedImage
            ? "Review your image and tap analyze to continue"
            : "Ensure good lighting and align skin spot inside the frame"}
        </p>

        {selectedImage ? (
          <button
            onClick={handleAnalyze}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl font-semibold shadow-xl"
          >
            Analyze Skin Condition
          </button>
        ) : (
          <>
            {hasCameraAccess && (
              <button
                onClick={handleCapture}
                className="w-full bg-white hover:bg-gray-100 text-gray-900 py-4 rounded-2xl font-semibold shadow-xl flex items-center justify-center gap-3"
              >
                <CameraIcon className="w-5 h-5" />
                Take Photo
              </button>
            )}

            <button
              onClick={handleUpload}
              className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3"
            >
              <ImageIcon className="w-5 h-5" />
              Upload from Gallery
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </>
        )}
      </div>
    </div>
  );
}
