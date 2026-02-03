"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAnalyticsSearchTrends } from "@/store/api"
import { Brain, ChevronRight, Star, TrendingUp, Trophy } from "lucide-react"
import { useEffect, useState } from 'react'

export default function AIInsights() {
  const [searchTerms, setSearchTerms] = useState<string[]>([]);

  useEffect(() => {
    getAnalyticsSearchTrends({}).then(res => {
      const terms = res.data.data.topSearches || [];
      setSearchTerms(terms.slice(0, 3).map((t: any) => t.term));
    }).catch(err => console.error(err));
  }, []);

  const insights = [
    {
      title: "Top Search Terms",
      items: searchTerms.length > 0 ? searchTerms : ["No enough data yet"],
      icon: TrendingUp,
      color: "text-primary"
    },
    {
      title: "Content Gaps",
      items: ["Users searching for 'Cyber Crime' but finding 0 results"],
      icon: Star,
      color: "text-amber-600"
    },
    {
      title: "Top Performers",
      items: ["Most Active Consultant: Advocate Ali", "Top Category: Family Law"],
      icon: Trophy,
      color: "text-emerald-600"
    }
  ]

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Platform Insights
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
