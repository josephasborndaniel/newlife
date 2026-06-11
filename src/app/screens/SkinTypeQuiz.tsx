import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db } from "@/lib/database";

const quizQuestions = [
  {
    id: 1,
    question: "What is your skin tone?",
    options: [
      { value: "very-fair", label: "Very Fair (Type I)", emoji: "🏻" },
      { value: "fair", label: "Fair (Type II)", emoji: "🏼" },
      { value: "medium", label: "Medium (Type III-IV)", emoji: "🏽" },
      { value: "olive", label: "Olive (Type V)", emoji: "🏾" },
      { value: "dark", label: "Dark (Type VI)", emoji: "🏿" },
    ],
  },
  {
    id: 2,
    question: "How does your skin typically feel?",
    options: [
      { value: "very-dry", label: "Very Dry & Flaky" },
      { value: "dry", label: "Dry & Tight" },
      { value: "normal", label: "Balanced & Comfortable" },
      { value: "oily", label: "Oily & Shiny" },
      { value: "combination", label: "Combination (Oily T-zone)" },
    ],
  },
  {
    id: 3,
    question: "How sensitive is your skin?",
    options: [
      { value: "very-sensitive", label: "Very Sensitive - Reacts to most products" },
      { value: "sensitive", label: "Sensitive - Occasional reactions" },
      { value: "normal", label: "Normal - Few reactions" },
      { value: "tolerant", label: "Tolerant - Rarely reacts" },
    ],
  },
  {
    id: 4,
    question: "How does your skin react to sun exposure?",
    options: [
      { value: "always-burns", label: "Always burns, never tans" },
      { value: "usually-burns", label: "Usually burns, tans minimally" },
      { value: "sometimes-burns", label: "Sometimes burns, tans gradually" },
      { value: "rarely-burns", label: "Rarely burns, tans easily" },
      { value: "never-burns", label: "Never burns, tans very easily" },
    ],
  },
  {
    id: 5,
    question: "Do you have any known skin allergies?",
    options: [
      { value: "none", label: "None that I know of" },
      { value: "fragrance", label: "Fragrance/Essential oils" },
      { value: "preservatives", label: "Preservatives (parabens, etc.)" },
      { value: "acids", label: "Acids (AHA/BHA)" },
      { value: "multiple", label: "Multiple allergies" },
    ],
  },
  {
    id: 6,
    question: "How often do you experience breakouts?",
    options: [
      { value: "never", label: "Never or very rarely" },
      { value: "occasionally", label: "Occasionally (1-2 times/month)" },
      { value: "frequently", label: "Frequently (weekly)" },
      { value: "constantly", label: "Constantly (severe acne)" },
    ],
  },
];

export default function SkinTypeQuiz() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function loadQuizProfile() {
      if (user?.id) {
        try {
          await db.init();
          const profile = await db.getQuizProfile(user.id);
          if (profile) setAnswers(profile);
        } catch (e) {
          console.error("Failed to load skin profile", e);
        }
      } else {
        const local = localStorage.getItem("skinscan_skin_profile");
        if (local) setAnswers(JSON.parse(local));
      }
    }
    loadQuizProfile();
  }, [user?.id]);

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [quizQuestions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    } else {
      setCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    localStorage.setItem("skinscan_skin_profile", JSON.stringify(answers));
    if (user?.id) {
      try {
        await db.saveQuizProfile(user.id, answers);
      } catch (e) {
        console.error("Failed to save skin profile", e);
      }
    }
    navigate("/home");
  };

  if (completed) {
    return (
      <div className="h-full w-full flex flex-col bg-gradient-to-br from-blue-600 to-purple-600 p-6">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-8 mb-6">
            <CheckCircle className="w-24 h-24 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Profile Complete!
          </h1>

          <p className="text-xl text-blue-100 mb-8 max-w-md">
            Your personalized skin profile has been saved. All scan results and advice will now be tailored specifically for your skin type.
          </p>

          <button
            onClick={handleComplete}
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-2xl font-semibold shadow-xl"
          >
            Continue to App
          </button>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="h-full w-full flex flex-col">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => currentQuestion === 0 ? navigate("/home") : handlePrevious()}
            className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>

          <span className="text-white font-semibold">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
        </div>

        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden mb-4">
          <div
            className="bg-white h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className="text-2xl font-bold text-white">
          {question.question}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3 max-w-lg mx-auto">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={`w-full p-5 rounded-2xl text-left transition-all ${
                answers[question.id] === option.value
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                  : "bg-white hover:bg-gray-50 text-gray-900 shadow-sm hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {option.emoji && (
                    <span className="text-2xl">{option.emoji}</span>
                  )}
                  <span className="font-semibold">{option.label}</span>
                </div>

                {answers[question.id] === option.value && (
                  <CheckCircle className="w-6 h-6 flex-shrink-0" />
                )}
                {answers[question.id] !== option.value && (
                  <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
