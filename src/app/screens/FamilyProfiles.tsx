import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, User, Calendar, TrendingUp } from "lucide-react";
import BottomNav from "../components/BottomNav";

const mockFamilyMembers = [
  {
    id: "1",
    name: "John Doe",
    relation: "Self",
    age: 34,
    avatar: "👨",
    totalScans: 12,
    lastScan: "2 days ago",
    activeConditions: ["Eczema"],
  },
  {
    id: "2",
    name: "Sarah Doe",
    relation: "Spouse",
    age: 32,
    avatar: "👩",
    totalScans: 8,
    lastScan: "1 week ago",
    activeConditions: ["Acne", "Rosacea"],
  },
  {
    id: "3",
    name: "Emma Doe",
    relation: "Daughter",
    age: 7,
    avatar: "👧",
    totalScans: 5,
    lastScan: "3 days ago",
    activeConditions: ["Eczema"],
  },
  {
    id: "4",
    name: "Robert Doe Sr.",
    relation: "Father",
    age: 68,
    avatar: "👴",
    totalScans: 15,
    lastScan: "5 days ago",
    activeConditions: ["Psoriasis", "Melanoma Risk"],
  },
];

export default function FamilyProfiles() {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState(mockFamilyMembers[0].id);

  const activeMember = mockFamilyMembers.find(m => m.id === selectedMember);

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6">
        <button
          onClick={() => navigate("/home")}
          className="mb-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold">Family Profiles</h1>
        <p className="text-blue-100 mt-1">Manage your family's skin health</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 p-6 space-y-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {mockFamilyMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => setSelectedMember(member.id)}
              className={`flex-shrink-0 p-4 rounded-2xl transition-all ${
                selectedMember === member.id
                  ? "bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg"
                  : "bg-white shadow-sm hover:shadow-md"
              }`}
            >
              <div className="flex flex-col items-center gap-2 w-20">
                <div className={`text-4xl ${selectedMember === member.id ? "scale-110" : ""} transition-transform`}>
                  {member.avatar}
                </div>
                <div className="text-center">
                  <p className={`text-sm font-semibold ${
                    selectedMember === member.id ? "text-white" : "text-gray-900"
                  }`}>
                    {member.name.split(' ')[0]}
                  </p>
                  <p className={`text-xs ${
                    selectedMember === member.id ? "text-blue-100" : "text-gray-500"
                  }`}>
                    {member.relation}
                  </p>
                </div>
              </div>
            </button>
          ))}

          <button className="flex-shrink-0 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md border-2 border-dashed border-gray-300 transition-all">
            <div className="flex flex-col items-center justify-center gap-2 w-20 h-full">
              <Plus className="w-8 h-8 text-gray-400" />
              <p className="text-xs text-gray-500 text-center">Add Member</p>
            </div>
          </button>
        </div>

        {activeMember && (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-6xl">{activeMember.avatar}</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{activeMember.name}</h2>
                  <p className="text-gray-600">{activeMember.relation}</p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{activeMember.age} years old</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-gray-600">Total Scans</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{activeMember.totalScans}</p>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <p className="text-sm text-gray-600">Last Scan</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{activeMember.lastScan}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Active Conditions</h3>

              {activeMember.activeConditions.length > 0 ? (
                <div className="space-y-3">
                  {activeMember.activeConditions.map((condition, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                      <span className="font-semibold text-gray-900">{condition}</span>
                      <button className="text-sm text-blue-600 font-semibold hover:underline">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No active conditions</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/camera")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl font-semibold shadow-lg"
              >
                New Scan
              </button>

              <button
                onClick={() => navigate("/history")}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-4 rounded-2xl font-semibold"
              >
                View History
              </button>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
