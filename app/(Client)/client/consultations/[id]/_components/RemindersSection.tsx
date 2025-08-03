"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  message: string;
  time?: string;
}

interface RemindersSectionProps {
  notifications: Notification[];
}

export default function RemindersSection({ notifications = [] }: RemindersSectionProps) {
  // If no notifications, return null or default set
  if (notifications.length === 0) {
    // Default notifications for demo purposes
    notifications = [
      { id: "1", type: "sms", message: "SMS Reminder scheduled 2 hours before meeting" },
      { id: "2", type: "email", message: "Email Confirmation sent on booking" },
      { id: "3", type: "whatsapp", message: "WhatsApp link delivery 30 minutes before session" }
    ];
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "sms":
        return "📱";
      case "email":
        return "📧";
      case "whatsapp":
        return "💬";
      default:
        return "🔔";
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-lg flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Reminders & Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li key={notification.id} className="flex items-start">
              <span className="mr-2">{getNotificationIcon(notification.type)}</span>
              <span className="text-gray-700">{notification.message}</span>
              {notification.time && (
                <span className="text-xs text-gray-500 ml-auto">{notification.time}</span>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
