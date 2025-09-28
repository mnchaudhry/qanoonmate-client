"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, Eye, EyeOff, Save, CheckCircle, AlertTriangle } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SubsectionHeader } from "./SubsectionHeader";
import { LawyerProfile, ProfileCompletionData } from "@/lib/types/profile.types";

interface SecuritySectionProps {
    profile: LawyerProfile;
    completion: ProfileCompletionData;
    onUpdate: (updatedProfile: Partial<LawyerProfile>) => void;
}

export function SecuritySection({ }: SecuritySectionProps) {
    const [form, setForm] = useState({
        twoFactorEnabled: false,
        emailNotifications: true,
        smsNotifications: false,
        loginAlerts: true,
        dataSharing: false,
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [loading, setLoading] = useState(false);

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const setPasswordField = (field: string, value: string) => {
        setPasswordForm(prev => ({ ...prev, [field]: value }));
    };

    const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // TODO: Implement security settings update
            console.log('Security settings updated:', form);

        } catch (error) {
            console.error('Error saving security settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert("New passwords don't match");
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            alert("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);
        try {
            // TODO: Implement password change
            console.log('Password changed');
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            console.error('Error changing password:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSecurityScore = () => {
        let score = 0;
        if (form.twoFactorEnabled) score += 40;
        if (form.loginAlerts) score += 30;
        if (form.emailNotifications) score += 20;
        if (!form.dataSharing) score += 10;
        return score;
    };

    const getSecurityLevel = (score: number) => {
        if (score >= 80) return { level: "Strong", color: "text-green-600", icon: CheckCircle };
        if (score >= 60) return { level: "Good", color: "text-amber-600", icon: AlertTriangle };
        return { level: "Weak", color: "text-red-600", icon: AlertTriangle };
    };

    const securityScore = getSecurityScore();
    const securityLevel = getSecurityLevel(securityScore);
    const SecurityIcon = securityLevel.icon;

    return (
        <div className="space-y-6">
            <Card className="border-border">
                <SectionHeader
                    title="Security & Privacy"
                    description="Manage your account security settings and privacy preferences"
                    icon={<Shield className="w-4 h-4 text-primary" />}
                    action={{
                        label: "Save Changes",
                        onClick: handleSave,
                        variant: "default"
                    }}
                />
                <CardContent className="space-y-4">
                    {/* Security Overview */}
                    <div className="space-y-2">
                        <SubsectionHeader title="Security Overview" />
                        <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <SecurityIcon className={`w-5 h-5 ${securityLevel.color}`} />
                                    <div>
                                        <h4 className="font-medium text-foreground">Security Level: {securityLevel.level}</h4>
                                        <p className="text-sm text-muted-foreground">Score: {securityScore}/100</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className={securityLevel.color}>
                                    {securityLevel.level}
                                </Badge>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${securityScore >= 80 ? 'bg-green-500' :
                                            securityScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                        }`}
                                    style={{ width: `${securityScore}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password Management */}
                    <div className="space-y-2">
                        <SubsectionHeader title="Password Management" />
                        <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={showPasswords.current ? "text" : "password"}
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordField('currentPassword', e.target.value)}
                                            placeholder="Enter current password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                                            onClick={() => togglePasswordVisibility('current')}
                                        >
                                            {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showPasswords.new ? "text" : "password"}
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordField('newPassword', e.target.value)}
                                            placeholder="Enter new password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                                            onClick={() => togglePasswordVisibility('new')}
                                        >
                                            {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showPasswords.confirm ? "text" : "password"}
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordField('confirmPassword', e.target.value)}
                                            placeholder="Confirm new password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                        >
                                            {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <Button
                                    onClick={handlePasswordChange}
                                    disabled={loading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    <Key className="w-4 h-4 mr-2" />
                                    Change Password
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="space-y-2">
                        <SubsectionHeader title="Two-Factor Authentication" />
                        <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-medium text-foreground">Enable 2FA</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Add an extra layer of security to your account
                                    </p>
                                </div>
                                <Switch
                                    checked={form.twoFactorEnabled}
                                    onCheckedChange={(checked) => setField('twoFactorEnabled', checked)}
                                />
                            </div>
                            {form.twoFactorEnabled && (
                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span className="text-sm text-green-800">Two-factor authentication is enabled</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="space-y-2">
                        <SubsectionHeader title="Privacy Settings" />
                        <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-foreground">Email Notifications</Label>
                                        <p className="text-xs text-muted-foreground">Receive security alerts via email</p>
                                    </div>
                                    <Switch
                                        checked={form.emailNotifications}
                                        onCheckedChange={(checked) => setField('emailNotifications', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-foreground">SMS Notifications</Label>
                                        <p className="text-xs text-muted-foreground">Receive security alerts via SMS</p>
                                    </div>
                                    <Switch
                                        checked={form.smsNotifications}
                                        onCheckedChange={(checked) => setField('smsNotifications', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-foreground">Login Alerts</Label>
                                        <p className="text-xs text-muted-foreground">Get notified of new login attempts</p>
                                    </div>
                                    <Switch
                                        checked={form.loginAlerts}
                                        onCheckedChange={(checked) => setField('loginAlerts', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-foreground">Data Sharing</Label>
                                        <p className="text-xs text-muted-foreground">Allow data sharing for service improvement</p>
                                    </div>
                                    <Switch
                                        checked={form.dataSharing}
                                        onCheckedChange={(checked) => setField('dataSharing', checked)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Tips */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <h4 className="font-medium text-primary mb-2">🔒 Security Tips</h4>
                        <ul className="text-sm text-primary/80 space-y-1">
                            <li>• Use a strong, unique password for your account</li>
                            <li>• Enable two-factor authentication for better security</li>
                            <li>• Keep your contact information up to date</li>
                            <li>• Review your login activity regularly</li>
                        </ul>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            size="sm"
                            className="bg-primary hover:bg-primary/90"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
