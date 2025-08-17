"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, Star, Trophy, ChevronRight } from "lucide-react"

const insights = [
  {
    title: "Most Asked Topics This Week",
    items: ["Khula", "Bail", "Land Disputes"],
    icon: TrendingUp,
    color: "text-primary"
  },
  {
    title: "Draft Completion Suggestions",
    items: ["8 guides missing Urdu versions"],
    icon: Star,
    color: "text-amber-600"
  },
  {
    title: "Top Performers",
    items: ["Most Active Lawyer: Ali Z.", "Top Consultation: Property Dispute"],
    icon: Trophy,
    color: "text-emerald-600"
  }
]

export default function AIInsights() {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            AI Insights & Suggestions
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
            View More
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 bg-surface rounded-lg border border-border">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <insight.icon className={`h-5 w-5 ${insight.color}`} />
                </div>
                <h4 className="font-medium text-foreground">{insight.title}</h4>
              </div>
              <div className="space-y-2">
                {insight.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* AI Summary */}
        <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-foreground">AI Summary</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Platform activity is up 15% this week with increased focus on family law consultations. 
            Consider expanding Urdu content for better accessibility.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
