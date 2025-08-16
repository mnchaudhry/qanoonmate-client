"use client"

import { Button } from '@/components/ui/button'
import { User, MessageSquare, FileText, FolderOpen, Mail } from 'lucide-react'

export type TabId = 'about' | 'reviews' | 'blog' | 'documents' | 'contact'

interface NavigationTabsProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export default function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  const tabs: Array<{ id: TabId; label: string; icon: any }> = [
    { id: 'about', label: 'About', icon: User },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
    { id: 'contact', label: 'Contact', icon: Mail },
  ]

  return (
    <div className="bg-surface border border-border rounded-lg overflow-x-auto">
      <div className="flex items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <Button
              key={tab.id}
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 rounded-none border-0 px-4 py-3 min-w-fit ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}


