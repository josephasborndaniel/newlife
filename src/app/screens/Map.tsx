import { useNavigate } from "react-router";
import { ArrowLeft, MapPin, Phone, Navigation, Star } from "lucide-react";
import BottomNav from "../components/BottomNav";

const mockClinics = [
  {
    id: 1,
    name: "SkinCare Medical Center",
    distance: "0.8 mi",
    rating: 4.8,
    address: "123 Health Ave, Suite 200",
    phone: "(555) 123-4567",
  },
  {
    id: 2,
    name: "Advanced Dermatology Clinic",
    distance: "1.2 mi",
    rating: 4.9,
    address: "456 Medical Plaza, Floor 3",
    phone: "(555) 234-5678",
  },
  {
    id: 3,
    name: "Clear Skin Specialists",
    distance: "1.5 mi",
    rating: 4.7,
    address: "789 Wellness Blvd",
    phone: "(555) 345-6789",
  },
  {
    id: 4,
    name: "Metro Dermatology Associates",
    distance: "2.1 mi",
    rating: 4.6,
    address: "321 Care Street",
    phone: "(555) 456-7890",
  },
];

export default function Map() {
  const navigate = useNavigate();

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleDirections = (address: string) => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank');
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold">Nearby Clinics</h1>
        <p className="text-blue-100 mt-1">Dermatology specialists near you</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        <div className="bg-gray-300 h-64 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <MapPin className="w-12 h-12 mx-auto mb-2" />
              <p className="font-medium">Map View</p>
              <p className="text-sm">Interactive map would load here</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">
            {mockClinics.length} Clinics Found
          </h2>

          {mockClinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{clinic.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">{clinic.rating}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600 text-sm">{clinic.distance} away</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{clinic.address}</p>
                  <p className="text-blue-600 text-sm font-medium">{clinic.phone}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleCall(clinic.phone)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </button>
                <button
                  onClick={() => handleDirections(clinic.address)}
                  className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
