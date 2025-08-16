"use client"

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Phone } from 'lucide-react'

export default function ContactSection({ }: { email?: string; phone?: string }) {
  return (
    <Card className="border border-border p-6">
      <div className="text-foreground font-semibold mb-4">Contact</div>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="w-4 h-4" />
          <span>{'Not provided'}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="w-4 h-4" />
          <span>{'Not provided'}</span>
        </div>
        <div className="pt-2">
          <Button className="bg-primary hover:bg-primary/90">Send Message</Button>
        </div>
      </div>
    </Card>
  )
}


