import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useScans } from "../context/ScanContext";
import BottomNav from "../components/BottomNav";
import { User, Mail, Calendar, Edit2, TrendingUp, AlertCircle, Settings } from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { scans } = useScans();

  const totalScans = scans.length;
  const mostCommonCondition = scans.length > 0
    ? scans
        .map(s => s.condition)
        .reduce((acc, condition) => {
          acc[condition] = (acc[condition] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
    : {};

  const topCondition = Object.entries(mostCommonCondition)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || "None";

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 pb-20 flex justify-between items-start">
        <div>
          <h1 className="text-white text-2xl font-bold">Profile</h1>
          <p className="text-blue-100 mt-1">Your account information</p>
        </div>
        <button
          onClick={() => navigate("/settings")}
          className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 hover:bg-white/30 text-white shadow-md transition-all"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto -mt-12 px-6 pb-24">
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600 text-sm">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/edit-profile")}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-purple-100 rounded-full p-2">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium text-gray-900">
                  {user?.dateOfBirth
                    ? format(new Date(user.dateOfBirth), "MMMM d, yyyy")
                    : "Not set"}
                </p>
              </div>
            </div>

            {user?.gender && (
              <div className="flex items-center gap-3">
                <div className="bg-green-100 rounded-full p-2">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium text-gray-900">{user.gender}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Statistics</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-gray-600">Total Scans</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{totalScans}</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-gray-600">Top Condition</p>
              </div>
              <p className="text-sm font-bold text-gray-900 truncate">
                {topCondition}
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
