"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getClientSettings } from "@/store/reducers/clientSettingsSlice";
import { SettingsSidebar } from "./_components/SettingsSidebar";
import { MobileSettingsSidebar } from "./_components/MobileSettingsSidebar";
import { SettingsContent } from "./_components/SettingsContent";

const SettingsPage = () => {

  //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.clientSettings);

  //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
  const [activeSection, setActiveSection] = useState("profile");

  //////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////
  useEffect(() => {
    dispatch(getClientSettings());
  }, [dispatch]);

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    router.push(`/client/settings?section=${section}`, { scroll: false });
  };

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Sidebar */}
          <MobileSettingsSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />

          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <SettingsSidebar
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span>Loading settings...</span>
                </div>
              </div>
            ) : (
              <SettingsContent activeSection={activeSection} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
