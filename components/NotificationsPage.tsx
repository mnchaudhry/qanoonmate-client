"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Bell, Trash2, Check, CheckCheck, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { fetchNotifications, markNotificationAsRead, markNotificationAsUnread, deleteNotification, markAllAsRead, bulkDeleteNotifications, clearAllNotifications, } from "@/store/reducers/notificationSlice";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import DashboardPageHeader from "./DashboardPageHeader";
import ViewToggle from "./ViewToggle";
import { NotificationType } from "@/lib/enums";

const NotificationsPage = () => {
    //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { notifications, unreadCount, loading, meta } = useSelector((state: RootState) => state.notification);

    //////////////////////////////////////////////////// STATES ////////////////////////////////////////////////////
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [filterRead, setFilterRead] = useState<string>("all"); // all, read, unread
    const [filterType, setFilterType] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [searchQuery, setSearchQuery] = useState<string>("");

    //////////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////
    useEffect(() => {
        const filters: any = { limit: 50 };

        if (filterRead === "read") filters.isRead = true;
        if (filterRead === "unread") filters.isRead = false;
        if (filterType !== "all") filters.type = filterType;
        if (searchQuery.trim()) filters.search = searchQuery.trim();

        dispatch(fetchNotifications(filters));
    }, [dispatch, filterRead, filterType, searchQuery]);

    const handleSelectAll = () => {
        if (selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredNotifications.map((n) => n._id));
        }
    };

    const handleSelectOne = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleMarkAsRead = async (id: string) => {
        await dispatch(markNotificationAsRead(id));
    };

    const handleMarkAsUnread = async (id: string) => {
        await dispatch(markNotificationAsUnread(id));
    };

    const handleDelete = async (id: string) => {
        await dispatch(deleteNotification(id));
        setSelectedIds((prev) => prev.filter((i) => i !== id));
    };

    const handleMarkAllAsRead = async () => {
        await dispatch(markAllAsRead());
        setSelectedIds([]);
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        await dispatch(bulkDeleteNotifications(selectedIds));
        setSelectedIds([]);
    };

    const handleBulkMarkAsRead = async () => {
        if (selectedIds.length === 0) return;
        for (const id of selectedIds) {
            await dispatch(markNotificationAsRead(id));
        }
        setSelectedIds([]);
    };

    const handleClearAll = async () => {
        if (confirm("Are you sure you want to delete all notifications? This action cannot be undone.")) {
            await dispatch(clearAllNotifications());
            setSelectedIds([]);
        }
    };

    const handleNotificationClick = (notification: any) => {
        // Mark as read when clicked
        if (!notification.isRead) {
            dispatch(markNotificationAsRead(notification._id));
        }
        // Navigate to actionUrl if provided
        if (notification.actionUrl) {
            router.push(notification.actionUrl);
        }
    };

    // Filter notifications based on search query (client-side)
    const filteredNotifications = notifications.filter((notification) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            notification.title?.toLowerCase().includes(query) ||
            notification.message?.toLowerCase().includes(query)
        );
    });

    //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
    return (
        <div className="w-full space-y-6">

            <DashboardPageHeader
                title="Notifications"
                description="View and manage all your notifications in one place."
                action={
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleMarkAllAsRead}
                                disabled={loading}
                            >
                                <CheckCheck className="h-4 w-4 mr-2" />
                                Mark all as read
                            </Button>
                        )}
                        {notifications.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearAll}
                                disabled={loading}
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear all
                            </Button>
                        )}
                    </div>
                }
            />

            <div className="space-y-4">
                {/* Search and Filters Row */}
                <div className="flex flex-wrap justify-between items-center gap-3 pb-4">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search notifications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Status Filter */}
                        <Select value={filterRead} onValueChange={setFilterRead}>
                            <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="unread">Unread</SelectItem>
                                <SelectItem value="read">Read</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Type Filter */}
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value={NotificationType.CONSULTATION}>Consultation</SelectItem>
                                <SelectItem value={NotificationType.CHAT}>Message</SelectItem>
                                <SelectItem value={NotificationType.PAYMENT}>Payment</SelectItem>
                                <SelectItem value={NotificationType.SYSTEM}>System</SelectItem>
                                <SelectItem value={NotificationType.REMINDER}>Reminder</SelectItem>
                                <SelectItem value={NotificationType.CUSTOM}>Custom</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* View Toggle */}
                        <ViewToggle view={viewMode} onViewChange={setViewMode} />

                        {selectedIds.length > 0 && (
                            <>
                                <div className="h-6 w-px bg-border" />
                                <span className="text-sm text-muted-foreground">
                                    {selectedIds.length} selected
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleBulkMarkAsRead}
                                    disabled={loading}
                                >
                                    <Check className="h-3.5 w-3.5 mr-1" />
                                    Mark as read
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleBulkDelete}
                                    disabled={loading}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                                    Delete
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedIds([])}
                                    disabled={loading}
                                >
                                    <X className="h-3.5 w-3.5 mr-1" />
                                    Clear
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Select All */}
                {filteredNotifications.length > 0 && (
                    <div className="flex items-center gap-2 pb-2">
                        <Checkbox
                            id="select-all"
                            checked={selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0}
                            onCheckedChange={handleSelectAll}
                        />
                        <label
                            htmlFor="select-all"
                            className="text-sm font-medium cursor-pointer"
                        >
                            Select all {searchQuery && `(${filteredNotifications.length} results)`}
                        </label>
                    </div>
                )}

                {/* Notifications List */}
                {loading && notifications.length === 0 ? (
                    <div className="py-12 text-center text-sm text-muted-foreground">
                        Loading notifications...
                    </div>
                ) : filteredNotifications.length > 0 ? (
                    <div className={cn(
                        viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            : "space-y-2"
                    )}>
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={cn(
                                    "flex gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer",
                                    !notification.isRead && "bg-muted/30 border-primary/20",
                                    viewMode === "grid" ? "flex-col" : "items-start"
                                )}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className={cn(
                                    "flex gap-3",
                                    viewMode === "grid" ? "items-center" : "items-start w-full"
                                )}>
                                    <Checkbox
                                        id={notification._id}
                                        checked={selectedIds.includes(notification._id)}
                                        onCheckedChange={() => handleSelectOne(notification._id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p
                                                        className={cn(
                                                            "text-sm font-medium",
                                                            !notification.isRead && "text-primary"
                                                        )}
                                                    >
                                                        {notification.title}
                                                    </p>
                                                    {!notification.isRead && (
                                                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                                                    )}
                                                </div>
                                                {notification.message && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {notification.message}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(notification.createdAt), {
                                                            addSuffix: true,
                                                        })}
                                                    </span>
                                                    {notification.type && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {notification.type.replace(/_/g, " ")}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={cn(
                                    "flex gap-1",
                                    viewMode === "grid" ? "justify-end" : "flex-col"
                                )}>
                                    {!notification.isRead ? (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsRead(notification._id);
                                            }}
                                            title="Mark as read"
                                        >
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsUnread(notification._id);
                                            }}
                                            title="Mark as unread"
                                        >
                                            <Bell className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(notification._id);
                                        }}
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                            {searchQuery ? "No matching notifications" : "No notifications"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {searchQuery
                                ? `No notifications found matching "${searchQuery}"`
                                : filterRead === "unread"
                                    ? "You have no unread notifications"
                                    : filterRead === "read"
                                        ? "You have no read notifications"
                                        : "You don't have any notifications yet"}
                        </p>
                    </div>
                )}

                {/* Pagination info */}
                {meta && filteredNotifications.length > 0 && (
                    <div className="pt-4 border-t border-border text-xs text-muted-foreground text-center">
                        Showing {filteredNotifications.length} of {meta.totalCount} notification
                        {meta.totalCount !== 1 ? "s" : ""}
                        {searchQuery && ` (filtered by search)`}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
