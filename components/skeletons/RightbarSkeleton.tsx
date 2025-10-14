import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const RightbarSkeleton = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Legal Context Skeleton */}
      <Card className="py-0">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </CardContent>
      </Card>

      {/* Key References Skeleton */}
      <Card className="py-0">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-28" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-16 w-full rounded" />
          <Skeleton className="h-16 w-full rounded" />
          <Skeleton className="h-16 w-full rounded" />
        </CardContent>
      </Card>

      {/* Related Cases Skeleton */}
      <Card className="py-0">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-28" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-14 w-full rounded" />
          <Skeleton className="h-14 w-full rounded" />
        </CardContent>
      </Card>

      {/* Referenced Links Skeleton */}
      <Card className="py-0">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
        </CardContent>
      </Card>
    </div>
  );
};
