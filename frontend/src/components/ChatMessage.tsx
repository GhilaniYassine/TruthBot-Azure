import { cn } from "@/lib/utils";
import { VerdictMessage } from "./VerdictMessage";
import type { ParsedVerdict, FactCheckResponse } from "@/services/api";

interface ChatMessageProps {
  message: {
    id: string;
    type: "user" | "bot" | "loading" | "verdict";
    content: string;
    timestamp: Date;
    apiResponse?: FactCheckResponse;
  };
  verdict?: ParsedVerdict;
}

export const ChatMessage = ({ message, verdict }: ChatMessageProps) => {
  if (message.type === "verdict" && verdict) {
    return <VerdictMessage verdict={verdict} searchResults={message.apiResponse?.search_results} />;
  }

  const isUser = message.type === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-lg px-5 py-3 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg text-base",
          isUser
            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none shadow-lg hover:shadow-purple-500/50"
            : "bg-slate-800/60 border border-purple-500/30 text-slate-100 rounded-bl-none hover:bg-slate-800/80"
        )}
      >
        <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <span className={cn(
          "text-xs mt-2 block opacity-75",
          isUser ? "text-purple-100" : "text-slate-400"
        )}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};
