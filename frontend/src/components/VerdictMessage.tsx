import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, HelpCircle, Eye, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ParsedVerdict, SearchResult } from "@/services/api";

interface VerdictMessageProps {
  verdict: ParsedVerdict;
  searchResults?: SearchResult[];
}

const verdictConfig = {
  TRUE: {
    icon: CheckCircle2,
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    badgeColor: "bg-green-500/20 text-green-300",
    label: "✅ CORRECT",
    emoji: "🎉",
    description: "The evidence strongly supports this claim",
  },
  FALSE: {
    icon: XCircle,
    color: "from-red-400 to-rose-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    badgeColor: "bg-red-500/20 text-red-300",
    label: "❌ INCORRECT",
    emoji: "⚠️",
    description: "The evidence contradicts this claim",
  },
  PARTIALLY_TRUE: {
    icon: AlertCircle,
    color: "from-yellow-400 to-amber-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    badgeColor: "bg-yellow-500/20 text-yellow-300",
    label: "⚠️ PARTIALLY TRUE",
    emoji: "🤔",
    description: "Some parts are accurate, but context matters",
  },
  UNVERIFIABLE: {
    icon: HelpCircle,
    color: "from-slate-400 to-slate-500",
    bgColor: "bg-slate-500/10",
    borderColor: "border-slate-500/30",
    badgeColor: "bg-slate-500/20 text-slate-300",
    label: "❓ UNVERIFIABLE",
    emoji: "🔍",
    description: "Insufficient information to verify",
  },
  MISLEADING: {
    icon: Eye,
    color: "from-orange-400 to-red-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    badgeColor: "bg-orange-500/20 text-orange-300",
    label: "🚨 MISLEADING",
    emoji: "😬",
    description: "Technically accurate but missing context",
  },
};

export const VerdictMessage = ({ verdict, searchResults }: VerdictMessageProps) => {
  const config = verdictConfig[verdict.verdictType as keyof typeof verdictConfig];
  const Icon = config.icon;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="flex justify-start"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className={cn(
          "max-w-2xl rounded-2xl border-2 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm",
          config.bgColor,
          config.borderColor
        )}
        whileHover={{ scale: 1.01 }}
      >
        {/* Header with Verdict */}
        <motion.div
          className={cn(
            "bg-gradient-to-r p-6",
            config.color
          )}
          variants={itemVariants}
        >
          <div className="flex items-start gap-3">
            <Icon className="w-6 h-6 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white leading-relaxed">
                {verdict.verdictType === "TRUE" ? "✅ THAT'S TRUE " : "❌ THAT'S FALSE "}
                <span className="block text-base font-semibold opacity-90 mt-1">Here is why:</span>
              </h2>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Claim */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Claim</h3>
            <p className="text-slate-100 italic">"{verdict.claim}"</p>
          </motion.div>

          {/* Reasoning */}
          {verdict.reasoning && (
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Analysis</h3>
              <p className="text-slate-200 leading-relaxed">{verdict.reasoning}</p>
            </motion.div>
          )}

          {/* Search Results Links */}
          {searchResults && searchResults.length > 0 && (
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Fact Sources</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchResults.slice(0, 5).map((result, idx) => (
                  <motion.a
                    key={idx}
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg bg-slate-700/30 hover:bg-slate-600/50 transition-all group border border-slate-600/20 hover:border-blue-500/50"
                    whileHover={{ x: 5, scale: 1.02 }}
                  >
                    <div className="flex items-start gap-3">
                      <ExternalLink className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-100 group-hover:text-blue-300 line-clamp-2">
                          {result.title}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {result.source || new URL(result.url).hostname}
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
              {searchResults.length > 5 && (
                <p className="text-xs text-slate-400 mt-2 text-center">
                  +{searchResults.length - 5} more sources
                </p>
              )}
            </motion.div>
          )}

          {/* Sources */}
          {verdict.sources && verdict.sources.length > 0 && (
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Sources</h3>
              <div className="space-y-2">
                {verdict.sources.map((source, idx) => (
                  <motion.a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 text-xs mt-1 flex-shrink-0">🔗</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-100 group-hover:text-blue-300 truncate">
                          {source.title || "Source"}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {source.domain || source.url}
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}

          {/* Limitations */}
          {/* REMOVED: Limitations section */}

          {/* Search Results Count */}
          {verdict.searchResultsCount && (
            <motion.div
              variants={itemVariants}
              className="text-xs text-slate-400 text-center pt-2 border-t border-slate-700/30"
            >
              Analyzed {verdict.searchResultsCount} web sources
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
