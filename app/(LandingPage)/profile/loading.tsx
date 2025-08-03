import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Calendar, MessageSquare, Settings } from "lucide-react";

export default function LoadingProfile() {
  return (
    <div className="container py-6">
      <Skeleton className="h-10 w-48 mb-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Info */}
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center text-lg">
                <UserCircle className="mr-2 h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2">
                <Skeleton className="h-5 w-32" />
                <div className="flex space-x-4 mt-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-40" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Profile Photo */}
        <div className="md:col-span-1">
          <Card className="mb-6">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center text-lg">
                <UserCircle className="mr-2 h-5 w-5" />
                Profile Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 mb-6">
                <Skeleton className="h-full w-full rounded-full" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Consultation Bookings */}
      <Card className="mb-6">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center text-lg">
            <Calendar className="mr-2 h-5 w-5" />
            Consultation Bookings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="bg-gray-50 h-10 mb-2" />
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full mb-2" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Feedback History */}
      <Card className="mb-6">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center text-lg">
            <MessageSquare className="mr-2 h-5 w-5" />
            Feedback History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full mb-4" />
          ))}
        </CardContent>
      </Card>
      
      {/* Account Settings */}
      <Card className="mb-6">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center text-lg">
            <Settings className="mr-2 h-5 w-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {[1, 2, 3].map((section) => (
              <div key={section}>
                <Skeleton className="h-5 w-40 mb-3" />
                <div className="space-y-3">
                  {[1, 2].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
