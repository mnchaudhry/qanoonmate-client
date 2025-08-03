"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserPlus, Users, Upload, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'

const QuickActions = () => {
  const router = useRouter()

  const quickActions = [
    {
      id: 1,
      title: 'Book New Consultation',
      description: 'Schedule a consultation with a lawyer',
      icon: UserPlus,
      color: 'bg-primary text-primary-foreground',
      action: () => router.push('/client/book-consultation')
    },
    {
      id: 2,
      title: 'View Lawyers',
      description: 'Browse available lawyers',
      icon: Users,
      color: 'bg-secondary text-secondary-foreground',
      action: () => router.push('/lawyers')
    },
    {
      id: 3,
      title: 'Upload Docs',
      description: 'Upload legal documents',
      icon: Upload,
      color: 'bg-accent text-accent-foreground',
      action: () => router.push('/client/documents')
    }
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[30rem] overflow-y-auto">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            className="w-full justify-start h-auto p-4 hover:bg-accent/50 transition-colors max-h-max "
            onClick={action.action}
          >
            <div className="flex items-center gap-3 w-full">
              <div className={`p-2 rounded-lg ${action.color}`}>
                <action.icon className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="font-medium text-foreground text-sm">
                  {action.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {action.description}
                </div>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

export default QuickActions
