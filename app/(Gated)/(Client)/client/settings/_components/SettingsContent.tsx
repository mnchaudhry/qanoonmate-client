"use client";

import ProfileInformation from "./ProfileInformation";
import Security from "./Security";
import Preferences from "./Preferences";
import Verifications from "./Verifications";
import Billing from "./Billing";
import DangerZone from "./DangerZone";

interface SettingsContentProps {
  activeSection: string;
}

export function SettingsContent({ activeSection }: SettingsContentProps) {

  ///////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////// 
  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileInformation />;
      case 'security':
        return <Security />;
      case 'preferences':
        return <Preferences />;
      case 'verifications':
        return <Verifications />;
      case 'billing':
        return <Billing />;
      case 'danger':
        return <DangerZone />;
      default:
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-foreground mb-2">
                Select a section to get started
              </h3>
              <p className="text-muted-foreground">
                Choose a section from the sidebar to configure your settings
              </p>
            </div>
          </div>
        );
    }
  };

  ///////////////////////////////////////////////// RENDER ///////////////////////////////////////////////// 
  return (
    <div className="flex-1">
      {renderSection()}
    </div>
  );
}
