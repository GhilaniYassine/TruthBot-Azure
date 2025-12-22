import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  AlertOctagon,
  ExternalLink,
  RotateCcw,
  Share2,
  Bookmark,
  Lightbulb,
  Zap,
  TrendingUp,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface Source {
  title: string;
  url: string;
  credibility: "HIGH" | "MEDIUM" | "LOW";
  relationship: "Supports" | "Contradicts" | "Context";
  reason: string;
}

interface VerdictResult {
  verdictType: "TRUE" | "FALSE" | "PARTIALLY_TRUE" | "UNVERIFIABLE" | "MISLEADING";
  confidence: "High" | "Medium" | "Low";
  claim: string;
  reasoning: string;
  sources: Source[];
  limitations: string[];
  searchResultsCount: number;
}

interface VerdictDisplayProps {
  result: VerdictResult;
  onReset: () => void;
}

const verdictConfig = {
  TRUE: {
    icon: CheckCircle2,
    label: "FACT VERIFIED ✓",
    colorClass: "text-success",
    bgClass: "bg-success/10",
    borderClass: "verdict-border-true",
    glowClass: "shadow-lg shadow-success/40",
    accentColor: "#10b981",
    celebration: true,
  },
  FALSE: {
    icon: XCircle,
    label: "FALSE",
    colorClass: "text-danger",
    bgClass: "bg-danger/10",
    borderClass: "verdict-border-false",
    glowClass: "shadow-lg shadow-danger/40",
    accentColor: "#ef4444",
    celebration: false,
  },
  PARTIALLY_TRUE: {
    icon: AlertTriangle,
    label: "PARTIALLY TRUE",
    colorClass: "text-warning",
    bgClass: "bg-warning/10",
    borderClass: "verdict-border-partial",
    glowClass: "shadow-lg shadow-warning/40",
    accentColor: "#f59e0b",
    celebration: false,
  },
  UNVERIFIABLE: {
    icon: HelpCircle,
    label: "UNVERIFIABLE",
    colorClass: "text-neutral",
    bgClass: "bg-neutral/10",
    borderClass: "verdict-border-unverifiable",
    glowClass: "shadow-lg shadow-neutral/40",
    accentColor: "#6b7280",
    celebration: false,
  },
  MISLEADING: {
    icon: AlertOctagon,
    label: "MISLEADING",
    colorClass: "text-misleading",
    bgClass: "bg-misleading/10",
    borderClass: "verdict-border-misleading",
    glowClass: "shadow-lg shadow-misleading/40",
    accentColor: "#ef4444",
    celebration: false,
  },
};

const confidenceConfig = {
  High: "bg-success/20 text-success border-success/30",
  Medium: "bg-warning/20 text-warning border-warning/30",
  Low: "bg-danger/20 text-danger border-danger/30",
};

const credibilityConfig = {
  HIGH: "bg-success/20 text-success",
  MEDIUM: "bg-warning/20 text-warning",
  LOW: "bg-danger/20 text-danger",
};

