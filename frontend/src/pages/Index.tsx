import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ClaimInput } from "@/components/ClaimInput";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { VerdictDisplay } from "@/components/VerdictDisplay";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";
import { toast } from "@/hooks/use-toast";
import { factCheckClaim, parseVerdict, type ParsedVerdict } from "@/services/api";

const statusMessages = [
  "🔎 Searching the web for credible sources...",
  "🤖 AI agents are analyzing the evidence...",
  "✨ Generating comprehensive verdict...",
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [result, setResult] = useState<ParsedVerdict | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (claim: string) => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    setCurrentStep(0);
    setStatusMessage(statusMessages[0]);

    try {
      // Simulate step progression
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCurrentStep(1);
      setStatusMessage(statusMessages[1]);

      // Call the actual API
      const apiResponse = await factCheckClaim(claim);

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || "Fact-checking failed");
      }

      await new Promise((resolve) => setTimeout(resolve, 800));
      setCurrentStep(2);
      setStatusMessage(statusMessages[2]);

      // Parse the markdown verdict response
      const parsedVerdict = parseVerdict(
        apiResponse.verdict,
        apiResponse.claim,
        apiResponse.search_results_count
      );

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Set the parsed result
      setResult(parsedVerdict);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred while fact-checking";
      setError(errorMessage);
      console.error("Fact-check error:", err);
      
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
    setResult(null);
    setCurrentStep(0);
    setStatusMessage("");
  };

  return (
    <>
      <Helmet>
        <title>TruthBot - AI-Powered Fact-Checking Platform</title>
        <meta 
          name="description" 
          content="Verify claims, expose misinformation, and discover the truth with TruthBot's multi-agent AI system backed by real-time web research." 
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          <HeroSection />
          
          {!result && !error && (
            <ClaimInput onSubmit={handleSubmit} isLoading={isLoading} />
          )}

          {error && (
            <section className="py-12 px-4">
              <div className="max-w-3xl mx-auto">
                <div className="glass-card p-8 border-l-4 border-red-500 bg-red-50 dark:bg-red-950">
                  <div className="flex gap-4">
                    <div className="text-4xl">⚠️</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
                        Fact-Checking Error
                      </h3>
                      <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
                      <button
                        onClick={() => {
                          setError(null);
                          setResult(null);
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        Try Another Claim
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {isLoading && (
            <ProcessingStatus 
              currentStep={currentStep} 
              statusMessage={statusMessage} 
            />
          )}

          {result && (
            <VerdictDisplay 
              result={result} 
              onReset={() => {
                setResult(null);
                setError(null);
              }} 
            />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
