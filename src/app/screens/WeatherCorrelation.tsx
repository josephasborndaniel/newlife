import { useNavigate } from "react-router";
import { ArrowLeft, Cloud, Droplets, Sun, Wind, AlertTriangle } from "lucide-react";
import BottomNav from "../components/BottomNav";

const weatherInsights = [
  {
    condition: "Eczema",
    icon: Droplets,
    correlation: "High",
    trigger: "Humidity below 40%",
    frequency: "3× more flare-ups",
    color: "from-blue-500 to-cyan-500",
  },
  {
    condition: "Psoriasis",
    icon: Sun,
    correlation: "Medium",
    trigger: "UV index above 7",
    frequency: "2× more irritation",
    color: "from-orange-500 to-red-500",
  },
  {
    condition: "Rosacea",
    icon: Wind,
    correlation: "High",
    trigger: "Temperature above 30°C",
    frequency: "4× more redness",
    color: "from-rose-500 to-pink-500",
  },
];

const weeklyWeather = [
  { day: "Mon", temp: 28, humidity: 65, uv: 6 },
  { day: "Tue", temp: 30, humidity: 42, uv: 8 },
  { day: "Wed", temp: 27, humidity: 38, uv: 5 },
  { day: "Thu", temp: 29, humidity: 55, uv: 7 },
  { day: "Fri", temp: 31, humidity: 35, uv: 9 },
  { day: "Sat", temp: 26, humidity: 70, uv: 4 },
  { day: "Sun", temp: 28, humidity: 60, uv: 6 },
];

export default function WeatherCorrelation() {
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
        <h1 className="text-white text-2xl font-bold">Weather Correlation</h1>
        <p className="text-blue-100 mt-1">How weather affects your skin</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 p-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <Cloud className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Today's Weather</h3>
              <p className="text-sm text-gray-500">San Francisco, CA</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <Sun className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">28°C</p>
              <p className="text-xs text-gray-600 mt-1">Temperature</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <Droplets className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">65%</p>
              <p className="text-xs text-gray-600 mt-1">Humidity</p>
            </div>

            <div className="bg-red-50 rounded-xl p-4 text-center">
              <Sun className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">6</p>
              <p className="text-xs text-gray-600 mt-1">UV Index</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-900 mb-1">Weather Alert</p>
              <p className="text-amber-800 text-sm leading-relaxed">
                Humidity dropping to 38% on Wednesday. Based on your history, this may trigger eczema flare-ups.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Correlations</h3>

          <div className="space-y-4">
            {weatherInsights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-start gap-4">
                    <div className={`bg-gradient-to-br ${insight.color} rounded-xl p-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{insight.condition}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Trigger:</span>
                          <span className="font-semibold text-gray-900">{insight.trigger}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Impact:</span>
                          <span className="font-semibold text-gray-900">{insight.frequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Correlation:</span>
                          <span className={`font-semibold ${
                            insight.correlation === "High" ? "text-red-600" : "text-orange-600"
                          }`}>
                            {insight.correlation}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">7-Day Forecast</h3>

          <div className="space-y-3">
            {weeklyWeather.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="font-semibold text-gray-900 w-12">{day.day}</div>

                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Sun className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-700">{day.temp}°C</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700">{day.humidity}%</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Sun className="w-4 h-4 text-red-500" />
                    <span className="text-gray-700">UV {day.uv}</span>
                  </div>
                </div>

                {(day.humidity < 40 || day.uv > 7) && (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
