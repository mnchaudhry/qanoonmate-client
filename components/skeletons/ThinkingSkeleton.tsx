import { QuickActionSkeleton } from "./QuickActionSkeleton";

export const ThinkingSkeleton = () => {
  return (
    <div className="max-w-[70%] ">
      <QuickActionSkeleton />
      <div className="mt-3 flex items-center gap-2 px-1">
        <div className="flex gap-1">
          <span className="inline-block w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} ></span>
          <span className="inline-block w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}                ></span>
          <span className="inline-block w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} ></span>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          Thinking...
        </span>
      </div>
    </div>
  );
};
