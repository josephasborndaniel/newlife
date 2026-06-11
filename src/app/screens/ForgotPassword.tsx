import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setEmailSent(true);
    setIsLoading(false);
  };

  if (emailSent) {
    return (
      <div className="h-full w-full flex flex-col p-6">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-gray-600 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>

        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <div className="bg-green-100 rounded-full p-6 mb-6">
            <Mail className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Check Your Email</h1>
          <p className="text-gray-600 mb-8 max-w-sm">
            We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
          </p>
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col p-6">
      <button
        onClick={() => navigate("/login")}
        className="flex items-center gap-2 text-gray-600 mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Login
      </button>

      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
        <p className="text-gray-600 mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold mt-6 shadow-lg"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
