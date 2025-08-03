"use client"

import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Download, ExternalLink } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { getRecentMessages } from '@/store/reducers/chatSlice'
import { formatDistanceToNow } from 'date-fns'

const RecentMessages = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { recentMessages, isRecentLoading, recentError } = useSelector((state: RootState) => state.chat)

  useEffect(() => {
    dispatch(getRecentMessages(5))
  }, [dispatch])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Recent Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[30rem] overflow-y-auto">
        {isRecentLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : recentError ? (
          <div className="text-center py-8 text-destructive">{recentError}</div>
        ) : recentMessages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No recent messages</p>
          </div>
        ) : (
          recentMessages.map((message) => {
            const sender = message.sender?.firstname ? `${message.sender.firstname} ${message.sender.lastname}` : 'Unknown';
            // const isBot = message.sender?.role === 'bot';
            const preview = message.content;
            const time = message.timestamp ? formatDistanceToNow(new Date(message.timestamp), { addSuffix: true }) : '';
            const unread = message.readBy && Array.isArray(message.readBy) && !message.readBy.some((u: any) => u._id === message.sender?._id);
            const hasAttachment = message.type === 'FILE';
            return (
              <div
                key={message._id}
                className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground text-sm">
                      {sender}
                    </span>
                    {unread && (
                      <Badge variant="destructive" className="h-2 w-2 rounded-full p-0" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{time}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {preview}
                </p>
                <div className="flex justify-between items-center">
                  <Button size="sm" variant="ghost" className="text-xs p-2">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open Chat
                  </Button>
                  {hasAttachment && (
                    <Button size="sm" variant="ghost" className="text-xs p-2">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}

export default RecentMessages
