import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Send, Bot, User as UserIcon } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { db } from "@/lib/database";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "Is this condition contagious?",
  "Can my child get this?",
  "What foods should I avoid?",
  "How long until it heals?",
  "Should I see a doctor immediately?",
];

const mockResponses: Record<string, string> = {
  "contagious": "Based on your scan showing eczema, this condition is NOT contagious. Eczema is an inflammatory skin condition caused by genetics and environmental factors, not by bacteria or viruses. You cannot spread it to others through contact.",
  "child": "Eczema has a genetic component, so there is a possibility your child could develop it, especially if other family members have eczema, asthma, or hay fever (atopic conditions). However, it's not guaranteed. Proper skin care from an early age can help prevent or minimize symptoms.",
  "foods": "For eczema, some people find that dairy, eggs, nuts, soy, wheat, and shellfish can trigger flare-ups. However, food triggers vary by individual. Keep a food diary to identify your specific triggers. Don't eliminate foods without consulting a doctor or dietitian first.",
  "heal": "Eczema is typically a chronic condition that requires ongoing management rather than a one-time cure. However, with proper treatment (moisturizers, prescription creams if needed), most flare-ups improve within 2-4 weeks. Some people experience long periods without symptoms.",
  "doctor": "For your detected eczema with medium severity, you should schedule a dermatologist appointment within 1-2 weeks if: symptoms worsen despite treatment, you develop signs of infection (yellow crusting, increased pain), or it significantly impacts your daily life. It's not typically an emergency, but professional guidance will help create an effective treatment plan.",
};

export default function AIChat() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    async function loadChatHistory() {
      if (user?.id) {
        try {
          await db.init();
          const data = await db.getChatMessages(user.id);
          setMessages(
            data.map((msg) => ({
              id: msg.id,
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
              timestamp: new Date(msg.timestamp),
            }))
          );
        } catch (e) {
          console.error("Failed to load chat history", e);
        }
      } else {
        setMessages([
          {
            id: "1",
            role: "assistant",
            content: "Hello! I'm your AI dermatology assistant. Ask me questions about your condition, treatment, or skin health.",
            timestamp: new Date(),
          },
        ]);
      }
    }
    loadChatHistory();
  }, [user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMsgLocal: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsgLocal]);
    setInput("");
    setIsTyping(true);

    if (user?.id) {
      try {
        const { doctorMessage } = await db.postChatMessage(user.id, messageText);
        const assistantMsg: Message = {
          id: doctorMessage.id,
          role: "assistant",
          content: doctorMessage.text,
          timestamp: new Date(doctorMessage.timestamp),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (e) {
        console.error("Failed to post message", e);
      } finally {
        setIsTyping(false);
      }
    } else {
      // Fallback logic for offline/token-less testing
      await new Promise(resolve => setTimeout(resolve, 1000));
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I understand your question. Based on your eczema diagnosis, I recommend consulting with a dermatologist for personalized advice. In the meantime, keep your skin moisturized, avoid known triggers, and use gentle, fragrance-free products.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6">
        <button
          onClick={() => navigate("/home")}
          className="mb-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold">AI Dermatology Chat</h1>
        <p className="text-blue-100 mt-1">Ask questions about your scan</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-32 space-y-4">
        {messages.length === 1 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3 font-medium">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(question)}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm rounded-full shadow-sm hover:shadow-md transition-all"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
            )}

            <div
              className={`max-w-[75%] rounded-2xl p-4 ${
                message.role === "user"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-white text-gray-900 shadow-sm"
              }`}
            >
              <p className="leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-2 ${
                message.role === "user" ? "text-blue-100" : "text-gray-500"
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {message.role === "user" && (
              <div className="flex-shrink-0 w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl shadow-lg"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
