import { useNavigate } from "react-router";
import { ArrowLeft, MapPin, TrendingUp, Users } from "lucide-react";
import BottomNav from "../components/BottomNav";

const regionData = [
  { city: "San Francisco, CA", condition: "Eczema", cases: 1247, trend: "+12%", lat: 37.7749, lng: -122.4194 },
  { city: "Los Angeles, CA", condition: "Acne", cases: 2156, trend: "+8%", lat: 34.0522, lng: -118.2437 },
  { city: "New York, NY", condition: "Psoriasis", cases: 1876, trend: "+15%", lat: 40.7128, lng: -74.0060 },
  { city: "Chicago, IL", condition: "Rosacea", cases: 1432, trend: "+6%", lat: 41.8781, lng: -87.6298 },
  { city: "Houston, TX", condition: "Melanoma", cases: 987, trend: "+22%", lat: 29.7604, lng: -95.3698 },
  { city: "Phoenix, AZ", condition: "Sun Damage", cases: 2341, trend: "+18%", lat: 33.4484, lng: -112.0740 },
  { city: "Miami, FL", condition: "Fungal Infection", cases: 1654, trend: "+9%", lat: 25.7617, lng: -80.1918 },
  { city: "Seattle, WA", condition: "Eczema", cases: 1123, trend: "+11%", lat: 47.6062, lng: -122.3321 },
];

const topConditions = [
  { condition: "Acne Vulgaris", count: 8432, color: "from-blue-500 to-blue-600" },
  { condition: "Eczema", count: 6821, color: "from-purple-500 to-purple-600" },
  { condition: "Psoriasis", count: 5234, color: "from-pink-500 to-pink-600" },
  { condition: "Melanoma", count: 4567, color: "from-red-500 to-red-600" },
  { condition: "Rosacea", count: 3891, color: "from-orange-500 to-orange-600" },
];

export default function Heatmap() {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6">
        <button
          onClick={() => navigate("/home")}
          className="mb-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold">Disease Heatmap</h1>
        <p className="text-blue-100 mt-1">Regional skin health insights</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 p-6 space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">Anonymous Data Only</p>
              <p className="text-blue-800 text-sm leading-relaxed">
                All data is aggregated and anonymized. Individual scans cannot be identified or traced.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">United States Heatmap</h3>

          <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl h-64 mb-4 overflow-hidden">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              {regionData.map((region, index) => {
                const x = ((region.lng + 125) / 60) * 400;
                const y = ((50 - region.lat) / 25) * 200;
                const size = Math.log(region.cases) * 8;

                return (
                  <g key={index}>
                    <circle
                      cx={x}
                      cy={y}
                      r={size}
                      fill="#ef4444"
                      opacity="0.3"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={size / 2}
                      fill="#dc2626"
                      opacity="0.5"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={4}
                      fill="#991b1b"
                    />
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-200" />
                  <span>Low</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-800" />
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Bubble size represents number of reported cases
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Conditions Nationwide</h3>

          <div className="space-y-3">
            {topConditions.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-gray-900">{item.condition}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">{item.count.toLocaleString()} cases</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${item.color} h-full rounded-full`}
                    style={{ width: `${(item.count / topConditions[0].count) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Regional Breakdown</h3>

          <div className="space-y-3">
            {regionData.map((region, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{region.city}</p>
                    <p className="text-sm text-gray-600">{region.condition}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-900">{region.cases}</p>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>{region.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
