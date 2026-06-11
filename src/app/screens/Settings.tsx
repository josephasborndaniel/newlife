import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";
import {
  ArrowLeft,
  Bell,
  Moon,
  Database,
  Globe,
  Shield,
  FileText,
  LogOut,
  ChevronRight,
  Info,
} from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6">
        <button
          onClick={() => navigate("/profile")}
          className="mb-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold">Settings</h1>
        <p className="text-blue-100 mt-1">Manage your app preferences</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Notifications</p>
                <p className="text-sm text-gray-500">Receive scan reminders and tips</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                notifications ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="border-t border-gray-100" />

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 rounded-full p-2">
                <Moon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Dark Mode</p>
                <p className="text-sm text-gray-500">Use dark theme</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                darkMode ? "bg-purple-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  darkMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="border-t border-gray-100" />

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <Database className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Data Sharing</p>
                <p className="text-sm text-gray-500">Help improve AI accuracy</p>
              </div>
            </div>
            <button
              onClick={() => setDataSharing(!dataSharing)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                dataSharing ? "bg-green-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  dataSharing ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <button
            onClick={() => navigate("/languages")}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 rounded-full p-2">
                <Globe className="w-5 h-5 text-orange-600" />
              </div>
              <p className="font-semibold text-gray-900">Language</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">English</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>

          <div className="border-t border-gray-100" />

          <button
            onClick={() => navigate("/about")}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <p className="font-semibold text-gray-900">About & Help</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <div className="border-t border-gray-100" />

          <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 rounded-full p-2">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <p className="font-semibold text-gray-900">Privacy Policy</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <div className="border-t border-gray-100" />

          <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <p className="font-semibold text-gray-900">Terms of Service</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
