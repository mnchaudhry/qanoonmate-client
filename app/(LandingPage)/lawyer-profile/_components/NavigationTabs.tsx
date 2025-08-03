import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  User, 
  MessageSquare, 
  Calendar, 
  FileText, 
  FolderOpen, 
  Mail 
} from 'lucide-react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavigationTabs = ({ activeTab, onTabChange }: Props) => {
  const tabs = [
    { id: 'about', label: 'About', icon: User },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'availability', label: 'Availability', icon: Calendar },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <Card className="mx-6 mt-6 border-primary-200">
      <div className="flex items-center overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              size="lg"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 rounded-none border-0 px-6 py-4 min-w-fit ${
                isActive 
                  ? 'bg-primary-600 text-white hover:bg-primary-700' 
                  : 'text-secondary-700 hover:text-primary-700 hover:bg-primary-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default NavigationTabs;