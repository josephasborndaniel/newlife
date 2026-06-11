import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useScans } from "../context/ScanContext";
import { Check } from "lucide-react";

const analysisSteps = [
  { id: 1, label: "Preprocessing", duration: 1000 },
  { id: 2, label: "Feature Extraction", duration: 1500 },
  { id: 3, label: "Pattern Matching", duration: 1200 },
  { id: 4, label: "Generating Report", duration: 800 },
];

export default function Analyzing() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { addScan } = useScans();

  const image = location.state?.image || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400";

  useEffect(() => {
    let stepIndex = 0;
    let progressInterval: NodeJS.Timeout;

    const advanceStep = async () => {
      if (stepIndex < analysisSteps.length) {
        setCurrentStep(stepIndex);
        setProgress((stepIndex / analysisSteps.length) * 100);

        progressInterval = setTimeout(() => {
          setProgress(((stepIndex + 1) / analysisSteps.length) * 100);
          stepIndex++;
          setTimeout(advanceStep, 100);
        }, analysisSteps[stepIndex].duration);
      } else {
        const bodyArea = location.state?.bodyArea || "General";

        try {
          if (!localStorage.getItem("skinscan_token")) {
            navigate("/login");
            return;
          }

          const savedScan = await addScan({ image, bodyArea });
          navigate(`/results/${savedScan!.id}`);
        } catch (e) {
          console.error("Analysis saving failed", e);
          navigate("/camera");
        }
      }
    };

    advanceStep();

    return () => {
      clearTimeout(progressInterval);
    };
  }, [navigate, image, addScan, location.state?.bodyArea]);

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
          <img
            src={image}
            alt="Analyzing"
            className="w-full aspect-square object-cover rounded-2xl mb-8"
          />

          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Analyzing Your Scan
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Please wait while our AI processes your image
          </p>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {analysisSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  index < currentStep
                    ? "bg-green-50"
                    : index === currentStep
                    ? "bg-blue-50"
                    : "bg-gray-50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    index < currentStep
                      ? "bg-green-500"
                      : index === currentStep
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-white text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <span
                  className={`font-medium ${
                    index <= currentStep ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
