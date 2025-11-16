"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Database, Download, Trash2, Eye, Shield, CheckCircle, Clock, FileText } from "lucide-react";
import { LawyerProfile, ProfileCompletionData } from "@/lib/types/profile.types";
import { SubsectionHeader } from "./SubsectionHeader";

interface DataPrivacySectionProps {
    profile: LawyerProfile;
    completion: ProfileCompletionData;
    onUpdate: (updatedProfile: Partial<LawyerProfile>) => void;
}

export function DataPrivacySection({ }: DataPrivacySectionProps) {

    ///////////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////////////
    const [form, setForm] = useState({
        profileVisibility: true,
        searchEngineIndexing: true,
        showEmail: false,
        showPhone: false,
        showLocation: true,
        allowDataAnalytics: true,
        shareDataWithPartners: false,
        marketingEmails: true,
        performanceTracking: true,
    });
    const [loading, setLoading] = useState(false);

    ///////////////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////////////
    const setField = (field: string, value: boolean) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // TODO: Implement data privacy settings update
            console.log('Data privacy settings updated:', form);
        } catch (error) {
            console.error('Error saving data privacy settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadData = async () => {
        try {
            // TODO: Implement data export
            console.log('Downloading user data...');
            alert('Your data export request has been received. You will receive a download link via email within 24 hours.');
        } catch (error) {
            console.error('Error downloading data:', error);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone. All your data, including consultations, messages, and files will be permanently deleted.'
        );

        if (!confirmed) return;

        try {
            // TODO: Implement account deletion
            console.log('Initiating account deletion...');
            alert('Your account deletion request has been received. You will receive a confirmation email with further instructions.');
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    ///////////////////////////////////////////////////////// RENDER //////////////////////////////////////////////////////////////
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Database className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-foreground">Data & Privacy</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage your data privacy settings, download your information, and control data sharing</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Profile Visibility */}
                <Card>
                    <CardHeader className="pb-4">
                        <SubsectionHeader
                            title="Profile Visibility"
                            description="Control who can see your profile information"
                        />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h4 className="font-medium text-sm">Public Profile</h4>
                                <p className="text-sm text-muted-foreground">Make your profile visible to everyone</p>
                            </div>
                            <Switch
                                checked={form.profileVisibility}
                                onCheckedChange={(checked) => setField('profileVisibility', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h4 className="font-medium text-sm">Search Engine Indexing</h4>
                                <p className="text-sm text-muted-foreground">Allow search engines to index your profile</p>
                            </div>
                            <Switch
                                checked={form.searchEngineIndexing}
                                onCheckedChange={(checked) => setField('searchEngineIndexing', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h4 className="font-medium text-sm">Show Email Address</h4>
                                <p className="text-sm text-muted-foreground">Display your email on your public profile</p>
                            </div>
                            <Switch
                                checked={form.showEmail}
                                onCheckedChange={(checked) => setField('showEmail', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h4 className="font-medium text-sm">Show Phone Number</h4>
                                <p className="text-sm text-muted-foreground">Display your phone number on your public profile</p>
                            </div>
                            <Switch
                                checked={form.showPhone}
                                onCheckedChange={(checked) => setField('showPhone', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h4 className="font-medium text-sm">Show Location</h4>
                                <p className="text-sm text-muted-foreground">Display your city and country on your profile</p>
                            </div>
                            <Switch
                                checked={form.showLocation}
                                onCheckedChange={(checked) => setField('showLocation', checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Data Collection */}
                <Card>
                    <CardHeader className="pb-4">
                        <SubsectionHeader
                            title="Data Collection & Usage"
                            description="Control how we collect and use your data"
                        />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h4 className="font-medium text-sm">Analytics & Performance</h4>
                                <p className="text-sm text-muted-foreground">Help us improve QanoonMate by sharing usage data</p>
                            </div>
                            <Switch
                                checked={form.allowDataAnalytics}
                                onCheckedChange={(checked) => setField('allowDataAnalytics', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h4 className="font-medium text-sm">Performance Tracking</h4>
                                <p className="text-sm text-muted-foreground">Track consultation metrics and performance statistics</p>
                            </div>
                            <Switch
                                checked={form.performanceTracking}
                                onCheckedChange={(checked) => setField('performanceTracking', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h4 className="font-medium text-sm">Share Data with Partners</h4>
                                <p className="text-sm text-muted-foreground">Share anonymized data with trusted partners</p>
                            </div>
                            <Switch
                                checked={form.shareDataWithPartners}
                                onCheckedChange={(checked) => setField('shareDataWithPartners', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h4 className="font-medium text-sm">Marketing Communications</h4>
                                <p className="text-sm text-muted-foreground">Receive emails about new features and updates</p>
                            </div>
                            <Switch
                                checked={form.marketingEmails}
                                onCheckedChange={(checked) => setField('marketingEmails', checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Data Management */}
                <Card>
                    <CardHeader className="pb-4">
                        <SubsectionHeader
                            title="Data Management"
                            description="Download or delete your personal data"
                        />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg border border-border">
                            <div className="flex items-start gap-3 mb-3">
                                <Download className="w-5 h-5 text-primary mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm mb-1">Download Your Data</h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Request a copy of all your personal data, including profile information, consultations, messages, and documents.
                                    </p>
                                    <Button
                                        onClick={handleDownloadData}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Request Data Export
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-muted/50 rounded-lg border border-border">
                            <div className="flex items-start gap-3">
                                <Eye className="w-5 h-5 text-primary mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm mb-1">Data Retention</h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        We retain your data as long as your account is active. Some data may be retained for legal or regulatory purposes after account deletion.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                            <span>Profile data: Retained while account is active</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <FileText className="w-4 h-4 text-muted-foreground" />
                                            <span>Consultation history: Retained for 7 years (legal requirement)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Shield className="w-4 h-4 text-muted-foreground" />
                                            <span>Financial records: Retained for 7 years (tax compliance)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Privacy Information */}
                <Card className="border-border/50">
                    <CardHeader className="pb-4">
                        <SubsectionHeader
                            title="Privacy Information"
                            description="Learn about how we protect your data"
                        />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                                <p className="text-sm text-muted-foreground">
                                    Your data is encrypted both in transit and at rest using industry-standard protocols
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                                <p className="text-sm text-muted-foreground">
                                    We never sell your personal information to third parties
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                                <p className="text-sm text-muted-foreground">
                                    You have the right to access, correct, or delete your personal data at any time
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                                <p className="text-sm text-muted-foreground">
                                    All data handling complies with GDPR, CCPA, and local data protection laws
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-destructive/50">
                    <CardHeader className="pb-4">
                        <SubsectionHeader
                            title="Danger Zone"
                            description="Irreversible actions that affect your account"
                        />
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                            <div className="flex items-start gap-3">
                                <Trash2 className="w-5 h-5 text-destructive mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm mb-1 text-destructive">Delete Account</h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Permanently delete your account and all associated data. This action cannot be undone.
                                    </p>
                                    <Button
                                        onClick={handleDeleteAccount}
                                        variant="destructive"
                                        size="sm"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Account
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} disabled={loading} size="lg">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
