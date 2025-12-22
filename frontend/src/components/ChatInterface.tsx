import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { factCheckClaim, parseVerdict, type ParsedVerdict, type FactCheckResponse } from "@/services/api";
import { ChatMessage } from "./ChatMessage";
import { VerdictMessage } from "./VerdictMessage";
import truthBotLogo from "../assets/truthbot-logo.png";

export interface ChatMessage {
  id: string;
  type: "user" | "bot" | "loading" | "verdict";
  content: string;
  verdict?: ParsedVerdict;
  apiResponse?: FactCheckResponse;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onReset?: () => void;
}

export const ChatInterface = ({ onReset }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "bot",
      content: "Hello! 👋 I'm TruthBot, your AI-powered fact-checking assistant. Ask me to verify any claim, and I'll dive deep into the web to find the truth. What would you like me to fact-check today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Add loading message
    const loadingId = `loading-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        type: "loading",
        content: "Checking your claim...",
        timestamp: new Date(),
      },
    ]);

    try {
      // Call the actual API
      const apiResponse = await factCheckClaim(input);

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || "Fact-checking failed");
      }

      // Parse the markdown verdict response
      const parsedVerdict = parseVerdict(
        apiResponse.verdict,
        apiResponse.claim,
        apiResponse.search_results.length
      );

      // Remove loading message and add verdict
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== loadingId),
        {
          id: `verdict-${Date.now()}`,
          type: "verdict",
          content: apiResponse.verdict,
          verdict: parsedVerdict,
          apiResponse: apiResponse,
          timestamp: new Date(),
        },
      ]);

      // Add follow-up message
      const followUpMessages = {
        TRUE: "That's correct! ✅ The evidence strongly supports this claim.",
        FALSE: "That's incorrect! ❌ The evidence contradicts this claim.",
        PARTIALLY_TRUE: "That's partially true! ⚠️ Some parts are accurate, but others need context.",
        UNVERIFIABLE: "I couldn't verify this claim. 🤔 There isn't enough reliable information available.",
        MISLEADING: "That's misleading! 🚨 While technically accurate, it's missing important context.",
      };

      setMessages((prev) => [
        ...prev,
        {
          id: `followup-${Date.now()}`,
          type: "bot",
          content: followUpMessages[parsedVerdict.verdictType] || "Check out the analysis above for details.",
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred while fact-checking";
      console.error("Fact-check error:", err);

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== loadingId),
        {
          id: `error-${Date.now()}`,
          type: "bot",
          content: `Sorry, I encountered an error: ${errorMessage}. Please try again!`,
          timestamp: new Date(),
        },
      ]);

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome",
        type: "bot",
        content: "Hello! 👋 I'm TruthBot, your AI-powered fact-checking assistant. Ask me to verify any claim, and I'll dive deep into the web to find the truth. What would you like me to fact-check today?",
        timestamp: new Date(),
      },
    ]);
    setInput("");
    if (onReset) onReset();
  };

  // Check if we only have the initial welcome message
  const isInitialState = messages.length === 1 && messages[0].id === "welcome";

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
      {/* Enhanced Header */}
      <div className={cn(
        "transition-all duration-300",
        isInitialState 
          ? "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 shadow-2xl backdrop-blur-sm" 
          : "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 shadow-lg backdrop-blur-sm sticky top-0 z-10 py-3"
      )}>
        <div className={cn(
          "w-full px-4 md:px-8 flex items-center justify-between transition-all duration-300",
          isInitialState ? "py-5" : ""
        )}>
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-purple-400 rounded-full blur-xl opacity-45 animate-pulse"></div>
              <img 
                src={truthBotLogo} 
                alt="TruthBot Logo" 
                className={cn(
                  "relative drop-shadow-xl hover:scale-105 transition-all duration-300 object-contain",
                  isInitialState ? "w-24 h-24 md:w-28 md:h-28" : "w-16 h-16 md:w-20 md:h-20"
                )}
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className={cn(
                "font-bold text-white tracking-tight leading-tight transition-all duration-300",
                isInitialState ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"
              )}>TruthBot</h1>
              <p className={cn(
                "text-purple-100 font-medium transition-all duration-300",
                isInitialState ? "text-base md:text-lg mt-1" : "text-xs md:text-sm mt-0.5"
              )}>Verify • Fact-Check • Discover Truth</p>
            </div>
          </div>
          {messages.length > 1 && (
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="border-purple-300 text-white hover:bg-white/10 hover:border-white hover:text-white transition-all duration-200 font-semibold px-4 py-2"
            >
              ✨ Start Fresh
            </Button>
          )}
        </div>
      </div>

      {/* Chat Messages Container */}
      {!isInitialState && (
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="max-w-3xl mx-auto space-y-5">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                verdict={message.verdict}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-slate-800/50 to-purple-800/30 backdrop-blur-md border border-purple-500/30 rounded-3xl px-6 py-4 max-w-xs shadow-lg">
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <span className="text-purple-200 text-xs ml-2 font-medium">Fact-checking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Centered Input Area (ChatGPT Style) */}
      <div className={cn(
        "transition-all duration-300",
        isInitialState
          ? "flex-1 flex flex-col items-center justify-center px-4"
          : "px-4 py-6"
      )}>
        {isInitialState && (
          <div className="text-center mb-8 max-w-2xl">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">What can I fact-check for you?</h2>
            <p className="text-purple-200 text-lg md:text-xl">Verify claims instantly with AI-powered research</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={cn(
          "transition-all duration-300",
          isInitialState ? "w-full max-w-2xl" : "w-full max-w-3xl mx-auto"
        )}>
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything... e.g., 'Did Einstein really say this?'"
              disabled={isLoading}
              className={cn(
                "flex-1 px-6 py-4 rounded-full border-2 bg-slate-800/60 text-white placeholder-slate-500 transition-all duration-300",
                "border-purple-500/40 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/30",
                "disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800/80 backdrop-blur-sm",
                "text-base shadow-lg"
              )}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={cn(
                "rounded-full w-14 h-14 p-0 transition-all duration-300 shadow-xl flex-shrink-0",
                "bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
                "disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-purple-500/60 active:scale-95"
              )}
              title="Verify claim"
            >
              <Send className="w-6 h-6" />
            </Button>
          </div>
          {!isInitialState && (
            <p className="text-xs text-slate-500 mt-3 ml-2">Press Enter or click the button to fact-check</p>
          )}
        </form>
      </div>
    </div>
  );
};
