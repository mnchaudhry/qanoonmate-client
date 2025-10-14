import { Card } from "@/components/ui/card";
import { Bot, Sparkles } from "lucide-react";

export const ThinkingSkeleton = () => {
  return (
    <div className="flex gap-3 p-4 animate-in fade-in-50 duration-500">
      {/* Bot Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
          <Bot className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Thinking Content */}
      <Card className="flex-1 p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-center gap-3">
          {/* Animated Sparkles Icon */}
          <div className="animate-spin-slow">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>

          {/* Animated Dots */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-primary">Thinking</span>
            <div className="flex gap-1">
              <span
                className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></span>
            </div>
          </div>
        </div>

        {/* Subtle animated bar */}
        <div className="mt-3 h-1 bg-primary/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary/40 to-primary/60 animate-shimmer"></div>
        </div>
      </Card>
    </div>
  );
};
