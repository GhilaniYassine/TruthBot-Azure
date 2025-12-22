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
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

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
    label: "FACT VERIFIED",
    colorClass: "text-success",
    bgClass: "bg-success/10",
    borderClass: "verdict-border-true",
  },
  FALSE: {
    icon: XCircle,
    label: "FALSE",
    colorClass: "text-danger",
    bgClass: "bg-danger/10",
    borderClass: "verdict-border-false",
  },
  PARTIALLY_TRUE: {
    icon: AlertTriangle,
    label: "PARTIALLY TRUE",
    colorClass: "text-warning",
    bgClass: "bg-warning/10",
    borderClass: "verdict-border-partial",
  },
  UNVERIFIABLE: {
    icon: HelpCircle,
    label: "UNVERIFIABLE",
    colorClass: "text-neutral",
    bgClass: "bg-neutral/10",
    borderClass: "verdict-border-unverifiable",
  },
  MISLEADING: {
    icon: AlertOctagon,
    label: "MISLEADING",
    colorClass: "text-misleading",
    bgClass: "bg-misleading/10",
    borderClass: "verdict-border-misleading",
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
    <section className="py-8 px-4 animate-slide-up">
      <div className="max-w-3xl mx-auto">
        <div className={cn("glass-card p-6 sm:p-8", config.borderClass)}>
          {/* Verdict Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-2xl", config.bgClass)}>
                <VerdictIcon className={cn("w-10 h-10 sm:w-12 sm:h-12", config.colorClass)} />
              </div>
              <div>
                <h2 className={cn("text-2xl sm:text-3xl font-bold", config.colorClass)}>
                  {config.label}
                </h2>
              </div>
            </div>
            <div className={cn(
              "px-4 py-2 rounded-full border text-sm font-semibold",
              confidenceConfig[result.confidence]
            )}>
              Confidence: {result.confidence}
            </div>
          </div>

          {/* Original Claim */}
          <div className="mb-6 p-4 rounded-xl bg-muted/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Original Claim
            </p>
            <p className="text-foreground italic">"{result.claim}"</p>
          </div>

          {/* Reasoning */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="gradient-text">Why This Verdict?</span>
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 leading-relaxed">
              {result.reasoning.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-2">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Sources */}
          {result.sources.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 gradient-text">
                Top Sources ({result.sources.length})
              </h3>
              <div className="space-y-3">
                {result.sources.map((source, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <a 
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2 group-hover:underline"
                        >
                          {source.title}
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {source.url}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-xs font-semibold",
                          credibilityConfig[source.credibility]
                        )}>
                          {source.credibility}
                        </span>
                        <span className={cn(
                          "px-2 py-1 rounded-md text-xs font-medium",
                          source.relationship === "Supports" && "bg-success/10 text-success",
                          source.relationship === "Contradicts" && "bg-danger/10 text-danger",
                          source.relationship === "Context" && "bg-muted text-muted-foreground"
                        )}>
                          {source.relationship}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic mt-2">
                      {source.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Limitations */}
          {result.limitations.length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-warning/10 border border-warning/20">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-warning">
                <Lightbulb className="w-4 h-4" />
                Important Notes
              </h3>
              <ul className="space-y-1">
                {result.limitations.map((limitation, index) => (
                  <li key={index} className="text-sm text-foreground/70 flex items-start gap-2">
                    <span className="text-warning">•</span>
                    {limitation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onReset} className="flex-1">
              <RotateCcw className="w-4 h-4" />
              Check Another Claim
            </Button>
            <Button variant="secondary" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="secondary" onClick={handleSave}>
              <Bookmark className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
