import BottomNav from "../components/BottomNav";
import { Bell, AlertCircle, Lightbulb, Calendar } from "lucide-react";

const mockNotifications = [
  {
    id: 1,
    type: "reminder",
    icon: Calendar,
    title: "Scan Reminder",
    message: "It's been 2 weeks since your last scan. Consider doing a follow-up check.",
    time: "2 hours ago",
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    type: "tip",
    icon: Lightbulb,
    title: "Health Tip",
    message: "Protect your skin from UV rays. Apply sunscreen 15 minutes before going outside.",
    time: "1 day ago",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    id: 3,
    type: "alert",
    icon: AlertCircle,
    title: "Follow-up Suggestion",
    message: "Your scan from May 8 showed high severity. Consider scheduling a dermatologist visit.",
    time: "2 days ago",
    color: "bg-red-100 text-red-600",
  },
  {
    id: 4,
    type: "tip",
    icon: Lightbulb,
    title: "Skin Care Tip",
    message: "Moisturize daily to maintain healthy skin. Look for products with hyaluronic acid.",
    time: "3 days ago",
    color: "bg-green-100 text-green-600",
  },
  {
    id: 5,
    type: "reminder",
    icon: Calendar,
    title: "Monthly Check-In",
    message: "Perform a self-examination of your skin to monitor for any changes.",
    time: "1 week ago",
    color: "bg-purple-100 text-purple-600",
  },
];

export default function Notifications() {
  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6">
        <h1 className="text-white text-2xl font-bold">Notifications</h1>
        <p className="text-blue-100 mt-1">Your health alerts and tips</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-20">
        {mockNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center mt-8">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">No notifications</p>
            <p className="text-gray-400 text-sm">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {mockNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className={`rounded-full p-3 ${notification.color} flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400">{notification.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
