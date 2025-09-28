"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Lawyer } from "@/store/types/lawyer.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye, Globe, Lock, Users, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateMeLawyer } from "@/store/reducers/lawyerSlice";
import { SectionHeader } from "./SectionHeader";
import { SubsectionHeader } from "./SubsectionHeader";

export function ProfileSettings() {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const lawyer = user as Lawyer;

    const [profileVisibility, setProfileVisibility] = useState<'public' | 'private' | 'limited'>('public');
    const [showContactInfo, setShowContactInfo] = useState(true);
    const [showPricing, setShowPricing] = useState(true);
    const [showAvailability, setShowAvailability] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Initialize settings from lawyer data
        if (lawyer) {
            // These fields might not exist in the current Lawyer type, so we'll use defaults
            setProfileVisibility('public'); // Default to public
            setShowContactInfo(true);
            setShowPricing(true);
            setShowAvailability(true);
        }
    }, [lawyer]);

    const handleSaveSettings = async () => {
        if (!lawyer) return;

        setIsLoading(true);
        try {
            // Update profile visibility and other settings
            await dispatch(updateMeLawyer({
                // Add profile settings fields when they're added to the Lawyer type
                // profileVisibility,
                // showContactInfo,
                // showPricing,
                // showAvailability
            })).unwrap();

            // Show success message or toast
            console.log('Profile settings updated successfully');
        } catch (error) {
            console.error('Failed to update profile settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditProfile = () => {
        router.push('/lawyers/me');
    };

    const getVisibilityIcon = (visibility: string) => {
        switch (visibility) {
            case 'public':
                return <Globe className="w-4 h-4 text-green-600" />;
            case 'private':
                return <Lock className="w-4 h-4 text-red-600" />;
            case 'limited':
                return <Users className="w-4 h-4 text-amber-600" />;
            default:
                return <Globe className="w-4 h-4 text-green-600" />;
        }
    };

    const getVisibilityDescription = (visibility: string) => {
        switch (visibility) {
            case 'public':
                return 'Your profile is visible to everyone and appears in search results';
            case 'private':
                return 'Your profile is only visible to you and clients you directly share it with';
            case 'limited':
                return 'Your profile is visible to verified users and appears in limited search results';
            default:
                return '';
        }
    };

    return (
        <div className="space-y-6">
            {/* Profile Overview */}
            <Card className="border-border">
                <SectionHeader
                    title="Profile Settings"
                    description="Manage your profile visibility and display preferences"
                    icon={<User className="w-4 h-4 text-primary" />}
                    action={{
                        label: "Edit Profile",
                        onClick: handleEditProfile,
                        variant: "outline"
                    }}
                />
                <CardContent className="space-y-4">
                    {/* Profile Visibility */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <SubsectionHeader title="Profile Visibility" description="Control who can see your profile" />
                            <div className="flex items-center gap-2">
                                {getVisibilityIcon(profileVisibility)}
                                <Badge variant="outline" className="border-border">
                                    {profileVisibility.charAt(0).toUpperCase() + profileVisibility.slice(1)}
                                </Badge>
                            </div>
                        </div>
                        <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
                            <div className="space-y-2">
                                <Select value={profileVisibility} onValueChange={(value: 'public' | 'private' | 'limited') => setProfileVisibility(value)}>
                                    <SelectTrigger className="border-border">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-green-600" />
                                                <div className="flex items-center gap-2">
                                                    <div className="font-medium">Public</div>
                                                    <div className="text-xs text-muted-foreground">(Visible to everyone)</div>
                                                </div>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="limited">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-amber-600" />
                                                <div className="flex items-center gap-2">
                                                    <div className="font-medium">Limited</div>
                                                    <div className="text-xs text-muted-foreground">(Visible to verified users)</div>
                                                </div>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="private">
                                            <div className="flex items-center gap-2">
                                                <Lock className="w-4 h-4 text-red-600" />
                                                <div className="flex items-center gap-2"    >
                                                    <div className="font-medium">Private</div>
                                                    <div className="text-xs text-muted-foreground">(Only visible to you)</div>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border">
                                    {getVisibilityDescription(profileVisibility)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Display Preferences */}
                    <div className="space-y-2">
                        <SubsectionHeader title="Display Preferences" />
                        <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-foreground">
                                            Show Contact Information
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Display your contact details on your profile
                                        </p>
                                    </div>
                                    <Switch
                                        checked={showContactInfo}
                                        onCheckedChange={setShowContactInfo}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-foreground">
                                            Show Pricing Information
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Display your consultation fees and pricing
                                        </p>
                                    </div>
                                    <Switch
                                        checked={showPricing}
                                        onCheckedChange={setShowPricing}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-foreground">
                                            Show Availability
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Display your working hours and availability
                                        </p>
                                    </div>
                                    <Switch
                                        checked={showAvailability}
                                        onCheckedChange={setShowAvailability}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <Button
                                onClick={handleSaveSettings}
                                disabled={isLoading}
                                size='sm'
                                className="bg-primary hover:bg-primary/90"
                            >
                                {isLoading ? 'Saving...' : 'Save Settings'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground">
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button
                        variant="outline"
                        className="w-full justify-start border-border"
                        onClick={handleEditProfile}
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Edit Professional Information
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full justify-start border-border"
                        onClick={() => router.push('/lawyers/me')}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Public Profile
                    </Button>
                </CardContent>
            </Card>
        </div >
    );
}
