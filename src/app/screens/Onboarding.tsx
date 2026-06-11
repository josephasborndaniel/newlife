import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Camera,
  FileSearch,
  MapPin,
  ChevronRight,
  Shield,
  Clock,
  Brain,
  Heart,
  Zap,
  TrendingUp,
  Users,
  Bell,
  Lock,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
  Eye,
  Droplet,
  Target,
  Award,
  BookOpen,
  BarChart,
  Smartphone,
  Activity,
  Star,
  Lightbulb,
  Stethoscope,
  MessageCircle,
  ChevronLeft,
} from "lucide-react";

const slides = [
  {
    icon: Sparkles,
    title: "Welcome to SkinScan AI",
    description: "Your personal AI-powered skin health assistant. Let's take a quick tour to get you started.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Camera,
    title: "Scan Your Skin",
    description: "Take a photo of any skin condition or upload from your gallery for instant analysis.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Our advanced machine learning model analyzes your skin with medical-grade accuracy.",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: FileSearch,
    title: "Detailed Reports",
    description: "Get comprehensive reports with condition identification, confidence levels, and severity ratings.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: MapPin,
    title: "Find Specialists",
    description: "Locate nearby dermatology clinics and specialists for professional consultation.",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    icon: Clock,
    title: "Fast Results",
    description: "Receive your analysis in seconds. No waiting rooms, no appointments needed for initial screening.",
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description: "Monitor changes over time with our comprehensive scan history and tracking features.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Shield,
    title: "Medical-Grade Security",
    description: "Your health data is encrypted and protected with bank-level security standards.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Award,
    title: "Trained on 100K+ Images",
    description: "Our AI has been trained on over 100,000 dermatological images for superior accuracy.",
    color: "from-lime-500 to-lime-600",
  },
  {
    icon: Target,
    title: "85%+ Accuracy Rate",
    description: "Clinical studies show our AI achieves 85%+ accuracy in detecting common skin conditions.",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    icon: Eye,
    title: "Multiple Conditions",
    description: "Detect melanoma, eczema, psoriasis, acne, rosacea, and 20+ other skin conditions.",
    color: "from-amber-500 to-amber-600",
  },
  {
    icon: Stethoscope,
    title: "Not a Replacement",
    description: "SkinScan AI assists with early detection but always consult a doctor for diagnosis.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Sun,
    title: "Best Lighting Tips",
    description: "Use natural daylight or bright indoor lighting for the clearest and most accurate scans.",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Camera,
    title: "Distance Matters",
    description: "Hold your camera 6-12 inches away from the skin area for optimal focus and clarity.",
    color: "from-rose-500 to-rose-600",
  },
  {
    icon: Target,
    title: "Fill the Frame",
    description: "Make sure the affected area fills most of the frame without cutting off edges.",
    color: "from-fuchsia-500 to-fuchsia-600",
  },
  {
    icon: Eye,
    title: "Avoid Blur",
    description: "Keep your hand steady and ensure the image is sharp and in focus for best results.",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: Droplet,
    title: "Clean & Dry",
    description: "Make sure the skin area is clean, dry, and free from makeup or lotions before scanning.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your scans are stored securely on your device. We never share your personal health data.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Set up notifications for follow-up scans and receive personalized skin health tips.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: BarChart,
    title: "Progress Analytics",
    description: "Visualize your skin health journey with charts, trends, and improvement tracking.",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    icon: Lightbulb,
    title: "Expert Advice",
    description: "Receive actionable recommendations and care tips specific to your detected condition.",
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: Heart,
    title: "Self-Care Guidance",
    description: "Learn about proper skincare routines, products, and lifestyle changes to improve skin health.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: AlertCircle,
    title: "Know When to Act",
    description: "We'll alert you when a condition requires immediate medical attention from a specialist.",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Users,
    title: "Family Sharing",
    description: "Create multiple profiles to track skin health for your entire family in one app.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Moon,
    title: "Dark Mode Available",
    description: "Easy on the eyes with beautiful dark mode support for comfortable nighttime use.",
    color: "from-slate-600 to-slate-700",
  },
  {
    icon: Smartphone,
    title: "Works Offline",
    description: "Browse your scan history and recommendations even without an internet connection.",
    color: "from-gray-600 to-gray-700",
  },
  {
    icon: BookOpen,
    title: "Educational Resources",
    description: "Access our library of articles about skin conditions, prevention, and treatment options.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: MessageCircle,
    title: "24/7 Support",
    description: "Get help anytime with our in-app support chat and comprehensive help center.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Star,
    title: "Join 500K+ Users",
    description: "Trusted by over half a million users worldwide for early skin condition detection.",
    color: "from-amber-500 to-amber-600",
  },
  {
    icon: CheckCircle,
    title: "Ready to Begin?",
    description: "You're all set! Let's create your account and start your journey to healthier skin.",
    color: "from-green-500 to-green-600",
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      localStorage.setItem("skinscan_onboarding_complete", "true");
      navigate("/signup");
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("skinscan_onboarding_complete", "true");
    navigate("/signup");
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;
  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-between items-center p-4">
        <span className="text-sm font-medium text-gray-500">
          {currentSlide + 1} / {slides.length}
        </span>
        {currentSlide < slides.length - 1 && (
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            Skip
          </button>
        )}
      </div>

      <div className="px-6 mb-4">
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20">
        <div className={`bg-gradient-to-br ${slide.color} rounded-full p-12 mb-8 shadow-xl`}>
          <Icon className="w-24 h-24 text-white" strokeWidth={1.5} />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          {slide.title}
        </h2>

        <p className="text-lg text-gray-600 text-center leading-relaxed max-w-md">
          {slide.description}
        </p>
      </div>

      <div className="px-8 pb-12">
        <div className="flex gap-3">
          {currentSlide > 0 && (
            <button
              onClick={handlePrevious}
              className="flex-shrink-0 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
          >
            {currentSlide < slides.length - 1 ? "Next" : "Get Started"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
