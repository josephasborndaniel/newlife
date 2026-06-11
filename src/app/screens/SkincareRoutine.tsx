import { useNavigate } from "react-router";
import { ArrowLeft, Sun, Moon, Droplet, Shield, Sparkles } from "lucide-react";
import BottomNav from "../components/BottomNav";

const morningRoutine = [
  {
    step: 1,
    name: "Gentle Cleanser",
    ingredient: "With ceramides & hyaluronic acid",
    reason: "Cleanses without stripping moisture (important for eczema)",
    icon: Droplet,
  },
  {
    step: 2,
    name: "Niacinamide Serum",
    ingredient: "5-10% niacinamide",
    reason: "Reduces inflammation and strengthens skin barrier",
    icon: Sparkles,
  },
  {
    step: 3,
    name: "Moisturizer",
    ingredient: "With colloidal oatmeal",
    reason: "Soothes irritation and locks in hydration",
    icon: Droplet,
  },
  {
    step: 4,
    name: "Sunscreen SPF 50+",
    ingredient: "Mineral-based (zinc oxide)",
    reason: "Protects without irritating sensitive skin",
    icon: Shield,
  },
];

const nightRoutine = [
  {
    step: 1,
    name: "Oil-Based Cleanser",
    ingredient: "With jojoba or squalane",
    reason: "Removes impurities gently",
    icon: Droplet,
  },
  {
    step: 2,
    name: "Azelaic Acid Serum",
    ingredient: "10% azelaic acid",
    reason: "Anti-inflammatory, safe for eczema (avoid retinol)",
    icon: Sparkles,
  },
  {
    step: 3,
    name: "Rich Night Cream",
    ingredient: "With shea butter & ceramides",
    reason: "Intensive overnight repair and hydration",
    icon: Moon,
  },
];

const avoidIngredients = [
  { name: "Retinol / Retinoids", reason: "Can worsen eczema and cause irritation" },
  { name: "Fragrance / Essential Oils", reason: "Common allergens that trigger flare-ups" },
  { name: "Alcohol Denat.", reason: "Drying and strips natural skin barrier" },
  { name: "Physical Exfoliants", reason: "Mechanical scrubs can damage inflamed skin" },
];

export default function SkincareRoutine() {
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
        <h1 className="text-white text-2xl font-bold">Your Skincare Routine</h1>
        <p className="text-blue-100 mt-1">Personalized for eczema</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 p-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-100 rounded-full p-3">
              <Sun className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Morning Routine</h3>
          </div>

          <div className="space-y-4">
            {morningRoutine.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                    {item.step}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-blue-600" />
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                    </div>
                    <p className="text-sm text-blue-600 mb-1">{item.ingredient}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 rounded-full p-3">
              <Moon className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Night Routine</h3>
          </div>

          <div className="space-y-4">
            {nightRoutine.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                    {item.step}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-indigo-600" />
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                    </div>
                    <p className="text-sm text-indigo-600 mb-1">{item.ingredient}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-red-900 mb-4">⚠️ Ingredients to Avoid</h3>

          <div className="space-y-3">
            {avoidIngredients.map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2" />
                <div>
                  <p className="font-semibold text-red-900">{item.name}</p>
                  <p className="text-sm text-red-700">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-green-900 mb-3">💡 Pro Tips</h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li>• Patch test new products on inner arm for 24h before face application</li>
            <li>• Wait 5-10 minutes between each step for better absorption</li>
            <li>• Keep routine consistent — it takes 4-6 weeks to see results</li>
            <li>• Store products in a cool, dry place away from sunlight</li>
          </ul>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
