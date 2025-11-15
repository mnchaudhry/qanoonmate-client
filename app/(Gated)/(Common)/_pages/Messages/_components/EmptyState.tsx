import React from "react";
import { MessageCircle, ShieldCheck } from "lucide-react";
import Logo from '@/components/Logo';

const EmptyState = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full bg-surface/80 backdrop-blur-sm p-8 rounded-2xl">


      {/* Logo Section */}
      <div className="flex flex-col items-center gap-3 mb-6">
        <Logo size="sm" type="green" />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">End-to-End Encrypted</span>
        </div>
      </div>

      {/* Title Section */}
      <div className="text-center space-y-2 mb-8 max-w-md">
        <h3 className="text-xl font-semibold text-foreground">
          Start a Secure Conversation
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Connect with verified lawyers to get expert legal help—fast, confidential, and secure.
        </p>
      </div>

      {/* CTA */}
      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface border border-border text-muted-foreground">
        <MessageCircle className="w-4 h-4" />
        <span className="text-sm">Select a conversation to start</span>
      </div>

    </div>
  );
};

export default EmptyState;
