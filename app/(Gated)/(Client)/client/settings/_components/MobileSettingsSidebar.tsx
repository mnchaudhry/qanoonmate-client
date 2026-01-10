"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Shield, Bell, CreditCard, FileText, AlertTriangle, Menu, X } from "lucide-react";
import { useIsMobile } from "@/lib/utils/mobile-optimization";

interface MobileSettingsSidebarProps {
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

export function MobileSettingsSidebar({ activeSection, onSectionChange }: MobileSettingsSidebarProps) {

  ///////////////////////////////////////////////// STATE ///////////////////////////////////////////////// 
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  ///////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////// 
  const handleSectionChange = (sectionId: string) => {
    onSectionChange(sectionId);
    setIsOpen(false);
  };

  const getActiveSection = () => {
    for (const section of settingsSections) {
      const item = section.items.find(item => item.id === activeSection);
      if (item) return item;
    }
    return settingsSections[0].items[0];
  };

  const activeItem = getActiveSection();
  const ActiveIcon = activeItem.icon;

  ///////////////////////////////////////////////// RENDER ///////////////////////////////////////////////// 
  if (!isMobile) return null;

  return (
    <div className="lg:hidden">
      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        className="w-full flex items-center justify-between p-4 mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <ActiveIcon className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">{activeItem.title}</div>
            <div className="text-xs text-muted-foreground">{activeItem.description}</div>
          </div>
        </div>
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="mb-6 bg-card border rounded-lg p-4 space-y-4 animate-in slide-in-from-top-2">
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = activeSection === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSectionChange(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{item.title}</span>
                          {item.required && (
                            <span className="text-xs text-destructive font-medium">*</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
