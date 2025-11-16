"use client";

import { cn } from "@/lib/utils";
import { User, Shield, Bell, CreditCard, FileText, AlertTriangle } from "lucide-react";

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const settingsSections = [
  {
    title: 'Profile',
    items: [
      {
        id: 'profile',
        title: 'Profile Information',
        description: 'Personal details and contact info',
        icon: User,
        required: false
      }
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
        id: 'preferences',
        title: 'Preferences',
        description: 'Notifications and app settings',
        icon: Bell,
        required: false
      },
      {
        id: 'verifications',
        title: 'Verifications',
        description: 'Identity and document verification',
        icon: FileText,
        required: false
      },
    ]
  },
  {
    title: 'Billing',
    items: [
      {
        id: 'billing',
        title: 'Billing & Payments',
        description: 'Payment methods and billing history',
        icon: CreditCard,
        required: false
      },
    ]
  },
  {
    title: 'Advanced',
    items: [
      {
        id: 'danger',
        title: 'Danger Zone',
        description: 'Account deletion and reset options',
        icon: AlertTriangle,
        required: false
      },
    ]
  }
];

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {

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
                      onClick={() => onSectionChange(item.id)}
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
      </div>
    </div>
  );
}
