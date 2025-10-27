import React from "react";
import { MessageCircle, ShieldCheck, Lock, Zap } from "lucide-react";
import Logo from '@/components/Logo';

const EmptyState = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full bg-gradient-to-br from-background via-surface/30 to-background p-8 rounded-2xl border !border-border overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-primary blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 mb-8">
        <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center shadow-lg border !border-primary/20">
          <Logo size="sm" type="green" />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border !border-primary/20">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary">End-to-End Encrypted</span>
        </div>
      </div>

      <div className="relative z-10 text-center space-y-3 mb-8 max-w-md">
        <h3 className="text-2xl font-bold text-foreground">Start a Secure Conversation</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your messages are private and protected. Connect with verified lawyers to get expert legal help—fast, confidential, and secure.
        </p>
      </div>

      {/* Features */}
      <div className="relative z-10 grid grid-cols-1 gap-3 mb-8 w-full max-w-sm">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface/50 border !border-border">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Private & Secure</p>
            <p className="text-xs text-muted-foreground">Your data is protected</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface/50 border !border-border">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Instant Responses</p>
            <p className="text-xs text-muted-foreground">Real-time communication</p>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/5 border !border-primary/20 text-primary">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Select a conversation to start</span>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
