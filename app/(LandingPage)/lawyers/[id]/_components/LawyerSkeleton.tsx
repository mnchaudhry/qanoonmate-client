import { Skeleton } from "@/components/ui/skeleton";

export default function LawyerSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Banner Loading Skeleton */}
      <div className="rounded-lg border border-gray-200 p-6 bg-white">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="flex-1 w-full">
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-6 w-full mb-6" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2">
          {/* Details Loading Skeleton */}
          <div className="rounded-lg border border-gray-200 shadow-sm p-6 bg-white">
            <Skeleton className="h-8 w-1/4 mb-3" />
            <Skeleton className="h-20 w-full mb-6" />
            
            <Skeleton className="h-8 w-1/4 mb-3" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-6" />
            
            <Skeleton className="h-8 w-1/4 mb-3" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-6" />
            
            <Skeleton className="h-8 w-1/4 mb-3" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
          
          {/* Reviews Loading Skeleton */}
          <div className="mt-8 rounded-lg border border-gray-200 shadow-sm p-6 bg-white">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-6" />
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-24 w-full mb-6" />
            <div className="flex justify-center">
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
          
          {/* Related Info Loading Skeleton */}
          <div className="mt-8 rounded-lg border border-gray-200 shadow-sm p-6 bg-white">
            <Skeleton className="h-8 w-1/3 mb-6" />
            <Skeleton className="h-6 w-1/4 mb-3" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-6" />
            
            <Skeleton className="h-6 w-1/4 mb-3" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-6" />
            
            <Skeleton className="h-6 w-1/4 mb-3" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
        
        {/* Consultation Loading Skeleton */}
        <div className="md:col-span-1">
          <div className="rounded-lg border border-gray-200 shadow-md p-6 bg-white">
            <Skeleton className="h-8 w-3/4 mb-6" />
            <Skeleton className="h-6 w-1/2 mb-3" />
            <Skeleton className="h-20 w-full mb-6" />
            
            <Skeleton className="h-6 w-1/2 mb-3" />
            <Skeleton className="h-12 w-full mb-6" />
            
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
