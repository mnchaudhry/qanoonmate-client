"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { User } from "@/store/types/user.types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield, Bell, Activity, ChevronLeft, Palette, CreditCard, } from "lucide-react";

import SecuritySettings from "../profile/_components/SecuritySettings";
import NotificationPreferences from "../profile/_components/NotificationPreferences";
import ActivityHistory from "../profile/_components/ActivityHistory";

export default function SettingsPage() {
    const authUser = useSelector((state: RootState) => (state as any)?.auth?.user as User | undefined);
    const [activeTab, setActiveTab] = useState("security");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        // Check for tab query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab');
        if (tab && ['security', 'notifications', 'activity', 'appearance', 'billing'].includes(tab)) {
            setActiveTab(tab);
        }
    }, []);

    if (!isClient) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
                <div className="container mx-auto py-6 pt-24">
                    <div className="animate-pulse">
                        <div className="h-12 bg-slate-200 rounded w-48 mb-6"></div>
                        <div className="h-96 bg-slate-200 rounded-xl"></div>
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
                            <Settings className="w-10 h-10 text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-3 text-slate-900">Sign in to access settings</h2>
                        <p className="text-slate-600 mb-6">Manage your account preferences and security settings.</p>
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
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/profile">
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Back to Profile
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                                Account Settings
                            </h1>
                            <p className="text-slate-600 mt-2">Manage your account preferences and security</p>
                        </div>
                    </div>
                </div>

                {/* Settings Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5 bg-white border border-slate-200 shadow-sm mb-6">
                        <TabsTrigger value="security" className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span className="hidden sm:inline">Security</span>
                            <span className="sm:hidden">Security</span>
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            <span className="hidden sm:inline">Notifications</span>
                            <span className="sm:hidden">Notif</span>
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            <span className="hidden sm:inline">Activity</span>
                            <span className="sm:hidden">Activity</span>
                        </TabsTrigger>
                        <TabsTrigger value="appearance" className="flex items-center gap-2">
                            <Palette className="w-4 h-4" />
                            <span className="hidden sm:inline">Appearance</span>
                            <span className="sm:hidden">Theme</span>
                        </TabsTrigger>
                        <TabsTrigger value="billing" className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            <span className="hidden sm:inline">Billing</span>
                            <span className="sm:hidden">Billing</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Security Settings */}
                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-slate-600" />
                                    Security Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <SecuritySettings user={authUser} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notification Preferences */}
                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <Bell className="w-5 h-5 text-slate-600" />
                                    Notification Preferences
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <NotificationPreferences user={authUser} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Activity History */}
                    <TabsContent value="activity">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-slate-600" />
                                    Activity History
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ActivityHistory user={authUser} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Appearance Settings */}
                    <TabsContent value="appearance">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <Palette className="w-5 h-5 text-slate-600" />
                                    Appearance Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-slate-700">Theme Preferences</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 border border-slate-200 rounded-lg">
                                                <h5 className="font-medium mb-2">Interface Theme</h5>
                                                <p className="text-sm text-slate-600 mb-3">Choose your preferred color scheme</p>
                                                <div className="space-y-2">
                                                    <label className="flex items-center space-x-2">
                                                        <input type="radio" name="theme" value="light" defaultChecked className="text-blue-600" />
                                                        <span className="text-sm">Light Mode</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2">
                                                        <input type="radio" name="theme" value="dark" className="text-blue-600" />
                                                        <span className="text-sm">Dark Mode</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2">
                                                        <input type="radio" name="theme" value="auto" className="text-blue-600" />
                                                        <span className="text-sm">Auto (System)</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="p-4 border border-slate-200 rounded-lg">
                                                <h5 className="font-medium mb-2">Language & Region</h5>
                                                <p className="text-sm text-slate-600 mb-3">Customize your language preferences</p>
                                                <div className="space-y-2">
                                                    <label className="flex items-center space-x-2">
                                                        <input type="radio" name="language" value="english" defaultChecked className="text-blue-600" />
                                                        <span className="text-sm">English</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2">
                                                        <input type="radio" name="language" value="urdu" className="text-blue-600" />
                                                        <span className="text-sm">Urdu</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-medium text-slate-700">Display Options</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 border border-slate-200 rounded-lg">
                                                <h5 className="font-medium mb-2">Time Format</h5>
                                                <p className="text-sm text-slate-600 mb-3">Choose your preferred time display</p>
                                                <div className="space-y-2">
                                                    <label className="flex items-center space-x-2">
                                                        <input type="radio" name="timeFormat" value="12h" defaultChecked className="text-blue-600" />
                                                        <span className="text-sm">12-hour (AM/PM)</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2">
                                                        <input type="radio" name="timeFormat" value="24h" className="text-blue-600" />
                                                        <span className="text-sm">24-hour</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="p-4 border border-slate-200 rounded-lg">
                                                <h5 className="font-medium mb-2">Date Format</h5>
                                                <p className="text-sm text-slate-600 mb-3">Choose your preferred date display</p>
                                                <div className="space-y-2">
                                                    <label className="flex items-center space-x-2">
                                                        <input type="radio" name="dateFormat" value="mm/dd/yyyy" defaultChecked className="text-blue-600" />
                                                        <span className="text-sm">MM/DD/YYYY</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2">
                                                        <input type="radio" name="dateFormat" value="dd/mm/yyyy" className="text-blue-600" />
                                                        <span className="text-sm">DD/MM/YYYY</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-200">
                                        <Button className="flex items-center gap-2">
                                            <Palette className="w-4 h-4" />
                                            Save Appearance Settings
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Billing Settings */}
                    <TabsContent value="billing">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <CreditCard className="w-5 h-5 text-slate-600" />
                                    Billing & Subscription
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="text-center py-12">
                                        <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-slate-900 mb-2">Billing Features Coming Soon</h3>
                                        <p className="text-slate-600 mb-4">
                                            Manage your subscription, payment methods, and billing history will be available here.
                                        </p>
                                        <Button variant="outline" disabled>
                                            Manage Billing
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
