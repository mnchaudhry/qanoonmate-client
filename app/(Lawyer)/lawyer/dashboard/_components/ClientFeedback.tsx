"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ChevronRight, MessageSquare } from "lucide-react"

const feedbacks = [
  {
    id: 1,
    clientName: "Ahmad Khan",
    rating: 5,
    review: "Excellent service! Very professional and knowledgeable about property law.",
    date: "2 days ago",
    caseType: "Property Dispute",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 2,
    clientName: "Sarah Ahmed",
    rating: 5,
    review: "Great experience with contract review. Highly recommend!",
    date: "1 week ago",
    caseType: "Contract Review",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 3,
    clientName: "Hassan Ali",
    rating: 4,
    review: "Good legal advice, responded quickly to all my questions.",
    date: "2 weeks ago",
    caseType: "Criminal Defense",
    avatar: "/api/placeholder/32/32"
  }
]

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${
        i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
      }`}
    />
  ))
}

export default function ClientFeedback() {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">Client Feedback</CardTitle>
            <CardDescription className="text-muted-foreground">Recent reviews from your clients</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="max-h-[29rem] overflow-y-auto " >
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="flex items-start space-x-4 p-4 bg-surface rounded-lg hover:bg-surface/80 transition-colors">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={feedback.avatar} alt={feedback.clientName} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {feedback.clientName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">{feedback.clientName}</h4>
                  <span className="text-xs text-muted-foreground">{feedback.date}</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center">
                    {renderStars(feedback.rating)}
                  </div>
                  <Badge variant="outline" className="border-primary/20 text-primary">
                    {feedback.caseType}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2 truncate">{feedback.review}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <div>
              <h4 className="font-medium text-foreground">Overall Rating</h4>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center">
                  {renderStars(5)}
                </div>
                <span className="text-sm font-medium text-foreground">4.8/5</span>
                <span className="text-xs text-muted-foreground">(47 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
