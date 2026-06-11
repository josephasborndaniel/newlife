import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Scan } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Splash() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          navigate("/home");
        } else {
          const hasSeenOnboarding = localStorage.getItem("skinscan_onboarding_complete");
          navigate(hasSeenOnboarding ? "/login" : "/onboarding");
        }
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [navigate, isAuthenticated, isLoading]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="bg-white rounded-full p-8 mb-6 shadow-2xl">
        <Scan className="w-20 h-20 text-blue-600" strokeWidth={2} />
      </div>
      <h1 className="text-5xl font-bold text-white mb-3">SkinScan AI</h1>
      <p className="text-xl text-blue-100">Your Smart Skin Health Assistant</p>
    </div>
  );
}
