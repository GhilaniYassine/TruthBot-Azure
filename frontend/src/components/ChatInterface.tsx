import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { factCheckClaim, parseVerdict, type ParsedVerdict } from "@/services/api";
import { ChatMessage } from "./ChatMessage";
import { VerdictMessage } from "./VerdictMessage";

export interface ChatMessage {
  id: string;
  type: "user" | "bot" | "loading" | "verdict";
  content: string;
  verdict?: ParsedVerdict;
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
        apiResponse.search_results_count
      );

      // Remove loading message and add verdict
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== loadingId),
        {
          id: `verdict-${Date.now()}`,
          type: "verdict",
          content: apiResponse.verdict,
          verdict: parsedVerdict,
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

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg border-b border-purple-500/20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🔍</div>
            <div>
              <h1 className="text-2xl font-bold text-white">TruthBot</h1>
              <p className="text-purple-100 text-sm">AI-Powered Fact-Checking</p>
            </div>
          </div>
          {messages.length > 1 && (
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="border-purple-300 text-purple-100 hover:bg-purple-600"
            >
              New Chat
            </Button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl mx-auto w-full">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              verdict={message.verdict}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl px-4 py-3 max-w-xs">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-purple-500/20 bg-slate-900/80 backdrop-blur-sm px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a claim to fact-check... e.g., 'The moon is made of cheese'"
              disabled={isLoading}
              className={cn(
                "flex-1 px-4 py-3 rounded-full border-2 bg-slate-800 text-white placeholder-slate-400 transition-all duration-200",
                "border-purple-500/30 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={cn(
                "rounded-full w-12 h-12 p-0 transition-all duration-200",
                "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
                "disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/50"
              )}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
