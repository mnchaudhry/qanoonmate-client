"use client";

import { cn } from "@/lib/utils";
import { User, Briefcase, CheckCircle, ExternalLink, Shield, Bell, CreditCard, MessageSquare, Database } from "lucide-react";
import { ProfileCompletionData } from "@/lib/types/profile.types";

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  completion?: ProfileCompletionData | null;
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
    title: 'Consultations',
    items: [
      {
        id: 'consultation',
        title: 'Consultation Settings',
        description: 'Configure consultation modes and fees',
        icon: Briefcase,
        required: true
      }
    ]
  },
  {
    title: 'Account & Security',
    items: [
      {
        id: 'notifications',
        title: 'Preferences',
        description: 'Preferences',
        icon: Bell,
        required: false
      },
      {
        id: 'security',
        title: 'Security & Privacy',
        description: 'Password, 2FA, and privacy settings',
        icon: Shield,
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

export function SettingsSidebar({ activeSection, onSectionChange, completion }: SettingsSidebarProps) {

  ///////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////// 
  const handleItemClick = (item: any) => {
    if (item.isExternal) {
      window.open(item.externalPath, '_blank', 'noopener,noreferrer');
    } else {
      onSectionChange(item.id);
    }
  };

  ///////////////////////////////////////////////// RENDER ///////////////////////////////////////////////// 
  return (
    <div className="w-full lg:w-64 bg-card h-full">
      <div className="p-4">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Settings</h2>

        <nav className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                {section.title}
              </h3>

              <div className="">
                {section.items.map((item) => {
                  const isActive = activeSection === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200",
                        isActive
                          ? "pl-6 text-primary"
                          : "text-foreground hover:text-primary"
                      )}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 cursor-pointer">
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
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {completion && (
          <div className="mt-6 p-3 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Profile Strength</span>
              <span className="text-sm font-semibold text-primary">
                {completion.overallPercentage}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${completion.overallPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {completion.nextRecommendedAction}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
