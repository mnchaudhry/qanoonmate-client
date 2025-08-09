"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ChevronRight, Video, MapPin, Users } from "lucide-react"

const upcomingEvents = [
  {
    id: 1,
    title: "Client Meeting - Property Dispute",
    client: "Ahmad Khan",
    time: "2:00 PM - 3:00 PM",
    date: "Today",
    type: "meeting",
    location: "Office",
    status: "confirmed"
  },
  {
    id: 2,
    title: "Court Hearing - Criminal Case",
    client: "Hassan Ali",
    time: "10:00 AM - 12:00 PM",
    date: "Tomorrow",
    type: "hearing",
    location: "District Court",
    status: "scheduled"
  },
  {
    id: 3,
    title: "Virtual Consultation",
    client: "Fatima Shah",
    time: "4:00 PM - 5:00 PM",
    date: "Dec 15",
    type: "consultation",
    location: "Online",
    status: "pending"
  }
]

const getEventIcon = (type: string) => {
  switch (type) {
    case "meeting": return <Users className="h-4 w-4" />
    case "hearing": return <Calendar className="h-4 w-4" />
    case "consultation": return <Video className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed": return "bg-primary/10 text-primary border-primary/20"
    case "scheduled": return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "pending": return "bg-amber-50 text-amber-700 border-amber-200"
    default: return "bg-muted text-muted-foreground !border-border"
  }
}

export default function CalendarSchedule() {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">Calendar & Schedule</CardTitle>
            <CardDescription className="text-muted-foreground">Your upcoming appointments</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
            View Calendar
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="max-h-[29rem] overflow-y-auto " >
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-4 bg-surface rounded-lg hover:bg-surface/80 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {getEventIcon(event.type)}
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.client}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{event.time}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{event.location}</span>
                  </div>
                </div>
              </div>
              <Badge className={getStatusColor(event.status)}>
                {event.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
