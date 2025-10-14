import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

export const QuickActionSkeleton = () => {
  return (
    <div className="mt-3 px-4 py-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20 shadow-sm animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-3 h-3 text-primary animate-spin-slow" />
        <Skeleton className="h-3 w-24 bg-primary/30" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-full bg-primary/20" />
        <Skeleton className="h-3 w-4/5 bg-primary/20" />
      </div>
    </div>
  );
};
