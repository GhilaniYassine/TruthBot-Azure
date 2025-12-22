import { Search, Brain, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessingStatusProps {
  currentStep: number;
  statusMessage: string;
}

const steps = [
  { icon: Search, label: "Web Search", description: "Searching with Tavily" },
  { icon: Brain, label: "AI Analysis", description: "Processing with agents" },
  { icon: CheckCircle2, label: "Generating Verdict", description: "Finalizing results" },
];

export const ProcessingStatus = ({ currentStep, statusMessage }: ProcessingStatusProps) => {
  return (
    <section className="py-12 px-4 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="glass-card p-8">
          {/* Timeline */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.label} className="flex flex-col items-center flex-1">
                  <div className="relative">
                    {/* Connector line */}
                    {index < steps.length - 1 && (
                      <div 
                        className={cn(
                          "absolute top-1/2 left-full w-full h-0.5 -translate-y-1/2 transition-colors duration-500",
                          isCompleted ? "bg-success" : "bg-border"
                        )}
                        style={{ width: 'calc(100% + 2rem)', left: '100%', marginLeft: '0.5rem' }}
                      />
                    )}
                    
                    {/* Step circle */}
                    <div
                      className={cn(
                        "relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500",
                        isActive && "bg-primary text-primary-foreground animate-pulse-soft shadow-lg shadow-primary/30",
                        isCompleted && "bg-success text-success-foreground",
                        !isActive && !isCompleted && "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <p className={cn(
                      "font-semibold text-sm transition-colors duration-300",
                      isActive ? "text-primary" : isCompleted ? "text-success" : "text-muted-foreground"
                    )}>
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status message */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 text-primary">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-lg font-medium">{statusMessage}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
