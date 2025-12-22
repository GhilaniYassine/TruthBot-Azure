import { Sparkles, Zap, Shield } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-24 pb-12">
      {/* Animated gradient background with multiple layers */}
      <div className="absolute inset-0 gradient-bg animate-gradient opacity-95" />
      
      {/* Enhanced animated particles/orbs with layered effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary floating orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-primary/40 via-primary/20 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-tl from-primary-glow/30 via-primary/10 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: "-5s" }} />
        
        {/* Secondary accent orbs */}
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-bl from-success/20 to-transparent rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "-2s" }} />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
        
        {/* Tertiary subtle orbs */}
        <div className="absolute top-1/4 right-1/4 w-56 h-56 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "-4s" }} />
      </div>

      {/* Enhanced grid pattern overlay with glow */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(0deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Animated lines connecting points */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="url(#lineGradient)" strokeWidth="2" className="animate-pulse" />
        <line x1="90%" y1="20%" x2="10%" y2="80%" stroke="url(#lineGradient)" strokeWidth="2" className="animate-pulse" style={{ animationDelay: "0.5s" }} />
      </svg>

      {/* Content with enhanced styling */}
      <div className="relative z-10 text-center px-4 py-16 max-w-5xl mx-auto animate-fade-in">
        {/* Badge with glow effect */}
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 text-white/95 text-sm mb-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/20">
            <Zap className="w-4 h-4 text-success animate-pulse" />
            <span className="font-semibold">Live AI Powered</span>
          </div>
          <span>Real-Time Fact-Checking</span>
        </div>

        {/* Main heading with gradient and enhanced typography */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-lg">
          <span className="block">AI-Powered</span>
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg animate-pulse-slow">
            Fact-Checking
          </span>
          <span className="block">at Lightning Speed</span>
        </h1>

        {/* Subheading with improved styling */}
        <p className="text-xl sm:text-2xl text-white/85 max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-md font-light">
          Verify claims in seconds. Expose misinformation. Discover the truth with our
          <span className="block font-semibold text-white">multi-agent AI system backed by real-time web research.</span>
        </p>

        {/* Interactive CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#app"
            className="group px-8 py-4 rounded-full bg-gradient-to-r from-success to-emerald-500 text-white font-bold text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-success/50 active:scale-95 flex items-center gap-2 shadow-lg"
          >
            <Shield className="w-5 h-5 group-hover:animate-bounce" />
            Start Fact-Checking
          </a>
          <a
            href="#how-it-works"
            className="group px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold text-lg transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 group-hover:animate-spin" />
            How It Works
          </a>
        </div>

        {/* Stats/Features line */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-8 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>10,000+ Claims Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" style={{ animationDelay: "0.3s" }} />
            <span>99% Accuracy Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" style={{ animationDelay: "0.6s" }} />
            <span>Instant Results</span>
          </div>
        </div>
      </div>

      {/* Bottom fade with gradient blur */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </section>
  );
};
