import React from "react";
import { MessageCircle, ShieldCheck } from "lucide-react";
import Logo from '@/components/Logo';
import { Button } from "@/components/ui/button";

const EmptyState = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full bg-white p-8 rounded-2xl shadow-xl border border-border overflow-hidden">
      <div className="relative z-10 flex flex-col items-center gap-2 mb-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shadow-lg">
          <Logo size="sm" type="green" />
        </div>
        <ShieldCheck className="w-8 h-8 text-primary mt-2" />
      </div>
      <div className="relative z-10 text-center space-y-2 mb-4 text-muted-foreground">
        <h3 className="text-xl font-semibold">Start a Secure Conversation</h3>
        <p className="text-sm max-w-sm mx-auto">
          Your messages are private and protected. Connect with a verified lawyer to get expert legal help—fast, confidential, and secure.
        </p>
      </div>
      <div className="relative z-10 pt-4">
        <Button className="inline-flex items-center rounded-full shadow transition">
          <MessageCircle className="w-5 h-5 mr-2" />
          Start New Conversation
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
