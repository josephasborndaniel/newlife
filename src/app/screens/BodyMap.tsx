import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MapPin, AlertCircle } from "lucide-react";
import BottomNav from "../components/BottomNav";

const bodyParts = [
  { id: "head", x: 50, y: 10, label: "Head", scans: 2 },
  { id: "chest", x: 50, y: 30, label: "Chest", scans: 1 },
  { id: "left-arm", x: 30, y: 35, label: "Left Arm", scans: 3 },
  { id: "right-arm", x: 70, y: 35, label: "Right Arm", scans: 0 },
  { id: "abdomen", x: 50, y: 45, label: "Abdomen", scans: 1 },
  { id: "left-leg", x: 42, y: 70, label: "Left Leg", scans: 1 },
  { id: "right-leg", x: 58, y: 70, label: "Right Leg", scans: 0 },
  { id: "back", x: 50, y: 35, label: "Back", scans: 4 },
];

const scansByBodyPart = {
  head: [
    { id: "1", condition: "Acne", severity: "Low", date: "May 10, 2026" },
    { id: "2", condition: "Sun Damage", severity: "Medium", date: "May 5, 2026" },
  ],
  "left-arm": [
    { id: "3", condition: "Eczema", severity: "Medium", date: "May 8, 2026" },
    { id: "4", condition: "Eczema", severity: "High", date: "May 1, 2026" },
    { id: "5", condition: "Eczema", severity: "Medium", date: "Apr 24, 2026" },
  ],
  back: [
    { id: "6", condition: "Melanoma", severity: "High", date: "May 9, 2026" },
    { id: "7", condition: "Mole Check", severity: "Low", date: "May 2, 2026" },
    { id: "8", condition: "Psoriasis", severity: "Medium", date: "Apr 28, 2026" },
    { id: "9", condition: "Psoriasis", severity: "High", date: "Apr 20, 2026" },
  ],
  chest: [{ id: "10", condition: "Rosacea", severity: "Low", date: "May 7, 2026" }],
  abdomen: [{ id: "11", condition: "Stretch Marks", severity: "Low", date: "May 3, 2026" }],
  "left-leg": [{ id: "12", condition: "Varicose Veins", severity: "Medium", date: "May 6, 2026" }],
};

export default function BodyMap() {
  const navigate = useNavigate();
  const [view, setView] = useState<"front" | "back">("front");
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const selectedScans = selectedPart ? scansByBodyPart[selectedPart as keyof typeof scansByBodyPart] || [] : [];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-orange-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6">
        <button
          onClick={() => navigate("/home")}
          className="mb-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold">Body Map Tracker</h1>
        <p className="text-blue-100 mt-1">Visual overview of all scans</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 p-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setView("front")}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                view === "front"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Front View
            </button>
            <button
              onClick={() => setView("back")}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                view === "back"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Back View
            </button>
          </div>

          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 min-h-[500px]">
            <svg viewBox="0 0 100 100" className="w-full h-full max-w-xs mx-auto">
              <ellipse cx="50" cy="10" rx="8" ry="10" fill="#e0e7ff" stroke="#6366f1" strokeWidth="0.5" />
              <rect x="42" y="20" width="16" height="12" rx="2" fill="#e0e7ff" stroke="#6366f1" strokeWidth="0.5" />
              <rect x="40" y="32" width="20" height="15" rx="2" fill="#e0e7ff" stroke="#6366f1" strokeWidth="0.5" />
              <rect x="38" y="47" width="24" height="20" rx="3" fill="#e0e7ff" stroke="#6366f1" strokeWidth="0.5" />
              <rect x="40" y="67" width="8" height="30" rx="2" fill="#e0e7ff" stroke="#6366f1" strokeWidth="0.5" />
              <rect x="52" y="67" width="8" height="30" rx="2" fill="#e0e7ff" stroke="#6366f1" strokeWidth="0.5" />
              {view === "front" && (
                <>
                  <rect x="25" y="22" width="12" height="25" rx="2" fill="#e0e7ff" stroke="#6366f1" strokeWidth="0.5" />
                  <rect x="63" y="22" width="12" height="25" rx="2" fill="#e0e7ff" stroke="#6366f1" strokeWidth="0.5" />
                </>
              )}

              {bodyParts
                .filter(part =>
                  view === "front"
                    ? !part.id.includes("back")
                    : part.id.includes("back")
                )
                .map((part) => (
                  part.scans > 0 && (
                    <g key={part.id}>
                      <circle
                        cx={part.x}
                        cy={part.y}
                        r="5"
                        fill={selectedPart === part.id ? "#3b82f6" : "#ef4444"}
                        opacity="0.8"
                        className="cursor-pointer hover:opacity-100"
                        onClick={() => setSelectedPart(part.id)}
                      />
                      <text
                        x={part.x}
                        y={part.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-[0.3rem] font-bold fill-white pointer-events-none"
                      >
                        {part.scans}
                      </text>
                    </g>
                  )
                ))}
            </svg>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 text-xs flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>Scan Locations</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center mt-4">
            Tap on markers to view scan details
          </p>
        </div>

        {selectedPart && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {bodyParts.find(p => p.id === selectedPart)?.label} Scans
              </h3>
              <button
                onClick={() => setSelectedPart(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>

            {selectedScans.length > 0 ? (
              <div className="space-y-3">
                {selectedScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/scan/${scan.id}`)}
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{scan.condition}</p>
                      <p className="text-sm text-gray-500">{scan.date}</p>
                    </div>
                    <span className={`px-3 py-1 ${getSeverityColor(scan.severity)} text-white text-xs font-semibold rounded-full`}>
                      {scan.severity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No scans for this area</p>
              </div>
            )}
          </div>
        )}

        {!selectedPart && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-900 mb-1">Track All Areas</p>
                <p className="text-blue-800 text-sm leading-relaxed">
                  Regular full-body checks help detect changes early. Scan different body areas monthly.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
