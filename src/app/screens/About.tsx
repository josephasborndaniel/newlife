import { useNavigate } from "react-router";
import { ArrowLeft, Scan, AlertCircle, Mail, ExternalLink } from "lucide-react";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex flex-col bg-gray-50 overflow-y-auto">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold">About & Help</h1>
        <p className="text-blue-100 mt-1">Learn more about SkinScan AI</p>
      </div>

      <div className="flex-1 p-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <Scan className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">SkinScan AI</h2>
          <p className="text-gray-600 mb-1">Version 1.0.0</p>
          <p className="text-sm text-gray-500">Build 2026.05.11</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">About This App</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            SkinScan AI is an advanced mobile application that uses artificial intelligence to analyze
            skin conditions from photos. Our AI model has been trained on thousands of dermatological
            images to provide accurate preliminary assessments.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The app helps you monitor your skin health, track changes over time, and connect with
            dermatology professionals when needed.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">How It Works</h3>
          <div className="space-y-3">
            {[
              {
                step: "1",
                title: "Capture or Upload",
                description: "Take a clear photo of the skin area or upload from your gallery.",
              },
              {
                step: "2",
                title: "AI Analysis",
                description: "Our AI processes the image using advanced pattern recognition.",
              },
              {
                step: "3",
                title: "Get Results",
                description: "Receive a detailed report with confidence levels and recommendations.",
              },
              {
                step: "4",
                title: "Take Action",
                description: "Follow the advice and find nearby dermatology clinics if needed.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-900 mb-1">Medical Disclaimer</p>
              <p className="text-amber-800 text-sm leading-relaxed">
                SkinScan AI is designed for informational and educational purposes only. It is not
                intended to be a substitute for professional medical advice, diagnosis, or treatment.
                Always seek the advice of your physician or other qualified health provider with any
                questions you may have regarding a medical condition.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Contact & Support</h3>
          <div className="space-y-3">
            <a
              href="mailto:support@skinscan.ai"
              className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">Email Support</p>
                <p className="text-sm text-blue-600">support@skinscan.ai</p>
              </div>
            </a>

            <a
              href="https://skinscan.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-semibold text-gray-900">Visit Website</p>
                <p className="text-sm text-purple-600">www.skinscan.ai</p>
              </div>
            </a>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 py-4">
          <p>&copy; 2026 SkinScan AI. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
