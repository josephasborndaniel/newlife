import { useParams, useNavigate } from "react-router";
import { useScans } from "../context/ScanContext";
import { ArrowLeft, AlertCircle, Info, Lightbulb, MapPin, Download, Share2 } from "lucide-react";
import { useState } from "react";
import { getAdvice } from "../../lib/adviceData";

export default function Results() {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const { getScan } = useScans();
  const [activeTab, setActiveTab] = useState<"results" | "details" | "advice">("results");

  const scan = getScan(scanId || "");

  if (!scan) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Scan not found</p>
          <button
            onClick={() => navigate("/home")}
            className="mt-4 text-blue-600 font-semibold hover:underline"
          >
            Return to Home
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

  const handleExportPDF = () => {
    alert("PDF report generated! In a production app, this would download a professional medical report with your scan details, diagnosis, and recommendations.");
  };

  const handleShare = () => {
    alert("Share options: Email to doctor, Save to files, or Print report");
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className={`bg-gradient-to-br ${getSeverityColor(scan.severity)} p-6 pb-8`}>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/home")}
            className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
            >
              <Share2 className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
            >
              <Download className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <h1 className="text-white text-3xl font-bold mb-2">
          {scan.condition}
        </h1>
        <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${getSeverityBg(scan.severity)}`}>
          {scan.severity} Severity
        </span>
      </div>

      <div className="flex border-b border-gray-200 bg-white">
        {["results", "details", "advice"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`flex-1 py-4 font-semibold capitalize ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === "results" && (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <img
                src={scan.image}
                alt={scan.condition}
                className="w-full aspect-square object-cover rounded-xl mb-4"
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
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 leading-relaxed">
                      {scan.description}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50/40 border border-blue-100/60 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
                  <span className="font-bold block mb-1">🔬 Clinical Dataset Calibration</span>
                  This visual classifier evaluates live camera captures against diagnostic thresholds calibrated from the academic <strong>ISIC Archive</strong> and the <strong>HAM10000 dataset</strong> (10,000+ biopsy-verified dermoscopic lesion images).
                </div>
              </div>
            </div>

            {scan.metrics && (
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  Clinical ABCD Metrics Analysis
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  These metrics represent mathematical computer vision calculations performed on the lesion's pixel structure to assess asymmetry, border irregularity, color variegation, and approximate size.
                </p>
                <div className="space-y-3.5 pt-2">
                  {/* Asymmetry */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="text-gray-700 font-semibold">A - Asymmetry Variance</span>
                      <span className="font-bold text-gray-900">{scan.metrics.asymmetry}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-blue-600 h-full rounded-full"
                        style={{ width: `${scan.metrics.asymmetry}%` }}
                      />
                    </div>
                  </div>

                  {/* Border */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="text-gray-700 font-semibold">B - Border Irregularity</span>
                      <span className="font-bold text-gray-900">{scan.metrics.border}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full"
                        style={{ width: `${scan.metrics.border}%` }}
                      />
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="text-gray-700 font-semibold">C - Color Variegation</span>
                      <span className="font-bold text-gray-900">{scan.metrics.color}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full"
                        style={{ width: `${scan.metrics.color}%` }}
                      />
                    </div>
                  </div>

                  {/* Diameter */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="text-gray-700 font-semibold">D - Diameter Estimate</span>
                      <span className="font-bold text-gray-900">{scan.metrics.diameter}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-pink-500 h-full rounded-full"
                        style={{ width: `${scan.metrics.diameter}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "details" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Scan ID</span>
              <span className="font-semibold text-gray-900">{scan.id}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Date</span>
              <span className="font-semibold text-gray-900">{scan.date}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Body Area</span>
              <span className="font-semibold text-gray-900">{scan.bodyArea || "Not specified"}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Confidence</span>
              <span className="font-semibold text-gray-900">{scan.confidence}%</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600">Severity</span>
              <span className={`font-semibold px-3 py-1 rounded-full ${getSeverityBg(scan.severity)}`}>
                {scan.severity}
              </span>
            </div>
          </div>
        )}

        {activeTab === "advice" && (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <Lightbulb className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Recommendations</h3>
              </div>

              <div className="space-y-3">
                {getAdvice(scan.condition).recommendations.map((advice, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-0.5">{advice}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate("/map")}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-3"
            >
              <MapPin className="w-5 h-5" />
              Find Nearby Clinic
            </button>
          </>
        )}
      </div>
    </div>
  );
}
