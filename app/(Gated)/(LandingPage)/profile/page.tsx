"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { IUser } from "@/store/types/user.types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserIcon, Shield, Bell, Settings, Edit3, Camera, Calendar, MessageSquare, FileText, Star, MapPin, Globe, Phone, ChevronRight, ExternalLink } from "lucide-react";

import PersonalInfo from "./_components/PersonalInfo";
import Image from "next/image";

interface ProfileStats {
  consultations: number;
  feedback: number;
  documents: number;
  rating: number;
}

export default function ProfilePage() {
  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
  const authUser = useSelector((state: RootState) => (state as any)?.auth?.user as IUser | undefined);

  //////////////////////////////////////////////////// STATES ////////////////////////////////////////////////////
  const [userData, setUser] = useState<IUser | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  //////////////////////////////////////////////////// EFFECTS ////////////////////////////////////////////////////
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (authUser) setUser(authUser);
  }, [authUser]);

  useEffect(() => {
    if (userData) {
      fetchProfileStats();
    }
  }, [userData]);

  //////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
  const fetchProfileStats = async () => {
    try {
      const response = await fetch('/api/profile/me/stats', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data.stats);
      } else {
        setStats({
          consultations: 0,
          feedback: 0,
          documents: 0,
          rating: 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile stats:', error);
      setStats({
        consultations: 0,
        feedback: 0,
        documents: 0,
        rating: 0
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleUpdateUser = async (updatedData: Partial<IUser>) => {
    try {
      const res = await fetch('/api/user/me', {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const json = await res.json();
      const updated = (json?.data as IUser) || updatedData;
      setUser(prev => (prev ? { ...prev, ...updated } as IUser : (updated as IUser)));

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update profile");
      return Promise.reject(error);
    }
  };

  const handlePhotoUpdate = async (file: File | null) => {
    try {
      if (file) {
        const fd = new FormData();
        fd.append("image", file);
        const res = await fetch('/api/user/me/profile-picture', {
          method: "POST",
          body: fd,
          credentials: "include",
        });

        if (!res.ok) throw new Error("Upload failed");

        const json = await res.json();
        const url = json?.data?.url || json?.url;
        if (url) setUser(prev => (prev ? { ...prev, profilePicture: url } : prev));
      } else {
        const res = await fetch('/api/user/me/profile-picture', {
          method: "DELETE",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Remove failed");
        setUser(prev => (prev ? { ...prev, profilePicture: "" } : prev));
      }

      toast.success("Profile photo updated successfully!");
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to update photo:", error);
      toast.error("Failed to update photo");
      return Promise.reject(error);
    }
  };

  const getMemberSince = () => {
    if (!userData?.createdAt) return "Recently";
    const date = new Date(userData.createdAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'suspended': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="container mx-auto py-6 pt-24">
          <div className="animate-pulse">
            <div className="h-12 bg-slate-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="h-96 bg-slate-200 rounded-xl"></div>
              </div>
              <div className="lg:col-span-2">
                <div className="h-96 bg-slate-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="container py-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserIcon className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-slate-900">Sign in to view your profile</h2>
            <p className="text-slate-600 mb-6">Access your personalized dashboard and manage your account settings.</p>
            <Button asChild size="lg" className="w-full">
              <Link href="/auth/sign-in">Sign In to Continue</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4">
      <div className="container mx-auto py-6 pt-24">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-slate-600 mt-2">Your personal information and account details</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Consultations</p>
                  <p className="text-xl font-semibold text-slate-900">
                    {isLoadingStats ? "..." : stats?.consultations || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Feedback</p>
                  <p className="text-xl font-semibold text-slate-900">
                    {isLoadingStats ? "..." : stats?.feedback || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Documents</p>
                  <p className="text-xl font-semibold text-slate-900">
                    {isLoadingStats ? "..." : stats?.documents || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Rating</p>
                  <p className="text-xl font-semibold text-slate-900">
                    {isLoadingStats ? "..." : (stats?.rating || 0).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  {userData?.profilePicture ? (
                    <Image
                      src={userData.profilePicture}
                      alt="Profile"
                      fill
                      className="w-full h-full rounded-full object-cover border-4 border-slate-200 shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-4 border-slate-200">
                      <UserIcon className="h-16 w-16 text-slate-400" />
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 shadow-lg"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  <input
                    id="photo-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoUpdate(file);
                    }}
                  />
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-1">
                  {userData?.firstname} {userData?.lastname}
                </h3>
                <p className="text-slate-600 text-sm mb-2">{userData?.email}</p>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className={getStatusColor(userData?.accountStatus || 'active')}
                  >
                    {userData?.accountStatus || 'Active'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {userData?.role || 'Client'}
                  </Badge>
                </div>

                <div className="text-xs text-slate-500">
                  Member since {getMemberSince()}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">
                    {userData?.phone || 'Not provided'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">
                    {userData?.location?.city && userData?.location?.province
                      ? `${userData.location.city}, ${userData.location.province}`
                      : userData?.location?.city || userData?.location?.province || 'Location not set'
                    }
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{userData?.preferredLanguage || 'English'}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <Separator className="my-4" />
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-between" asChild>
                  <Link href="/settings">
                    <Settings className="w-4 h-4" />
                    Account Settings
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-between" asChild>
                  <Link href="/settings?tab=notifications">
                    <Bell className="w-4 h-4" />
                    Notifications
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-between" asChild>
                  <Link href="/settings?tab=security">
                    <Shield className="w-4 h-4" />
                    Security
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Content - Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-slate-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userData && (
                  <PersonalInfo
                    user={userData}
                    onUpdate={handleUpdateUser}
                    isEditing={isEditing}
                  />
                )}
              </CardContent>
            </Card>

            {/* Account Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-slate-600" />
                  Account Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-700">Account Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">Account Status</span>
                        <Badge variant="secondary" className={getStatusColor(userData?.accountStatus || 'active')}>
                          {userData?.accountStatus || 'Active'}
                        </Badge>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">User Role</span>
                        <span className="font-medium">{userData?.role || 'Client'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">Member Since</span>
                        <span className="font-medium">{getMemberSince()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">Last Updated</span>
                        <span className="font-medium">
                          {userData?.updatedAt ? new Date(userData.updatedAt).toLocaleDateString() : 'Never'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-700">Verification Status</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">Email</span>
                        <Badge variant={userData?.emailVerified ? "default" : "secondary"}>
                          {userData?.emailVerified ? "Verified" : "Not Verified"}
                        </Badge>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">Phone</span>
                        <Badge variant={userData?.phoneVerified ? "default" : "secondary"}>
                          {userData?.phoneVerified ? "Verified" : "Not Verified"}
                        </Badge>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">Identity</span>
                        <Badge variant={userData?.identityVerified ? "default" : "secondary"}>
                          {userData?.identityVerified ? "Verified" : "Not Verified"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-600" />
                    Recent Activity
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/settings?tab=activity">
                      View All
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Consultation scheduled</p>
                      <p className="text-xs text-slate-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Message received</p>
                      <p className="text-xs text-slate-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                    <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Document uploaded</p>
                      <p className="text-xs text-slate-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}