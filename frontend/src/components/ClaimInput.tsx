import { useState } from "react";
import { Search, Zap, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ClaimInputProps {
  onSubmit: (claim: string) => void;
  isLoading: boolean;
}

export const ClaimInput = ({ onSubmit, isLoading }: ClaimInputProps) => {
  const [claim, setClaim] = useState("");
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!claim.trim()) {
      setError("Please enter a claim to fact-check");
      return;
    }
    
    setError("");
    onSubmit(claim.trim());
  };

  const exampleClaims = [
    "The moon landing was faked",
    "Climate change is caused by humans",
    "Vaccines cause autism",
  ];

  return (
    <section className="relative z-20 -mt-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Decorative background glow */}
        <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-cyan-500/10 blur-2xl opacity-60 -z-10" />
        
        <div className="glass-card-hover p-8 sm:p-10 rounded-2xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <form onSubmit={handleSubmit}>
            {/* Label with icon */}
            <label className="flex items-center gap-3 text-xl font-black text-foreground mb-6">
              <div className="p-2 rounded-lg bg-primary/20">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </div>
              What claim would you like to fact-check?
            </label>

            {/* Enhanced input field */}
            <div className="relative group">
              <input
                type="text"
                value={claim}
                onChange={(e) => {
                  setClaim(e.target.value);
                  if (error) setError("");
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="e.g., 'The Great Wall of China is visible from space'"
                disabled={isLoading}
                className={cn(
                  "w-full h-16 px-6 pr-16 text-lg rounded-xl border-2 bg-gradient-to-r from-background via-background to-primary/5 transition-all duration-300 outline-none font-medium placeholder:text-muted-foreground/50",
                  isFocused 
                    ? "border-primary ring-4 ring-primary/20 shadow-lg shadow-primary/20 scale-105" 
                    : "border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10",
                  error && "border-danger animate-shake",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              />
              <Search className={cn(
                "absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 transition-all duration-300",
                isFocused ? "text-primary scale-110" : "text-muted-foreground"
              )} />
            </div>

            {/* Error message with animation */}
            {error && (
              <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm animate-slide-down">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Example claims suggestions */}
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-sm font-semibold text-muted-foreground">Quick Examples:</span>
              <div className="flex flex-wrap gap-2">
                {exampleClaims.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => {
                      setClaim(example);
                      setError("");
                    }}
                    className="text-sm px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-cyan-500/10 text-foreground hover:from-primary/20 hover:to-cyan-500/20 border border-primary/20 hover:border-primary/40 transition-all duration-200 hover:scale-105 font-semibold"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit button - Enhanced */}
            <Button
              type="submit"
              variant="hero"
              size="xl"
              disabled={isLoading || !claim.trim()}
              className={cn(
                "w-full mt-8 h-16 text-lg font-bold transition-all duration-300 group",
                isLoading && "opacity-75"
              )}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Claim...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>Verify This Claim</span>
                  <Zap className="w-5 h-5 group-hover:animate-pulse transition-all" />
                </div>
              )}
            </Button>

            {/* Info text */}
            <p className="text-center text-muted-foreground text-xs mt-4 font-medium">
              ⚡ Powered by AI Agents · Instant Results · Real-Time Web Search
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </section>
  );
};
