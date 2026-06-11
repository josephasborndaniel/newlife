import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useScans } from "../context/ScanContext";
import BottomNav from "../components/BottomNav";
import { Scan, AlertCircle, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { scans } = useScans();
  const [showQuizPrompt, setShowQuizPrompt] = useState(false);

  useEffect(() => {
    const skinProfile = localStorage.getItem("skinscan_skin_profile");
    if (!skinProfile) {
      setShowQuizPrompt(true);
    }
  }, []);

  const recentScans = scans.slice(0, 3);
  const totalScans = scans.length;
  const conditionsDetected = new Set(scans.map(s => s.condition)).size;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "text-red-600 bg-red-50";
      case "Medium": return "text-orange-600 bg-orange-50";
      case "Low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto pb-20">
        {showQuizPrompt && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 mx-6 mt-6 p-6 rounded-2xl shadow-xl text-white">
            <h3 className="text-xl font-bold mb-2">Complete Your Skin Profile</h3>
            <p className="text-blue-100 mb-4 text-sm">
              Take a quick 2-minute quiz to personalize your scan results and skincare advice for your specific skin type.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/skin-quiz")}
                className="bg-white hover:bg-gray-100 text-blue-600 px-6 py-2 rounded-xl font-semibold"
              >
                Start Quiz
              </button>
              <button
                onClick={() => setShowQuizPrompt(false)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl font-semibold"
              >
                Later
              </button>
            </div>
          </div>
        )}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 pb-12 rounded-b-3xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-blue-100 text-sm">Welcome back,</p>
              <h1 className="text-white text-2xl font-bold">{user?.name || "User"}</h1>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <Scan className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-100" />
                <p className="text-blue-100 text-sm">Total Scans</p>
              </div>
              <p className="text-white text-3xl font-bold">{totalScans}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-blue-100" />
                <p className="text-blue-100 text-sm">Conditions</p>
              </div>
              <p className="text-white text-3xl font-bold">{conditionsDetected}</p>
            </div>
          </div>
        </div>

        <div className="px-6 -mt-6">
          <button
            onClick={() => navigate("/camera")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl font-semibold shadow-xl flex items-center justify-center gap-3"
          >
            <Scan className="w-6 h-6" />
            Start New Scan
          </button>
        </div>

        <div className="px-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Smart Features</h2>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              onClick={() => navigate("/timeline")}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="bg-blue-100 rounded-xl p-2 w-fit mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="font-semibold text-gray-900 text-sm">Timeline</p>
              <p className="text-xs text-gray-500 mt-1">Track progress</p>
            </button>

            <button
              onClick={() => navigate("/weather")}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="bg-purple-100 rounded-xl p-2 w-fit mb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <p className="font-semibold text-gray-900 text-sm">Weather</p>
              <p className="text-xs text-gray-500 mt-1">Correlations</p>
            </button>

            <button
              onClick={() => navigate("/routine")}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="bg-pink-100 rounded-xl p-2 w-fit mb-2">
                <Scan className="w-5 h-5 text-pink-600" />
              </div>
              <p className="font-semibold text-gray-900 text-sm">Skincare</p>
              <p className="text-xs text-gray-500 mt-1">Routine</p>
            </button>

            <button
              onClick={() => navigate("/body-map")}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="bg-green-100 rounded-xl p-2 w-fit mb-2">
                <AlertCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="font-semibold text-gray-900 text-sm">Body Map</p>
              <p className="text-xs text-gray-500 mt-1">All areas</p>
            </button>

            <button
              onClick={() => navigate("/ai-chat")}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="bg-indigo-100 rounded-xl p-2 w-fit mb-2">
                <Scan className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="font-semibold text-gray-900 text-sm">AI Chat</p>
              <p className="text-xs text-gray-500 mt-1">Ask questions</p>
            </button>

            <button
              onClick={() => navigate("/family")}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="bg-orange-100 rounded-xl p-2 w-fit mb-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <p className="font-semibold text-gray-900 text-sm">Family</p>
              <p className="text-xs text-gray-500 mt-1">Profiles</p>
            </button>

            <button
              onClick={() => navigate("/heatmap")}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="bg-red-100 rounded-xl p-2 w-fit mb-2">
                <Scan className="w-5 h-5 text-red-600" />
              </div>
              <p className="font-semibold text-gray-900 text-sm">Heatmap</p>
              <p className="text-xs text-gray-500 mt-1">Regional data</p>
            </button>

            <button
              onClick={() => navigate("/ar-overlay")}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="bg-cyan-100 rounded-xl p-2 w-fit mb-2">
                <Scan className="w-5 h-5 text-cyan-600" />
              </div>
              <p className="font-semibold text-gray-900 text-sm">AR Mode</p>
              <p className="text-xs text-gray-500 mt-1">Live overlay</p>
            </button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Scans</h2>
            <button
              onClick={() => navigate("/history")}
              className="text-blue-600 text-sm font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          {recentScans.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <Scan className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No scans yet</p>
              <p className="text-gray-400 text-sm mt-1">Start your first scan to see results here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentScans.map((scan) => (
                <button
                  key={scan.id}
                  onClick={() => navigate(`/scan/${scan.id}`)}
                  className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
                >
                  <img
                    src={scan.image}
                    alt={scan.condition}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">{scan.condition}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        {format(new Date(scan.date), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(scan.severity)}`}>
                    {scan.severity}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
