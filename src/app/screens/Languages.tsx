import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CheckCircle, Globe } from "lucide-react";

const languages = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
];

export default function Languages() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLanguage = (code: string) => {
    setSelectedLanguage(code);
    localStorage.setItem("skinscan_language", code);

    setTimeout(() => {
      navigate("/settings");
    }, 500);
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6">
        <button
          onClick={() => navigate("/settings")}
          className="mb-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold">Language / भाषा</h1>
        <p className="text-blue-100 mt-1">Choose your preferred language</p>
      </div>

      <div className="p-6">
        <div className="relative mb-4">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search languages..."
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-2">
          {filteredLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleSelectLanguage(language.code)}
              className={`w-full p-4 rounded-2xl transition-all flex items-center justify-between ${
                selectedLanguage === language.code
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white hover:bg-gray-50 text-gray-900 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{language.flag}</span>
                <div className="text-left">
                  <p className="font-semibold">{language.name}</p>
                  <p className={`text-sm ${
                    selectedLanguage === language.code ? "text-blue-100" : "text-gray-500"
                  }`}>
                    {language.nativeName}
                  </p>
                </div>
              </div>

              {selectedLanguage === language.code && (
                <CheckCircle className="w-6 h-6 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>

        {filteredLanguages.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No languages found</p>
          </div>
        )}
      </div>
    </div>
  );
}
