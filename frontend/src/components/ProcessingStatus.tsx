import { Search, Brain, CheckCircle2, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessingStatusProps {
  currentStep: number;
  statusMessage: string;
}

const steps = [
  { icon: Search, label: "Web Search", description: "Scouring the web with Tavily", color: "from-blue-400 to-cyan-400" },
  { icon: Brain, label: "AI Analysis", description: "Multi-agent analysis in progress", color: "from-purple-400 to-pink-400" },
  { icon: CheckCircle2, label: "Generating Verdict", description: "Crafting your verdict", color: "from-emerald-400 to-teal-400" },
];

export const ProcessingStatus = ({ currentStep, statusMessage }: ProcessingStatusProps) => {
  return (
    <section className="py-16 px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-10 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-success/10 animate-gradient opacity-50" />
          
          {/* Timeline Container */}
          <div className="relative z-10">
            {/* Visual Timeline */}
            <div className="flex items-center justify-between mb-12">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <div key={step.label} className="flex flex-col items-center flex-1 relative">
                    {/* Connector line - Enhanced */}
                    {index < steps.length - 1 && (
                      <div className="absolute top-8 left-[calc(50%+2rem)] right-0 h-1 -translate-y-1/2">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-700 relative overflow-hidden",
                            isCompleted ? "bg-gradient-to-r from-success to-emerald-500" : "bg-border"
                          )}
                        >
                          {isCompleted && (
                            <div className="absolute inset-0 bg-gradient-to-r from-success via-emerald-400 to-success animate-pulse" />
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Step Circle - Enhanced with glow */}
                    <div className="relative mb-4 z-20">
                      {isActive && (
                        <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-primary via-primary to-cyan-500 blur-lg opacity-75 animate-pulse" />
                      )}
                      
                      <div
                        className={cn(
                          "relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 font-bold shadow-lg",
                          isActive && "bg-gradient-to-br from-primary to-cyan-500 text-white scale-110 shadow-2xl shadow-primary/50",
                          isCompleted && "bg-gradient-to-br from-success to-emerald-500 text-white",
                          !isActive && !isCompleted && "bg-muted text-muted-foreground"
                        )}
                      >
                        {isActive && (
                          <Loader className="w-7 h-7 animate-spin" />
                        )}
                        {isCompleted && !isActive && (
                          <CheckCircle2 className="w-7 h-7" />
                        )}
                        {!isActive && !isCompleted && (
                          <Icon className="w-7 h-7" />
                        )}
                      </div>
                    </div>

                    {/* Step Label and Description */}
                    <div className="text-center max-w-xs">
                      <p className={cn(
                        "font-bold text-sm transition-colors duration-300 mb-1",
                        isActive ? "text-primary text-lg" : isCompleted ? "text-success" : "text-muted-foreground"
                      )}>
                        {step.label}
                      </p>
                      <p className={cn(
                        "text-xs transition-colors duration-300 hidden sm:block",
                        isActive ? "text-primary/80 font-semibold" : isCompleted ? "text-success/70" : "text-muted-foreground/50"
                      )}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Status Message - Enhanced */}
            <div className="text-center mt-12 pt-8 border-t border-white/10">
              <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-cyan-500/10 text-primary border border-primary/30 shadow-lg shadow-primary/20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" />
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" style={{ animationDelay: "0.2s" }} />
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" style={{ animationDelay: "0.4s" }} />
                </div>
                <p className="text-base font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                  {statusMessage}
                </p>
              </div>

              {/* Progress percentage */}
              <div className="mt-6">
                <div className="inline-block px-4 py-2 rounded-lg bg-muted/50 text-muted-foreground text-xs font-semibold">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
                </div>
              </div>
            </div>

            {/* Animated info text */}
            <p className="text-center text-muted-foreground text-sm mt-8 italic">
              ✨ Our AI agents are working hard to verify your claim...
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          }
          50% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
          }
        }
      `}</style>
    </section>
  );
};
