import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Calendar, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { format, subDays } from "date-fns";
import BottomNav from "../components/BottomNav";

const mockTimelineData = [
  {
    date: new Date().toISOString().split('T')[0],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400",
    severity: 65,
    notes: "Slight improvement noticed",
  },
  {
    date: subDays(new Date(), 7).toISOString().split('T')[0],
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    severity: 72,
    notes: "Applied new treatment",
  },
  {
    date: subDays(new Date(), 14).toISOString().split('T')[0],
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400",
    severity: 78,
    notes: "Redness increased",
  },
  {
    date: subDays(new Date(), 21).toISOString().split('T')[0],
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
    severity: 68,
    notes: "Initial scan",
  },
];

export default function Timeline() {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const trend = mockTimelineData[0].severity < mockTimelineData[mockTimelineData.length - 1].severity
    ? "improving"
    : mockTimelineData[0].severity > mockTimelineData[mockTimelineData.length - 1].severity
    ? "worsening"
    : "stable";

  const TrendIcon = trend === "improving" ? TrendingDown : trend === "worsening" ? TrendingUp : Minus;
  const trendColor = trend === "improving" ? "text-green-600 bg-green-50" : trend === "worsening" ? "text-red-600 bg-red-50" : "text-gray-600 bg-gray-50";
  const trendText = trend === "improving" ? "Improving" : trend === "worsening" ? "Worsening" : "Stable";

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6">
        <button
          onClick={() => navigate("/home")}
          className="mb-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold">Skin Health Timeline</h1>
        <p className="text-blue-100 mt-1">Track your condition over time</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 p-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Trend Analysis</h3>
            <span className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${trendColor}`}>
              <TrendIcon className="w-5 h-5" />
              {trendText}
            </span>
          </div>

          <div className="relative h-48 mb-6">
            <svg className="w-full h-full" viewBox="0 0 400 150">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>

              <polyline
                points={mockTimelineData.map((point, i) => {
                  const x = (i / (mockTimelineData.length - 1)) * 380 + 10;
                  const y = 140 - (point.severity / 100) * 120;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {mockTimelineData.map((point, i) => {
                const x = (i / (mockTimelineData.length - 1)) * 380 + 10;
                const y = 140 - (point.severity / 100) * 120;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="6"
                    fill={i === selectedIndex ? "#3b82f6" : "#fff"}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => setSelectedIndex(i)}
                  />
                );
              })}

              <line x1="10" y1="140" x2="390" y2="140" stroke="#e5e7eb" strokeWidth="1" />
            </svg>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs text-gray-500">
            {mockTimelineData.map((point, i) => (
              <div key={i}>
                {format(new Date(point.date), "MMM d")}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Selected Scan</h3>

          <div className="space-y-4">
            <img
              src={mockTimelineData[selectedIndex].image}
              alt="Scan"
              className="w-full aspect-square object-cover rounded-xl"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Date</p>
                <p className="font-bold text-gray-900">
                  {format(new Date(mockTimelineData[selectedIndex].date), "MMM d, yyyy")}
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Severity</p>
                <p className="font-bold text-gray-900">{mockTimelineData[selectedIndex].severity}%</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-semibold text-gray-700">Notes</p>
              </div>
              <p className="text-gray-600">{mockTimelineData[selectedIndex].notes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Before & After</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Initial</p>
              <img
                src={mockTimelineData[mockTimelineData.length - 1].image}
                alt="Before"
                className="w-full aspect-square object-cover rounded-xl"
              />
              <p className="text-center mt-2 text-sm text-gray-600">
                {mockTimelineData[mockTimelineData.length - 1].severity}% severity
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Current</p>
              <img
                src={mockTimelineData[0].image}
                alt="After"
                className="w-full aspect-square object-cover rounded-xl"
              />
              <p className="text-center mt-2 text-sm text-gray-600">
                {mockTimelineData[0].severity}% severity
              </p>
            </div>
          </div>

          <div className="mt-4 bg-green-50 rounded-xl p-4 text-center">
            <p className="text-green-700 font-semibold">
              {Math.abs(mockTimelineData[0].severity - mockTimelineData[mockTimelineData.length - 1].severity)}%
              {trend === "improving" ? " improvement" : trend === "worsening" ? " increase" : " change"} over {mockTimelineData.length} scans
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
