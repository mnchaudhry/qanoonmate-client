"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LawyerNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Lawyer Not Found</h1>
      <p className="text-gray-600 mb-8 max-w-lg mx-auto">
        We couldn&apos;t find the lawyer you&apos;re looking for. They may have moved or the URL may be incorrect.
      </p>
      <Button asChild>
        <Link href="/lawyers">Browse All Lawyers</Link>
      </Button>
    </div>
  );
}
