import { useParams, useNavigate } from "react-router";
import { useScans } from "../context/ScanContext";
import { ArrowLeft, AlertCircle, Calendar, MapPin as MapPinIcon, Activity } from "lucide-react";
import { format } from "date-fns";

export default function ScanDetail() {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const { getScan } = useScans();

  const scan = getScan(scanId || "");

  if (!scan) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Scan not found</p>
          <button
            onClick={() => navigate("/history")}
            className="mt-4 text-blue-600 font-semibold hover:underline"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "from-red-500 to-red-600";
      case "Medium": return "from-orange-500 to-orange-600";
      case "Low": return "from-green-500 to-green-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "High": return "bg-red-50 text-red-700";
      case "Medium": return "bg-orange-50 text-orange-700";
      case "Low": return "bg-green-50 text-green-700";
      default: return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className={`bg-gradient-to-br ${getSeverityColor(scan.severity)} p-6 pb-8`}>
        <button
          onClick={() => navigate("/history")}
          className="mb-6 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <h1 className="text-white text-3xl font-bold mb-2">
          {scan.condition}
        </h1>
        <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${getSeverityBg(scan.severity)}`}>
          {scan.severity} Severity
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <img
            src={scan.image}
            alt={scan.condition}
            className="w-full aspect-square object-cover rounded-xl mb-6"
          />

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 font-medium">Confidence Level</span>
                <span className="text-2xl font-bold text-gray-900">{scan.confidence}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`bg-gradient-to-r ${getSeverityColor(scan.severity)} h-full rounded-full`}
                  style={{ width: `${scan.confidence}%` }}
                />
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-gray-700 leading-relaxed">
                {scan.description}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Scan Metadata</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Scan ID</p>
                <p className="font-semibold text-gray-900">{scan.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-purple-100 rounded-full p-2">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Scan Date & Time</p>
                <p className="font-semibold text-gray-900">
                  {format(new Date(scan.date), "MMMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <MapPinIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Body Area</p>
                <p className="font-semibold text-gray-900">{scan.bodyArea || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate(`/advice/${scan.id}`)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl font-semibold shadow-lg"
        >
          View Recommendations
        </button>
      </div>
    </div>
  );
}
