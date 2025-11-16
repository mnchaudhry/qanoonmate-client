"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ILawyer } from "@/store/types/lawyer.types";
import { ProfileCompletionData } from "@/lib/types/profile.types";
import { calculateProfileCompletion } from "@/lib/utils/profileCompletion";
import { SettingsSidebar } from "./_components/SettingsSidebar";
import { MobileSettingsSidebar } from "./_components/MobileSettingsSidebar";
import { SettingsContent } from "./_components/SettingsContent";


export default function LawyerSettings() {

  ///////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////// 
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const lawyer = user as ILawyer;

  ///////////////////////////////////////////////// STATES ///////////////////////////////////////////////// 
  const [activeSection, setActiveSection] = useState("profile");
  const [completion, setCompletion] = useState<ProfileCompletionData | null>(null);

  ///////////////////////////////////////////////// EFFECTS ///////////////////////////////////////////////// 
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  useEffect(() => {
    if (lawyer) {
      const completionData = calculateProfileCompletion(lawyer);
      setCompletion(completionData);
    }
  }, [lawyer]);

  ///////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////// 
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    router.push(`/lawyer/settings?section=${section}`, { scroll: false });
  };

  ///////////////////////////////////////////////// RENDER ///////////////////////////////////////////////// 
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 pb-8 pt-2">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Sidebar */}
          <MobileSettingsSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            completion={completion}
          />

          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <SettingsSidebar
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              completion={completion}
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <SettingsContent activeSection={activeSection} />
          </div>
        </div>
      </div>
    </div>
  );
}
