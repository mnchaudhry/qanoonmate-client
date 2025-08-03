"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Settings, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AccountSettingsProps {
  notificationSettings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    twoFactorEnabled: boolean;
  };
  onUpdateSettings: (settings: any) => Promise<void>;
}

export default function AccountSettings({
  notificationSettings,
  onUpdateSettings,
}: AccountSettingsProps) {
  const [settings, setSettings] = useState(notificationSettings);
  const [deactivateOption, setDeactivateOption] = useState<string>("temporary");
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSettingChange = async (setting: string, value: boolean) => {
    const updatedSettings = {
      ...settings,
      [setting]: value,
    };

    setSettings(updatedSettings);

    try {
      await onUpdateSettings(updatedSettings);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
      // Revert the setting change on error
      setSettings(settings);
    }
  };

  const handleDeactivate = async () => {
    setIsLoading(true);

    try {
      // In a real implementation, this would call an API to deactivate the account
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      
      toast.success(
        `Account ${deactivateOption === "temporary" ? "temporarily suspended" : "scheduled for deletion"}. ${
          deactivateOption === "temporary"
            ? "You can reactivate it by logging in within 30 days."
            : "All data will be permanently deleted after 14 days."
        }`
      );
      
      setShowDeactivateDialog(false);
    } catch (error) {
      console.error("Error deactivating account:", error);
      toast.error("Failed to deactivate account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center text-lg">
            <Settings className="mr-2 h-5 w-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Notification Settings */}
            <div>
              <h3 className="text-md font-medium mb-3">Consultation Reminders</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("emailNotifications", checked === true)
                    }
                  />
                  <Label
                    htmlFor="email-notifications"
                    className="text-sm font-normal"
                  >
                    Receive email notifications
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sms-notifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("smsNotifications", checked === true)
                    }
                  />
                  <Label
                    htmlFor="sms-notifications"
                    className="text-sm font-normal"
                  >
                    Receive SMS notifications
                  </Label>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div>
              <h3 className="text-md font-medium mb-3">Account Security</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="two-factor"
                  checked={settings.twoFactorEnabled}
                  onCheckedChange={(checked) =>
                    handleSettingChange("twoFactorEnabled", checked === true)
                  }
                />
                <div>
                  <Label
                    htmlFor="two-factor"
                    className="text-sm font-normal"
                  >
                    Enable Two-Factor Authentication
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Add an extra layer of security to your account by requiring a verification code
                    when you sign in.
                  </p>
                </div>
              </div>
            </div>

            {/* Account Deactivation */}
            <div>
              <h3 className="text-md font-medium mb-3">Account Deactivation</h3>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex-1">
                  <Select
                    value={deactivateOption}
                    onValueChange={setDeactivateOption}
                  >
                    <SelectTrigger className="w-full sm:w-auto">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="temporary">Temporarily Deactivate</SelectItem>
                      <SelectItem value="permanent">Permanently Delete</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    {deactivateOption === "temporary"
                      ? "Your account will be suspended for 30 days, after which it will be automatically reactivated."
                      : "All your data will be permanently deleted after 14 days. This action cannot be undone."}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeactivateDialog(true)}
                >
                  Proceed
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deactivation Confirmation Dialog */}
      <AlertDialog
        open={showDeactivateDialog}
        onOpenChange={setShowDeactivateDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              {deactivateOption === "temporary"
                ? "Temporarily Deactivate Account"
                : "Permanently Delete Account"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deactivateOption === "temporary" ? (
                <p>
                  Your account will be suspended for 30 days. During this time, you won&apos;t be able to
                  access your account or any of your data. You can reactivate your account at any time
                  by signing in.
                </p>
              ) : (
                <p>
                  This will permanently delete your account and all associated data after 14 days.
                  This action cannot be undone. Are you absolutely sure you want to proceed?
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              {isLoading ? "Processing..." : "Yes, proceed"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
