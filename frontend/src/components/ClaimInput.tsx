import { useState } from "react";
import { Search, Zap, AlertCircle } from "lucide-react";
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
    <section className="relative z-20 -mt-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="glass-card-hover p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            <label className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
              <span className="text-xl">📝</span>
              What claim would you like to fact-check?
            </label>

            <div className="relative">
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
                  "w-full h-14 px-5 pr-12 text-base rounded-xl border-2 bg-background transition-all duration-300 outline-none",
                  isFocused 
                    ? "border-primary ring-4 ring-primary/10" 
                    : "border-border hover:border-primary/50",
                  error && "border-danger animate-shake"
                )}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>

            {error && (
              <div className="flex items-center gap-2 mt-3 text-danger text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Try:</span>
              {exampleClaims.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setClaim(example)}
                  className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                >
                  {example}
                </button>
              ))}
            </div>

            <Button
              type="submit"
              variant="hero"
              size="xl"
              disabled={isLoading}
              className="w-full mt-6"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <Zap className="w-4 h-4 -ml-2" />
                  Verify This Claim
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
