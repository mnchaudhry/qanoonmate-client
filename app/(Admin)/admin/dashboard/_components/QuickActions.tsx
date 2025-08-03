"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload, UserCheck, BookOpen, Book, Hash } from "lucide-react"

const quickActions = [
  {
    title: "Add New Law",
    icon: Plus,
    description: "Create a new legal act",
    action: () => console.log("Add new law"),
    bgColor: "bg-primary/10",
    iconColor: "text-primary"
  },
  {
    title: "Bulk Upload PDFs",
    icon: Upload,
    description: "Upload multiple legal documents",
    action: () => console.log("Bulk upload"),
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600"
  },
  {
    title: "Review Pending Lawyers",
    icon: UserCheck,
    description: "Verify lawyer applications",
    action: () => console.log("Review lawyers"),
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600"
  },
  {
    title: "Verify Legal FAQs",
    icon: BookOpen,
    description: "Approve submitted FAQs",
    action: () => console.log("Verify FAQs"),
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    title: "Approve Legal Guides",
    icon: Book,
    description: "Review and approve guides",
    action: () => console.log("Approve guides"),
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    title: "Moderate Dictionary Terms",
    icon: Hash,
    description: "Review dictionary submissions",
    action: () => console.log("Moderate terms"),
    bgColor: "bg-rose-50",
    iconColor: "text-rose-600"
  }
]

export default function QuickActions() {
  return (
    <Card className="border-border mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          🔍 Action Shortcuts / Quick Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-primary/5 border-border"
              onClick={action.action}
            >
              <div className={`w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center`}>
                <action.icon className={`h-5 w-5 ${action.iconColor}`} />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-foreground">{action.title}</h4>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
