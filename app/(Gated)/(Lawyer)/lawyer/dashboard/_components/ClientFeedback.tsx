"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, ChevronRight, MessageSquare, AlertCircle } from "lucide-react"
import { formatDistanceToNow, parseISO } from 'date-fns'
import Link from "next/link"

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
    />
  ))
}

export default function ClientFeedback() {
  const dispatch = useAppDispatch()
  const reviews: any = []
  const { isLoading, error, dashboardStats } = useAppSelector(state => state.lawyer)

  useEffect(() => {
  }, [dispatch])

  if (isLoading && reviews.length === 0) {
    return (
      <Card className="border-border h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">Client Feedback</CardTitle>
              <CardDescription className="text-muted-foreground">Recent reviews from your clients</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5" disabled>
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="max-h-[29rem] overflow-y-auto">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-4 p-4 bg-surface rounded-lg">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-border h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Client Feedback</CardTitle>
          <CardDescription className="text-muted-foreground">Recent reviews from your clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Failed to load reviews</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => { }}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Card className="border-border h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Client Feedback</CardTitle>
          <CardDescription className="text-muted-foreground">Recent reviews from your clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No reviews yet</p>
            <p className="text-xs text-muted-foreground mt-2">Client reviews will appear here after consultations</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate average rating
  const averageRating = dashboardStats?.averageRating ||
    (reviews.reduce((sum: any, r: any) => sum + r.rating, 0) / reviews.length)

  return (
    <Card className="border-border h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">Client Feedback</CardTitle>
            <CardDescription className="text-muted-foreground">Recent reviews from your clients</CardDescription>
          </div>
          <Link href="/lawyer/reviews">
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="max-h-[29rem] overflow-y-auto">
        <div className="space-y-4">
          {reviews.slice(0, 3).map((feedback: any) => {
            const reviewerName = typeof feedback.reviewer === 'object'
              ? `${feedback.reviewer.firstname} ${feedback.reviewer.lastname}`
              : 'Client'
            const reviewerAvatar = typeof feedback.reviewer === 'object'
              ? feedback.reviewer.profilePicture
              : undefined

            return (
              <div key={feedback._id} className="flex items-start space-x-4 p-4 bg-surface rounded-lg hover:bg-surface/80 transition-colors">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={reviewerAvatar} alt={reviewerName} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {reviewerName.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">{reviewerName}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(parseISO(feedback.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center">
                      {renderStars(feedback.rating)}
                    </div>
                    {feedback.context && (
                      <Badge variant="outline" className="border-primary/20 text-primary capitalize">
                        {feedback.context}
                      </Badge>
                    )}
                  </div>
                  {feedback.comment && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{feedback.comment}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <div>
              <h4 className="font-medium text-foreground">Overall Rating</h4>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center">
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {averageRating.toFixed(1)} ({dashboardStats?.totalReviews || reviews.length} review{(dashboardStats?.totalReviews || reviews.length) !== 1 ? 's' : ''})
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
