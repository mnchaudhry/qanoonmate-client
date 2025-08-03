"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronRight, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react"

const consultations = [
  {
    id: 1,
    clientName: "Ahmad Khan",
    caseType: "Property Dispute",
    status: "scheduled",
    date: "Today 2:00 PM",
    fee: "PKR 3,000",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 2,
    clientName: "Sarah Ahmed",
    caseType: "Contract Review",
    status: "completed",
    date: "Yesterday",
    fee: "PKR 2,500",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 3,
    clientName: "Hassan Ali",
    caseType: "Criminal Defense",
    status: "pending",
    date: "Tomorrow 10:00 AM",
    fee: "PKR 5,000",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 4,
    clientName: "Fatima Shah",
    caseType: "Family Law",
    status: "in-progress",
    date: "Dec 15, 2024",
    fee: "PKR 4,000",
    avatar: "/api/placeholder/32/32"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "scheduled": return "bg-primary/10 text-primary border-primary/20"
    case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "pending": return "bg-amber-50 text-amber-700 border-amber-200"
    case "in-progress": return "bg-purple-50 text-purple-700 border-purple-200"
    default: return "bg-muted text-muted-foreground border-border"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "scheduled": return <Clock className="h-4 w-4" />
    case "completed": return <CheckCircle className="h-4 w-4" />
    case "pending": return <AlertCircle className="h-4 w-4" />
    case "in-progress": return <XCircle className="h-4 w-4" />
    default: return null
  }
}

export default function ConsultationRequests() {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">Recent Consultations</CardTitle>
            <CardDescription className="text-muted-foreground">Your latest client interactions</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <div key={consultation.id} className="flex items-center justify-between p-4 bg-surface rounded-lg hover:bg-surface/80 transition-colors">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={consultation.avatar} alt={consultation.clientName} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {consultation.clientName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-foreground">{consultation.clientName}</h4>
                  <p className="text-sm text-muted-foreground">{consultation.caseType}</p>
                  <p className="text-xs text-muted-foreground">{consultation.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={getStatusColor(consultation.status)}>
                  {getStatusIcon(consultation.status)}
                  <span className="ml-1 capitalize">{consultation.status}</span>
                </Badge>
                <span className="text-sm font-medium text-foreground">{consultation.fee}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
