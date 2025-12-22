import { Moon, Sun, HelpCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export const Header = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-glow rounded-xl opacity-20 animate-pulse-soft" />
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7 text-primary relative z-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
              <path d="m8 11 2 2 4-4" className="text-success" stroke="currentColor" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">TruthBot</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">AI-Powered Fact-Checking</p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            <HelpCircle className="w-4 h-4 mr-1" />
            How It Works
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Info className="w-4 h-4 mr-1" />
            About
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-warning" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
};
