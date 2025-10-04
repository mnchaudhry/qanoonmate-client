import Logo from "@/components/Logo";
import React from "react";
import { Sparkles, Scale, FileText, MessageCircle } from "lucide-react";

const DefaultScreen = () => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 space-y-8 max-w-4xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
          <Logo size="lg" type="green" className="w-32 relative" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">
          Welcome to <span className="text-primary">QanoonMate</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-md text-sm md:text-base">
          Your AI-powered legal assistant for Pakistani law. Ask any legal
          question to get started.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Scale className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-sm text-center mb-2">
            Legal Research
          </h3>
          <p className="text-xs text-muted-foreground text-center">
            Get instant answers based on Pakistani law and precedents
          </p>
        </div>

        <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-sm text-center mb-2">
            Document Analysis
          </h3>
          <p className="text-xs text-muted-foreground text-center">
            Upload and analyze legal documents with AI assistance
          </p>
        </div>

        <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-sm text-center mb-2">
            Expert Guidance
          </h3>
          <p className="text-xs text-muted-foreground text-center">
            Receive detailed explanations in English or Urdu
          </p>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground animate-in fade-in duration-700 delay-300">
        <Sparkles className="w-4 h-4 text-primary" />
        <span>
          Pro tip: Be specific with your legal questions for better results
        </span>
      </div>
    </div>
  );
};

export default DefaultScreen;