export const VerdictDisplay = ({ result, onReset }: VerdictDisplayProps) => {
  const config = verdictConfig[result.verdictType];
  const VerdictIcon = config.icon;
  const [showParticles, setShowParticles] = useState(config.celebration);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (config.celebration) {
      // Create celebratory sparkles for TRUE verdicts
      const newSparkles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));
      setSparkles(newSparkles);
    }
  }, [config.celebration]);

  const handleShare = () => {
    navigator.clipboard.writeText(
      `TruthBot Verdict: ${config.label}\n\nClaim: "${result.claim}"\n\nVerify at: ${window.location.href}`
    );
    toast({
      title: "Copied to clipboard!",
      description: "Share link copied successfully.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Claim saved!",
      description: "Added to your history.",
    });
  };

  return (
    <section className="py-8 px-4 animate-slide-up relative">
      {/* Celebratory sparkles for TRUE verdicts */}
      {config.celebration && sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animation: `sparkle-burst ${0.8 + Math.random() * 0.4}s ease-out forwards`,
          }}
        >
          <div className="text-success text-2xl animate-pulse">✨</div>
        </div>
      ))}

      <div className="max-w-3xl mx-auto">
        {/* Glow effect background for TRUE verdicts */}
        {config.celebration && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-success/20 via-success/10 to-transparent blur-3xl opacity-50 -z-10" />
        )}

        <div className={cn(
          "glass-card p-6 sm:p-8 transition-all duration-500",
          config.borderClass,
          config.celebration && "border-success/50 shadow-2xl shadow-success/20 bg-success/5"
        )}>
          {/* Verdict Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-4 rounded-2xl transition-all duration-500",
                config.bgClass,
                config.celebration && "scale-110 shadow-xl shadow-success/30"
              )}>
                <VerdictIcon className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 transition-all duration-500",
                  config.colorClass,
                  config.celebration && "animate-bounce"
                )} />
              </div>
              <div>
                <h2 className={cn(
                  "text-3xl sm:text-4xl font-black tracking-tight",
                  config.colorClass,
                  config.celebration && "text-success"
                )}>
                  {config.label}
                </h2>
                {result.verdictType === "TRUE" && (
                  <p className="text-sm text-success font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> Verified & Accurate
                  </p>
                )}
              </div>
            </div>
            
            {/* Confidence Badge */}
            <div className={cn(
              "px-4 py-3 rounded-full border text-sm font-bold transition-all duration-300",
              confidenceConfig[result.confidence],
              result.confidence === "High" && "scale-110 shadow-lg"
            )}>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                {result.confidence} Confidence
              </div>
            </div>
          </div>

          {/* Original Claim - Enhanced */}
          <div className={cn(
            "mb-8 p-5 rounded-xl border transition-all duration-300",
            result.verdictType === "TRUE" ? "bg-success/5 border-success/20" : "bg-muted/50 border-border"
          )}>
            <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Original Claim
            </p>
            <p className="text-foreground italic text-base leading-relaxed">"{result.claim}"</p>
          </div>

          {/* Verdict Strength Meter */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-muted-foreground">VERDICT CONFIDENCE LEVEL</h3>
              <span className={cn(
                "text-sm font-bold",
                result.confidence === "High" && "text-success",
                result.confidence === "Medium" && "text-warning",
                result.confidence === "Low" && "text-danger"
              )}>
                {result.confidence === "High" && "STRONG"}
                {result.confidence === "Medium" && "MODERATE"}
                {result.confidence === "Low" && "LIMITED"}
              </span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  result.confidence === "High" && "bg-gradient-to-r from-success via-success to-success/70 w-full",
                  result.confidence === "Medium" && "bg-gradient-to-r from-warning via-warning to-warning/70 w-2/3",
                  result.confidence === "Low" && "bg-gradient-to-r from-danger via-danger to-danger/70 w-1/3"
                )}
                style={{
                  boxShadow: result.confidence === "High" ? "0 0 12px rgba(16, 185, 129, 0.5)" : "none"
                }}
              />
            </div>
          </div>

          {/* Reasoning */}
          <div className="mb-8 p-5 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent border border-primary/10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="gradient-text">WHY THIS VERDICT?</span>
              <Lightbulb className="w-5 h-5 text-warning" />
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 leading-relaxed space-y-3">
              {result.reasoning.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="text-foreground/75">{paragraph}</p>
                )
              ))}
            </div>
          </div>

          {/* Sources */}
          {result.sources.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 gradient-text">
                📚 SUPPORTING SOURCES ({result.sources.length})
              </h3>
              <div className="space-y-4">
                {result.sources.map((source, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "p-5 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg group",
                      source.relationship === "Supports" && "bg-success/5 border-success/30 hover:border-success/50",
                      source.relationship === "Contradicts" && "bg-danger/5 border-danger/30 hover:border-danger/50",
                      source.relationship === "Context" && "bg-muted/30 border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <a 
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2 group-hover:underline text-base"
                        >
                          {source.title}
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <p className="text-xs text-muted-foreground truncate mt-2 opacity-70">
                          {source.url}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap",
                          credibilityConfig[source.credibility]
                        )}>
                          {source.credibility}
                        </span>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap",
                          source.relationship === "Supports" && "bg-success/20 text-success",
                          source.relationship === "Contradicts" && "bg-danger/20 text-danger",
                          source.relationship === "Context" && "bg-muted/50 text-muted-foreground"
                        )}>
                          {source.relationship}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 italic">
                      💡 {source.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Limitations */}
          {result.limitations.length > 0 && (
            <div className="mb-8 p-5 rounded-xl bg-warning/10 border-2 border-warning/30">
              <h3 className="text-sm font-black mb-3 flex items-center gap-2 text-warning uppercase tracking-wide">
                <AlertTriangle className="w-5 h-5" />
                Important Context
              </h3>
              <ul className="space-y-2">
                {result.limitations.map((limitation, index) => (
                  <li key={index} className="text-sm text-foreground/75 flex items-start gap-3">
                    <span className="text-warning font-bold text-lg leading-none mt-0.5">⚠</span>
                    {limitation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
            <Button 
              variant="outline" 
              onClick={onReset}
              className="flex-1 transition-all hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              Check Another Claim
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleShare}
              className="flex-1 transition-all hover:scale-105"
            >
              <Share2 className="w-4 h-4" />
              Share Result
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleSave}
              className="flex-1 transition-all hover:scale-105"
            >
              <Bookmark className="w-4 h-4" />
              Save for Later
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sparkle-burst {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 200 - 100}px) scale(0);
          }
        }
      `}</style>
    </section>
  );
};
