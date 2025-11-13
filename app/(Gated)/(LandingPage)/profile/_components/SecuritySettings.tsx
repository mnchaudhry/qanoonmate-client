"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, EyeOff, Smartphone, Mail, UserCheck, Save, Loader2, AlertCircle, CheckCircle, Key, AlertTriangle } from "lucide-react";
import { IUser as UserType } from "@/store/types/user.types";
import { toast } from "react-hot-toast";

interface SecuritySettingsProps {
  user: UserType | null;
}

interface SecurityStatus {
  twoFactorEnabled: boolean;
  lastPasswordChange?: string;
  lastLogin?: string;
  failedLoginAttempts: number;
  accountLocked: boolean;
}

export default function SecuritySettings({ user }: SecuritySettingsProps) {

  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdating2FA, setIsUpdating2FA] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //////////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////////
  useEffect(() => {
    if (user) {
      fetchSecurityStatus();
    }
  }, [user]);

  //////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
  const fetchSecurityStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For now, we'll use mock data since the backend endpoint isn't fully implemented
      // In a real app, you'd fetch this from /api/profile/me/security
      const mockStatus: SecurityStatus = {
        twoFactorEnabled: false,
        lastPasswordChange: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        lastLogin: new Date().toISOString(),
        failedLoginAttempts: 0,
        accountLocked: false
      };

      setSecurityStatus(mockStatus);
    } catch (error) {
      console.error('Failed to fetch security status:', error);
      setError('Failed to load security information');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      setIsChangingPassword(true);

      const response = await fetch('/api/profile/me/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
        credentials: 'include'
      });

      if (response.ok) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        // Update last password change
        setSecurityStatus(prev => prev ? {
          ...prev,
          lastPasswordChange: new Date().toISOString()
        } : null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }
    } catch (error: any) {
      console.error('Failed to change password:', error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handle2FAToggle = async (enabled: boolean) => {
    try {
      setIsUpdating2FA(true);

      const response = await fetch('/api/profile/me/2fa', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setSecurityStatus(prev => prev ? {
          ...prev,
          twoFactorEnabled: data.data.twoFactorEnabled
        } : null);
        toast.success(`Two-factor authentication ${enabled ? 'enabled' : 'disabled'} successfully!`);
      } else {
        throw new Error('Failed to update 2FA settings');
      }
    } catch (error) {
      console.error('Failed to update 2FA:', error);
      toast.error("Failed to update two-factor authentication");
    } finally {
      setIsUpdating2FA(false);
    }
  };

  const getVerificationStatus = (verified: boolean) => {
    return verified ? (
      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Verified
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Not Verified
      </Badge>
    );
  };

  const getLastPasswordChangeText = (timestamp?: string) => {
    if (!timestamp) return "Never";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-slate-900">Security Settings</h4>
            <p className="text-sm text-slate-600">Manage your account security and authentication</p>
          </div>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading security information...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !securityStatus) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-slate-900">Security Settings</h4>
            <p className="text-sm text-slate-600">Manage your account security and authentication</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Failed to load security information</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <Button onClick={fetchSecurityStatus} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!securityStatus) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-slate-900">Security Settings</h4>
            <p className="text-sm text-slate-600">Manage your account security and authentication</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No security information found</h3>
            <p className="text-slate-600">Unable to load your security settings.</p>
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
          <h4 className="text-lg font-semibold text-slate-900">Security Settings</h4>
          <p className="text-sm text-slate-600">Manage your account security and authentication</p>
        </div>
      </div>

      {/* Account Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Account Verification Status</h3>
              <p className="text-sm text-slate-600 font-normal">Your account verification levels</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-xs text-slate-500">Primary email address</p>
                </div>
              </div>
              {getVerificationStatus(user?.emailVerified || false)}
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-xs text-slate-500">Mobile number</p>
                </div>
              </div>
              {getVerificationStatus(user?.phoneVerified || false)}
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Identity</p>
                  <p className="text-xs text-slate-500">Government ID</p>
                </div>
              </div>
              {getVerificationStatus(user?.identityVerified || false)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Change Password</h3>
              <p className="text-sm text-slate-600 font-normal">Update your account password</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handlePasswordChange}
              disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
              className="flex items-center gap-2"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Change Password
                </>
              )}
            </Button>

            {securityStatus.lastPasswordChange && (
              <p className="text-sm text-slate-500">
                Last changed: {getLastPasswordChangeText(securityStatus.lastPasswordChange)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
              <p className="text-sm text-slate-600 font-normal">Add an extra layer of security to your account</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
            <div className="space-y-1">
              <p className="text-sm font-medium">Enable 2FA</p>
              <p className="text-xs text-slate-500">
                {securityStatus.twoFactorEnabled
                  ? "Two-factor authentication is currently enabled"
                  : "Use an authenticator app for additional security"
                }
              </p>
            </div>
            <Switch
              checked={securityStatus.twoFactorEnabled}
              onCheckedChange={handle2FAToggle}
              disabled={isUpdating2FA}
            />
          </div>

          {securityStatus.twoFactorEnabled && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-emerald-800">2FA is active</p>
                  <p className="text-xs text-emerald-700">Your account is protected with two-factor authentication</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Security Information</h3>
              <p className="text-sm text-slate-600 font-normal">Recent security activity and status</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg border border-slate-200">
              <p className="text-sm font-medium text-slate-900">Last Login</p>
              <p className="text-sm text-slate-600">
                {securityStatus.lastLogin ? new Date(securityStatus.lastLogin).toLocaleString() : 'Unknown'}
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200">
              <p className="text-sm font-medium text-slate-900">Failed Login Attempts</p>
              <p className="text-sm text-slate-600">
                {securityStatus.failedLoginAttempts} recent attempts
              </p>
            </div>
          </div>

          {securityStatus.accountLocked && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <div>
                  <p className="text-sm font-medium text-rose-800">Account Temporarily Locked</p>
                  <p className="text-xs text-rose-700">Too many failed login attempts. Try again later.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
