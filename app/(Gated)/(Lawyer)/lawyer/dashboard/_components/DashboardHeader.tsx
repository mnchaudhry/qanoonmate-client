"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Plus } from "lucide-react"

export default function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, Advocate Sarah!</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your practice today.</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" size="sm" className="border-primary/20 text-primary hover:bg-primary/5">
          <Calendar className="h-4 w-4 mr-2" />
          View Calendar
        </Button>
        <Button size="sm" className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Case
        </Button>
      </div>
    </div>
  )
}
