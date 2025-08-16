"use client"

import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, Calendar, FileText, Mail, X, CheckCircle, AlertCircle } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotifications, markNotificationAsRead, markNotificationAsUnread, deleteNotification } from '@/store/reducers/notificationSlice'
import { AppDispatch, RootState } from '@/store/store'
import { formatDistanceToNow } from 'date-fns'

const typeIcon = (type: string) => {
  switch (type) {
    case 'consultation': return <Calendar className="h-4 w-4 text-blue-600" />
    case 'document': return <FileText className="h-4 w-4 text-green-600" />
    case 'system': return <CheckCircle className="h-4 w-4 text-primary" />
    case 'reminder': return <AlertCircle className="h-4 w-4 text-yellow-600" />
    case 'chat': return <Mail className="h-4 w-4 text-purple-600" />
    default: return <Bell className="h-4 w-4 text-muted-foreground" />
  }
}

const Notifications = () => {

  /////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { unreadCount, notifications, loading } = useSelector((state: RootState) => state.notification)

  /////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////  
  useEffect(() => {
    // Fetch only unread notifications, limit 5
    dispatch(fetchNotifications({ isRead: false, limit: 5 }))
  }, [dispatch])

  /////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////
  const handleDismiss = (id: string) => { dispatch(deleteNotification(id)) }
  const handleMarkRead = (id: string) => { dispatch(markNotificationAsRead(id)) }
  const handleMarkUnread = (id: string) => { dispatch(markNotificationAsUnread(id)) }

  /////////////////////////////////////////////// RENDER ///////////////////////////////////////////////
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notifications
          {unreadCount > 0 && <Badge variant="destructive" className="ml-2">{unreadCount}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`flex items-start gap-3 p-4 border rounded-lg transition-colors ${!n.isRead
                    ? 'bg-primary/5 border-primary/20 hover:bg-primary/10' 
                    : 'border-border hover:bg-accent/50'
                }`}
              >
                <div className="p-2 bg-background rounded-lg">
                  {typeIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-foreground text-sm">
                      {n.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      {!n.isRead && (
                        <Badge variant="destructive" className="h-2 w-2 rounded-full p-0" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {n.message}
                  </p>
                  <div className="flex gap-2 justify-end">
                    {n.isRead ? (
                      <Button size="sm" variant="ghost" onClick={() => handleMarkUnread(n._id)} className="text-xs p-1 h-auto text-muted-foreground hover:text-foreground">Mark as Unread</Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => handleMarkRead(n._id)} className="text-xs p-1 h-auto text-muted-foreground hover:text-foreground">Mark as Read</Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDismiss(n._id)}
                      className="text-xs p-1 h-auto text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default Notifications
