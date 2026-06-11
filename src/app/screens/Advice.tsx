import { useParams, useNavigate } from "react-router";
import { useScans } from "../context/ScanContext";
import { ArrowLeft, Lightbulb, MapPin, AlertCircle } from "lucide-react";
import { getAdvice } from "../../lib/adviceData";

export default function Advice() {
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
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold">
          Advice & Recommendations
        </h1>
        <p className="text-blue-100 mt-1">
          For {scan.condition}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <Lightbulb className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Action Steps</h3>
          </div>

          <div className="space-y-4">
            {getAdvice(scan.condition).recommendations.map((advice, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <p className="text-gray-700 pt-1 leading-relaxed">{advice}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-900 mb-1">Important Notice</p>
              <p className="text-amber-800 text-sm leading-relaxed">
                This AI analysis is for informational purposes only and does not replace professional medical advice.
                Always consult with a qualified dermatologist for accurate diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/map")}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-3"
        >
          <MapPin className="w-5 h-5" />
          Find Nearby Clinic
        </button>
      </div>
    </div>
  );
}
