"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Briefcase, CheckCircle, Clock, Menu, X, ExternalLink, Eye, Shield, Bell, CreditCard, MessageSquare, Database } from "lucide-react";
import { ProfileCompletionData } from "@/lib/types/profile.types";
import { useIsMobile } from "@/lib/utils/mobile-optimization";

interface MobileSettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  completion: ProfileCompletionData | null | undefined;
}

const settingsSections = [
  {
    title: 'Profile Management',
    items: [
      {
        id: 'profile',
        title: 'Profile Settings',
        description: 'Profile visibility and display settings',
        icon: User,
        required: true
      },
      {
        id: 'edit-profile',
        title: 'Edit Profile',
        description: 'Update your professional information',
        icon: ExternalLink,
        isExternal: true,
        externalPath: '/lawyers/me',
        required: false
      },
    ]
  },
  {
    title: 'Services & Availability',
    items: [
      {
        id: 'consultation',
        title: 'Consultation Settings',
        description: 'Configure consultation modes and fees',
        icon: Briefcase,
        required: true
      },
      {
        id: 'availability',
        title: 'Availability',
        description: 'Set your working hours and schedule',
        icon: Clock,
        required: true
      },
    ]
  },
  {
    title: 'Account & Security',
    items: [
      {
        id: 'security',
        title: 'Security & Privacy',
        description: 'Password, 2FA, and privacy settings',
        icon: Shield,
        required: false
      },
      {
        id: 'notifications',
        title: 'Notifications',
        description: 'Email and push notification preferences',
        icon: Bell,
        required: false
      },
      {
        id: 'billing',
        title: 'Billing & Payments',
        description: 'Payment methods and billing history',
        icon: CreditCard,
        required: false
      },
      {
        id: 'verification',
        title: 'Identity Verification',
        description: 'Complete your identity verification',
        icon: CheckCircle,
        required: true
      },
    ]
  },
  {
    title: 'Preferences',
    items: [
      {
        id: 'visibility',
        title: 'Profile Visibility',
        description: 'Control who can see your profile',
        icon: Eye,
        required: false
      },
      {
        id: 'communication',
        title: 'Communication Preferences',
        description: 'Set your communication settings',
        icon: MessageSquare,
        required: false
      },
      {
        id: 'data',
        title: 'Data & Privacy',
        description: 'Manage your data and privacy',
        icon: Database,
        required: false
      },
    ]
  }
];

export function MobileSettingsSidebar({ activeSection, onSectionChange, completion }: MobileSettingsSidebarProps) {

  ///////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////// 
  const isMobile = useIsMobile();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  ///////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////// 
  const getStatusIcon = (itemId: string) => {
    if (!completion) return null;

    const sectionMap: Record<string, keyof typeof completion.sectionCompletion> = {
      'profile': 'personalInfo',
      'consultation': 'services',
      'availability': 'services',
      'verification': 'verification'
    };

    const completionKey = sectionMap[itemId];
    if (completionKey) {
      const sectionCompletion = completion.sectionCompletion[completionKey];

      if (sectionCompletion.completed) {
        return <CheckCircle className="w-4 h-4 text-primary" />;
      } else if (sectionCompletion.percentage > 0) {
        return <Clock className="w-4 h-4 text-amber-600" />;
      }
    }

    return null;
  };

  const handleItemClick = (item: any) => {
    if (item.isExternal) {
      router.push(item.externalPath);
    } else {
      onSectionChange(item.id);
    }
    setIsOpen(false);
  };

  if (!isMobile) {
    return null;
  }

  ///////////////////////////////////////////////// RENDER ///////////////////////////////////////////////// 
  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-full justify-start border-border"
        >
          <Menu className="w-4 h-4 mr-2" />
          Settings Menu
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />

          {/* Mobile Sidebar */}
          <div className="fixed left-0 top-0 h-full w-72 bg-card shadow-xl overflow-y-auto border-r border-border">

            <div className="p-4 ">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Settings</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-5">
              {settingsSections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>

                  <div className="">
                    {section.items.map((item) => {
                      const isActive = activeSection === item.id;
                      const statusIcon = getStatusIcon(item.id);
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200 ${isActive
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-foreground hover:text-primary"
                            }`}
                        >
                          <div className="flex items-start gap-2 flex-1">
                            <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{item.title}</span>
                                {item.required && (
                                  <span className="text-xs text-destructive font-medium">*</span>
                                )}
                                {item.isExternal && (
                                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </div>
                          {statusIcon}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Profile Completion Summary */}
            {completion && (
              <div className="p-4 border-t border-border bg-muted/30">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">Profile Completion</span>
                    <span className="font-semibold text-primary">
                      {completion.overallPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completion.overallPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {completion.nextRecommendedAction}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
