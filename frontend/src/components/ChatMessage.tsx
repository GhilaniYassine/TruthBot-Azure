import { cn } from "@/lib/utils";
import { VerdictMessage } from "./VerdictMessage";
import type { ParsedVerdict } from "@/services/api";

interface ChatMessageProps {
  message: {
    id: string;
    type: "user" | "bot" | "loading" | "verdict";
    content: string;
    timestamp: Date;
  };
  verdict?: ParsedVerdict;
}

export const ChatMessage = ({ message, verdict }: ChatMessageProps) => {
  if (message.type === "verdict" && verdict) {
    return <VerdictMessage verdict={verdict} />;
  }

  const isUser = message.type === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-xs lg:max-w-md px-4 py-3 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg",
          isUser
            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none shadow-lg hover:shadow-purple-500/50"
            : "bg-slate-800/50 border border-purple-500/20 text-slate-100 rounded-bl-none hover:bg-slate-800/70"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <span className={cn(
          "text-xs mt-2 block",
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
