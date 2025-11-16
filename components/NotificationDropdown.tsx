"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Bell, Trash2, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator, } from "@/components/ui/dropdown-menu";
import { fetchNotifications, markNotificationAsRead, deleteNotification, markAllAsRead, } from "@/store/reducers/notificationSlice";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface NotificationDropdownProps {
    viewAllLink: string; // e.g., "/lawyer/notifications" or "/client/notifications"
    className?: string;
}

const NotificationDropdown = ({ viewAllLink, className }: NotificationDropdownProps) => {
    //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
    const dispatch = useDispatch<AppDispatch>();
    const { notifications, unreadCount, loading } = useSelector(
        (state: RootState) => state.notification
    );

    //////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////
    useEffect(() => {
        // Fetch only unread notifications, limit 5 for dropdown
        dispatch(fetchNotifications({ isRead: false, limit: 5 }));
    }, [dispatch]);

    //////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await dispatch(markNotificationAsRead(id));
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await dispatch(deleteNotification(id));
    };

    const handleMarkAllAsRead = async () => {
        await dispatch(markAllAsRead());
    };

    const handleNotificationClick = (notification: any) => {
        // Mark as read when clicked
        if (!notification.isRead) {
            dispatch(markNotificationAsRead(notification._id));
        }
        // Navigate to actionUrl if provided
        if (notification.actionUrl) {
            window.location.href = notification.actionUrl;
        }
    };

    //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("relative hover:bg-muted", className)}>
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-96 max-h-[500px] overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="text-xs h-7 px-2"
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>

                {loading && notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        Loading notifications...
                    </div>
                ) : notifications.length > 0 ? (
                    <>
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                onClick={() => handleNotificationClick(notification)}
                                className={cn(
                                    "flex gap-3 px-4 py-3 hover:bg-muted cursor-pointer transition-colors border-b border-border last:border-0",
                                    !notification.isRead && "bg-muted/50"
                                )}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className={cn(
                                            "text-sm font-medium",
                                            !notification.isRead && "text-primary"
                                        )}>
                                            {notification.title}
                                        </p>
                                        {!notification.isRead && (
                                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                                        )}
                                    </div>

                                    {notification.message && (
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                            {notification.message}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    {!notification.isRead && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={(e) => handleMarkAsRead(notification._id, e)}
                                            title="Mark as read"
                                        >
                                            <Check className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={(e) => handleDelete(notification._id, e)}
                                        title="Delete"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <DropdownMenuSeparator />

                        <div className="px-4 py-2">
                            <Link href={viewAllLink}>
                                <Button variant="ghost" size="sm" className="w-full text-xs">
                                    View all notifications
                                </Button>
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="px-4 py-8 text-center">
                        <Bell className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground">No new notifications</p>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationDropdown;
