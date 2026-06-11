import { useNavigate } from "react-router";
import { useScans } from "../context/ScanContext";
import BottomNav from "../components/BottomNav";
import { Calendar, Scan as ScanIcon } from "lucide-react";
import { format } from "date-fns";

export default function History() {
  const navigate = useNavigate();
  const { scans } = useScans();

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
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6">
        <h1 className="text-white text-2xl font-bold">Scan History</h1>
        <p className="text-blue-100 mt-1">All your previous scans</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-20">
        {scans.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center mt-8">
            <ScanIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">No scans yet</p>
            <p className="text-gray-400 text-sm mb-6">
              Start your first scan to see your history here
            </p>
            <button
              onClick={() => navigate("/camera")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Start New Scan
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {scans.map((scan) => (
              <button
                key={scan.id}
                onClick={() => navigate(`/scan/${scan.id}`)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
              >
                <img
                  src={scan.image}
                  alt={scan.condition}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 text-left min-w-0">
                  <h3 className="font-bold text-gray-900 mb-1 truncate">
                    {scan.condition}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <p className="text-sm text-gray-500">
                      {format(new Date(scan.date), "MMM d, yyyy")}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {scan.bodyArea || "Body area not specified"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(
                      scan.severity
                    )}`}
                  >
                    {scan.severity}
                  </span>
                  <span className="text-sm font-semibold text-gray-600">
                    {scan.confidence}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
