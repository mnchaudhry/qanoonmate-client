"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, User, FileText, ChevronRight } from "lucide-react"

const upcomingConsultations = [
  {
    id: 1,
    client: "Ahmad Khan",
    lawyer: "Advocate Sarah",
    time: "2:00 PM",
    date: "Today",
    type: "Property Dispute",
    status: "confirmed"
  },
  {
    id: 2,
    client: "Fatima Ali",
    lawyer: "Advocate Hassan",
    time: "10:30 AM",
    date: "Tomorrow",
    type: "Family Law",
    status: "pending"
  },
  {
    id: 3,
    client: "Raza Ahmed",
    lawyer: "Advocate Zara",
    time: "4:00 PM",
    date: "Dec 15",
    type: "Contract Review",
    status: "confirmed"
  }
]

const submissionLogs = [
  {
    id: 1,
    action: "Legal guide submitted",
    user: "Advocate Ahmed J.",
    timestamp: "2:15 PM",
    type: "submission"
  },
  {
    id: 2,
    action: "FAQ updated",
    user: "Admin User",
    timestamp: "1:30 PM",
    type: "update"
  },
  {
    id: 3,
    action: "Dictionary term added",
    user: "Advocate Sarah",
    timestamp: "11:45 AM",
    type: "creation"
  },
  {
    id: 4,
    action: "Case law reviewed",
    user: "Moderator",
    timestamp: "10:20 AM",
    type: "review"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed": return "bg-emerald-50 text-emerald-700"
    case "pending": return "bg-amber-50 text-amber-700"
    default: return "bg-muted text-muted-foreground"
  }
}

const getLogTypeColor = (type: string) => {
  switch (type) {
    case "submission": return "bg-primary/10 text-primary"
    case "update": return "bg-blue-50 text-blue-700"
    case "creation": return "bg-emerald-50 text-emerald-700"
    case "review": return "bg-purple-50 text-purple-700"
    default: return "bg-muted text-muted-foreground"
  }
}

export default function CalendarLogsPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Upcoming Consultations */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              📅 Upcoming Consultations
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingConsultations.map((consultation) => (
              <div key={consultation.id} className="flex items-center justify-between p-3 bg-surface rounded-lg hover:bg-surface/80 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{consultation.client}</h4>
                    <p className="text-xs text-muted-foreground">{consultation.lawyer}</p>
                    <p className="text-xs text-muted-foreground">{consultation.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{consultation.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{consultation.date}</p>
                  <Badge className={`mt-1 ${getStatusColor(consultation.status)}`}>
                    {consultation.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legal Submission Logs */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              🧾 Legal Submission Logs
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {submissionLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-surface rounded-lg hover:bg-surface/80 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getLogTypeColor(log.type)}`}>
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{log.action}</h4>
                    <p className="text-xs text-muted-foreground">{log.user}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                  <Badge className={`mt-1 ${getLogTypeColor(log.type)}`}>
                    {log.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
