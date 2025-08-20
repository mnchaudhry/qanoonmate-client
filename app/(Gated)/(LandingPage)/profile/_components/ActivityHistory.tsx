"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  MessageSquare, 
  FileText, 
  Star, 
  Clock, 
  User,
  MoreHorizontal,
  Filter,
  Search,
  AlertCircle,
  Loader2
} from "lucide-react";
import { User as UserType } from "@/store/types/user.types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ActivityHistoryProps {
  user: UserType | null;
}

interface ActivityItem {
  id: string;
  type: 'consultation' | 'message' | 'review' | 'login' | 'profile_update' | 'document';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  icon: React.ReactNode;
  color: string;
}

export default function ActivityHistory({ user }: ActivityHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user]);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/profile/me/activity', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        const fetchedActivities = data.data.activities || [];
        
        // Transform the activities to match our interface
        const transformedActivities = fetchedActivities.map((activity: any) => ({
          id: activity.id,
          type: activity.type,
          title: activity.title,
          description: activity.description,
          timestamp: activity.timestamp,
          status: activity.status,
          icon: getActivityIcon(activity.type),
          color: getActivityColor(activity.type)
        }));
        
        setActivities(transformedActivities);
      } else {
        throw new Error('Failed to fetch activities');
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      setError('Failed to load activity history');
      // Set empty activities array
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <Calendar className="w-4 h-4" />;
      case 'message': return <MessageSquare className="w-4 h-4" />;
      case 'review': return <Star className="w-4 h-4" />;
      case 'login': return <User className="w-4 h-4" />;
      case 'profile_update': return <User className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-800';
      case 'message': return 'bg-emerald-100 text-emerald-800';
      case 'review': return 'bg-amber-100 text-amber-800';
      case 'login': return 'bg-slate-100 text-slate-800';
      case 'profile_update': return 'bg-violet-100 text-violet-800';
      case 'document': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'read': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'unread': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'success': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      case 'read': return 'Read';
      case 'unread': return 'Unread';
      case 'sent': return 'Sent';
      case 'success': return 'Success';
      default: return 'Unknown';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'consultation': return 'Consultation';
      case 'message': return 'Message';
      case 'review': return 'Review';
      case 'login': return 'Login';
      case 'profile_update': return 'Profile Update';
      case 'document': return 'Document';
      default: return 'Activity';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || activity.type === filterType;
    const matchesStatus = filterStatus === "all" || activity.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-slate-900">Activity History</h4>
            <p className="text-sm text-slate-600">Track your recent activities and interactions</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading activities...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-slate-900">Activity History</h4>
            <p className="text-sm text-slate-600">Track your recent activities and interactions</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Failed to load activities</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <Button onClick={fetchActivities} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-slate-900">Activity History</h4>
          <p className="text-sm text-slate-600">Track your recent activities and interactions</p>
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Search Activities</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Activity Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="consultation">Consultations</SelectItem>
                  <SelectItem value="message">Messages</SelectItem>
                  <SelectItem value="review">Reviews</SelectItem>
                  <SelectItem value="login">Logins</SelectItem>
                  <SelectItem value="profile_update">Profile Updates</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity List */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {activities.length === 0 ? 'No activities yet' : 'No activities found'}
              </h3>
              <p className="text-slate-600">
                {activities.length === 0 
                  ? 'Your activity history will appear here as you use the platform.'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredActivities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Activity Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.color}`}>
                    {activity.icon}
                  </div>
                  
                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 mb-1">{activity.title}</h4>
                        <p className="text-sm text-slate-600 mb-2">{activity.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(activity.timestamp)}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            {getTypeLabel(activity.type)}
                          </div>
                          
                          {activity.status && (
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getStatusColor(activity.status)}`}
                            >
                              {getStatusLabel(activity.status)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Menu */}
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredActivities.length > 0 && activities.length > filteredActivities.length && (
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Activities
          </Button>
        </div>
      )}
    </div>
  );
}
