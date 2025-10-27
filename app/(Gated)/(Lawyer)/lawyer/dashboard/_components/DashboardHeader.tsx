"use client"

import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/store/store"
import { Calendar } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function DashboardHeader() {

  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, Advocate {user?.firstname}!</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your practice today.</p>
      </div>
      <div className="flex gap-3">
        <Button onClick={() => router.push('/lawyer/calendar')} variant="outline" size="sm" className="border-primary/20 text-primary hover:bg-primary/5">
          <Calendar className="h-4 w-4 mr-2" />
          View Calendar
        </Button>
      </div>
    </div>
  )
}
