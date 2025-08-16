import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoadingFeedbackPage() {
  return (
    <div className="container py-6 max-w-4xl">
      {/* Back button skeleton */}
      <div className="mb-6">
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* Page Title skeleton */}
      <Skeleton className="h-8 w-3/4 mb-8" />
      
      {/* Consultation Summary skeleton */}
      <Card className="mb-6">
        <CardHeader className="bg-gray-50 border-b">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Rating Section skeleton */}
      <Card className="mb-6">
        <CardHeader className="bg-gray-50 border-b">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-center md:justify-start mb-6">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full" />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4 mb-3" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Review Text Area skeleton */}
      <Card className="mb-6">
        <CardHeader className="bg-gray-50 border-b">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-4">
          <Skeleton className="h-[150px] w-full" />
          <div className="flex justify-between items-center mt-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardContent>
      </Card>
      
      {/* Other components skeletons */}
      <Card className="mb-6">
        <CardHeader className="bg-gray-50 border-b">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Skeleton className="h-4 w-4 rounded mt-1" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Skeleton className="h-4 w-4 rounded mt-1" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Submit Button skeleton */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Skeleton className="h-5 w-full sm:w-2/3" />
          <Skeleton className="h-10 w-full sm:w-48" />
        </CardContent>
      </Card>
    </div>
  );
}
