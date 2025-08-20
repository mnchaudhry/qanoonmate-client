import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, ChevronLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
      <div className="container py-16 text-center max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-amber-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Profile Not Found
          </h2>
          
          <p className="text-slate-600 mb-8 leading-relaxed">
            We couldn&apos;t find the profile you&apos;re looking for. It may have been removed, 
            you might not have access to it, or there might be a temporary issue.
          </p>
          
          <div className="space-y-4">
            <Button asChild className="w-full" size="lg">
              <Link href="/client/dashboard">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            
            <div className="flex gap-3">
              <Button variant="outline" asChild className="flex-1">
                <Link href="/client/consultations">
                  <Search className="mr-2 h-4 w-4" />
                  View Consultations
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 mb-2">Still having trouble?</p>
            <Button variant="link" asChild className="text-xs p-0 h-auto">
              <Link href="/contact">
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
