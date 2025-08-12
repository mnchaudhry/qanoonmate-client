"use client"

import { Settings, Gavel, Users, Shield, BarChart, Bell, Newspaper, LayoutDashboard, MessageSquare, AlertTriangle, HeadphonesIcon, TrendingUp, CheckCircle, Flag, BookOpen, FileStack, DollarSign, Clock, UserCheck, HelpCircle, ChevronRight, ChevronDown } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, } from '../../../components/ui/sidebar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState, useEffect } from "react";
import Logo from "@/components/Logo"

// Main navigation items
const mainItems = [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
]

// User Management items
const userManagementItems = [
    { title: "All Users", url: "/admin/users", icon: Users },
    {
        title: "Lawyers", url: "/admin/lawyers", icon: UserCheck,
        subItems: [
            { title: "Pending", url: "/admin/lawyers/pending" },
            { title: "Approved", url: "/admin/lawyers/approved" },
            { title: "Rejected", url: "/admin/lawyers/rejected" }
        ]
    },
    { title: "Admins", url: "/admin/admins", icon: Shield },
]

// Consultations items
const consultationsItems = [
    { title: "All Consultations", url: "/admin/consultations", icon: FileStack },
    { title: "Schedule Conflicts", url: "/admin/consultations/conflicts", icon: Clock },
    { title: "Payments & Fees", url: "/admin/consultations/payments", icon: DollarSign },
]

// Legal Content Management items
const legalContentItems = [
    {
        title: "Acts & Laws", url: "/admin/legal-db/act", icon: Gavel,
        subItems: [
            { title: "All Acts", url: "/admin/legal-db/act" },
            { title: "View / Edit / Add", url: "/admin/legal-db/act/manage" },
            { title: "Bulk Upload", url: "/admin/legal-db/act/bulk-upload" }
        ]
    },
    {
        title: "Case Laws", url: "/admin/legal-db/case-law", icon: BookOpen,
        subItems: [
            { title: "All Case Laws", url: "/admin/legal-db/case-law" },
            { title: "View / Edit / Add", url: "/admin/legal-db/case-law/manage" },
            { title: "Bulk Upload & Review", url: "/admin/legal-db/case-law/bulk-upload" }
        ]
    },
    {
        title: "Legal Drafts", url: "/admin/drafts", icon: Newspaper,
        subItems: [
            { title: "All Drafts", url: "/admin/drafts" },
            { title: "Templates & Categories", url: "/admin/legal-db/drafts/templates" }
        ]
    },
    {
        title: "Legal FAQs", url: "/admin/legal-db/faq", icon: HelpCircle,
        subItems: [
            { title: "All FAQs", url: "/admin/legal-db/faq" },
            { title: "View / Approve / Edit", url: "/admin/legal-db/faq/manage" }
        ]
    },
    {
        title: "Legal Dictionary", url: "/admin/legal-db/dictionary", icon: BookOpen,
        subItems: [
            { title: "All Dictionary", url: "/admin/legal-db/dictionary" },
            { title: "Terms Management", url: "/admin/legal-db/dictionary/terms" }
        ]
    },
    {
        title: "Legal Guides", url: "/admin/legal-db/guide", icon: BookOpen,
        subItems: [
            { title: "All Guides", url: "/admin/legal-db/guide" },
            { title: "View / Approve / Seed", url: "/admin/legal-db/guide/manage" }
        ]
    },
]

// Feedback & Reports items
const feedbackReportsItems = [
    { title: "Reported Content", url: "/admin/feedback/reported", icon: Flag },
    { title: "Lawyer Feedback", url: "/admin/feedback/lawyers", icon: MessageSquare },
    { title: "System Errors / Logs", url: "/admin/feedback/errors", icon: AlertTriangle },
]

// System Configuration items
const systemConfigItems = [
    { title: "Role Permissions", url: "/admin/system/permissions", icon: Shield },
    { title: "Platform Settings", url: "/admin/system/settings", icon: Settings },
    { title: "Notification Templates", url: "/admin/system/notifications", icon: Bell },
]

// Support Tickets items
const supportTicketsItems = [
    { title: "Open", url: "/admin/support/open", icon: HeadphonesIcon },
    { title: "Closed", url: "/admin/support/closed", icon: CheckCircle },
    { title: "Escalated", url: "/admin/support/escalated", icon: AlertTriangle },
]

// Analytics items
const analyticsItems = [
    { title: "Platform Usage", url: "/admin/analytics/usage", icon: BarChart },
    { title: "Search Trends", url: "/admin/analytics/search", icon: TrendingUp },
    { title: "Most Viewed Resources", url: "/admin/analytics/resources", icon: BarChart },
]

// Content Verification items
const contentVerificationItems = [
    { title: "Verify New Submissions", url: "/admin/verification/submissions", icon: CheckCircle },
    { title: "Flagged Edits", url: "/admin/verification/flagged", icon: Flag },
]

// Moderation Queue items
const moderationQueueItems = [
    { title: "Unverified Lawyers", url: "/admin/moderation/lawyers", icon: UserCheck },
    { title: "Disputed Consultations", url: "/admin/moderation/consultations", icon: AlertTriangle },
    { title: "Reported Content", url: "/admin/moderation/reported", icon: Flag },
]

export function AdminSidebar() {

    //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
    const pathname = usePathname();

    //////////////////////////////////////////////////// STATES ////////////////////////////////////////////////////
    const [manualOpen, setManualOpen] = useState<Record<string, boolean>>(() => {
        // Load saved state from localStorage
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('admin-sidebar-state');
            return saved ? JSON.parse(saved) : {};
        }
        return {};
    });

    //////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
    const isActive = useCallback((url: string) => pathname === url || pathname.startsWith(url + "/"), [pathname]);
    const isSectionActive = useCallback((items: any[]) => {
        return items.some(item => {
            if (item.subItems) {
                return item.subItems.some((subItem: any) => isActive(subItem.url));
            }
            return isActive(item.url);
        });
    }, [isActive]);

    const activeSections = useMemo(() => {
        const sections: string[] = [];
        if (isSectionActive(userManagementItems)) sections.push("user-management");
        if (isSectionActive(consultationsItems)) sections.push("consultations");
        if (isSectionActive(legalContentItems)) sections.push("legal-content");
        if (isSectionActive(feedbackReportsItems)) sections.push("feedback-reports");
        if (isSectionActive(systemConfigItems)) sections.push("system-config");
        if (isSectionActive(supportTicketsItems)) sections.push("support-tickets");
        if (isSectionActive(analyticsItems)) sections.push("analytics");
        if (isSectionActive(contentVerificationItems)) sections.push("content-verification");
        if (isSectionActive(moderationQueueItems)) sections.push("moderation-queue");
        return sections;
    }, [isSectionActive]);

    // Auto-open sections when they become active
    useEffect(() => {
        const newState = { ...manualOpen };
        activeSections.forEach(section => {
            if (!newState[section]) {
                newState[section] = true;
            }
        });
        
        if (JSON.stringify(newState) !== JSON.stringify(manualOpen)) {
            setManualOpen(newState);
            if (typeof window !== 'undefined') {
                localStorage.setItem('admin-sidebar-state', JSON.stringify(newState));
            }
        }
    }, [activeSections, manualOpen]);

    const isSectionOpen = (section: string) => {
        return activeSections.includes(section) || manualOpen[section];
    };

    const handleToggleSection = (section: string) => {
        setManualOpen(prev => {
            const newState = { ...prev, [section]: !prev[section] };
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('admin-sidebar-state', JSON.stringify(newState));
            }
            return newState;
        });
    };

    //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
    return (
        <Sidebar className="w-64 bg-sidebar-background border-r border-sidebar-border">
            <SidebarContent>

                <SidebarHeader className="h-[60px] flex items-center justify-center " >
                    <SidebarMenu>
                        <SidebarMenuItem className="w-full flex justify-center">
                            <Logo size="md" />
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* Main Navigation */}
                            {mainItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className={`hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-foreground ${isActive(item.url) ? 'bg-sidebar-accent text-sidebar-foreground font-medium' : ''
                                            }`}
                                    >
                                        <a href={item.url} className="flex items-center gap-3">
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}

                            {/* User Management */}
                            <SidebarMenuItem>
                                <Collapsible
                                    open={isSectionOpen('user-management')}
                                    onOpenChange={() => handleToggleSection('user-management')}
                                >
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            className={`hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-foreground ${isSectionActive(userManagementItems) ? 'bg-sidebar-accent text-sidebar-foreground font-medium' : ''
                                                }`}
                                        >
                                            <Users className="w-5 h-5" />
                                            <span>User Management</span>
                                            {isSectionOpen('user-management') ?
                                                <ChevronDown className="w-4 h-4 ml-auto" /> :
                                                <ChevronRight className="w-4 h-4 ml-auto" />
                                            }
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {userManagementItems.map((item) => (
                                                item.subItems ? (
                                                    <SidebarMenuSubItem key={item.title}>
                                                        <Collapsible>
                                                            <CollapsibleTrigger asChild>
                                                                <SidebarMenuButton
                                                                    className={`hover:bg-primary-100 text-primary-600 hover:text-primary-700 ${item.subItems.some((subItem: any) => isActive(subItem.url)) ? 'bg-primary-100 text-primary-700 font-medium' : ''
                                                                        }`}
                                                                >
                                                                    <item.icon className="w-4 h-4" />
                                                                    <span>{item.title}</span>
                                                                    <ChevronRight className="w-3 h-3 ml-auto" />
                                                                </SidebarMenuButton>
                                                            </CollapsibleTrigger>
                                                            <CollapsibleContent>
                                                                <SidebarMenuSub>
                                                                    {item.subItems.map((subItem) => (
                                                                        <SidebarMenuSubItem key={subItem.title}>
                                                                            <SidebarMenuButton
                                                                                asChild
                                                                                className={`hover:bg-primary-100 text-primary-600 hover:text-primary-700 ${isActive(subItem.url) ? 'bg-primary-100 text-primary-700 font-medium' : ''
                                                                                    }`}
                                                                            >
                                                                                <a href={subItem.url} className="flex items-center gap-2">
                                                                                    <span className="text-sm">{subItem.title}</span>
                                                                                </a>
                                                                            </SidebarMenuButton>
                                                                        </SidebarMenuSubItem>
                                                                    ))}
                                                                </SidebarMenuSub>
                                                            </CollapsibleContent>
                                                        </Collapsible>
                                                    </SidebarMenuSubItem>
                                                ) : (
                                                    <SidebarMenuSubItem key={item.title}>
                                                        <SidebarMenuButton
                                                            asChild
                                                            className={`hover:bg-primary-100 text-primary-600 hover:text-primary-700 ${isActive(item.url) ? 'bg-primary-100 text-primary-700 font-medium' : ''
                                                                }`}
                                                        >
                                                            <a href={item.url} className="flex items-center gap-2">
                                                                <item.icon className="w-4 h-4" />
                                                                <span className="text-sm">{item.title}</span>
                                                            </a>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuSubItem>
                                                )
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>

                            {/* Consultations */}
                            <SidebarMenuItem>
                                <Collapsible
                                    open={isSectionOpen('consultations')}
                                    onOpenChange={() => handleToggleSection('consultations')}
                                >
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            className={`hover:bg-primary-100 text-primary-700 hover:text-primary-800 ${isSectionActive(consultationsItems) ? 'bg-primary-100 text-primary-800 font-medium' : ''
                                                }`}
                                        >
                                            <FileStack className="w-5 h-5" />
                                            <span>Consultations</span>
                                            {isSectionOpen('consultations') ?
                                                <ChevronDown className="w-4 h-4 ml-auto" /> :
                                                <ChevronRight className="w-4 h-4 ml-auto" />
                                            }
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {consultationsItems.map((item) => (
                                                <SidebarMenuSubItem key={item.title}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        className={`hover:bg-primary-100 text-primary-600 hover:text-primary-700 ${isActive(item.url) ? 'bg-primary-100 text-primary-700 font-medium' : ''
                                                            }`}
                                                    >
                                                        <a href={item.url} className="flex items-center gap-2">
                                                            <item.icon className="w-4 h-4" />
                                                            <span className="text-sm">{item.title}</span>
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>

                            {/* Legal Content Management */}
                            <SidebarMenuItem>
                                <Collapsible
                                    open={isSectionOpen('legal-content')}
                                    onOpenChange={() => handleToggleSection('legal-content')}
                                >
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            className={`hover:bg-primary-100 text-primary-700 hover:text-primary-800 ${isSectionActive(legalContentItems) ? 'bg-primary-100 text-primary-800 font-medium' : ''
                                                }`}
                                        >
                                            <Gavel className="w-5 h-5" />
                                            <span>Legal Content</span>
                                            {isSectionOpen('legal-content') ?
                                                <ChevronDown className="w-4 h-4 ml-auto" /> :
                                                <ChevronRight className="w-4 h-4 ml-auto" />
                                            }
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {legalContentItems.map((item) => (
                                                item.subItems ? (
                                                    <SidebarMenuSubItem key={item.title}>
                                                        <Collapsible>
                                                            <CollapsibleTrigger asChild>
                                                                <SidebarMenuButton
                                                                    className={`hover:bg-primary-100 text-primary-600 hover:text-primary-700 ${item.subItems.some((subItem: any) => isActive(subItem.url)) ? 'bg-primary-100 text-primary-700 font-medium' : ''
                                                                        }`}
                                                                >
                                                                    <item.icon className="w-4 h-4" />
                                                                    <span>{item.title}</span>
                                                                    <ChevronRight className="w-3 h-3 ml-auto" />
                                                                </SidebarMenuButton>
                                                            </CollapsibleTrigger>
                                                            <CollapsibleContent>
                                                                <SidebarMenuSub>
                                                                    {item.subItems.map((subItem) => (
                                                                        <SidebarMenuSubItem key={subItem.title}>
                                                                            <SidebarMenuButton
                                                                                asChild
                                                                                className={`hover:bg-primary-100 text-primary-600 hover:text-primary-700 ${isActive(subItem.url) ? 'bg-primary-100 text-primary-700 font-medium' : ''
                                                                                    }`}
                                                                            >
                                                                                <a href={subItem.url} className="flex items-center gap-2">
                                                                                    <span className="text-sm">{subItem.title}</span>
                                                                                </a>
                                                                            </SidebarMenuButton>
                                                                        </SidebarMenuSubItem>
                                                                    ))}
                                                                </SidebarMenuSub>
                                                            </CollapsibleContent>
                                                        </Collapsible>
                                                    </SidebarMenuSubItem>
                                                ) : (
                                                    <SidebarMenuSubItem key={item.title}>
                                                        <SidebarMenuButton
                                                            asChild
                                                            className={`hover:bg-primary-100 text-primary-600 hover:text-primary-700 ${isActive(item.url) ? 'bg-primary-100 text-primary-700 font-medium' : ''
                                                                }`}
                                                        >
                                                            <a href={item.url} className="flex items-center gap-2">
                                                                <item.icon className="w-4 h-4" />
                                                                <span className="text-sm">{item.title}</span>
                                                            </a>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuSubItem>
                                                )
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>

                            {/* Feedback & Reports */}
                            <SidebarMenuItem>
                                <Collapsible
                                    open={isSectionOpen('feedback-reports')}
                                    onOpenChange={() => handleToggleSection('feedback-reports')}
                                >
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            className={`hover:bg-primary-100 text-primary-700 hover:text-primary-800 ${isSectionActive(feedbackReportsItems) ? 'bg-primary-100 text-primary-800 font-medium' : ''
                                                }`}
                                        >
                                            <Flag className="w-5 h-5" />
                                            <span>Feedback & Reports</span>
                                            {isSectionOpen('feedback-reports') ?
                                                <ChevronDown className="w-4 h-4 ml-auto" /> :
                                                <ChevronRight className="w-4 h-4 ml-auto" />
                                            }
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {feedbackReportsItems.map((item) => (
                                                <SidebarMenuSubItem key={item.title}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        className={`hover:bg-primary-100 text-primary-600 hover:text-primary-700 ${isActive(item.url) ? 'bg-primary-100 text-primary-700 font-medium' : ''
                                                            }`}
                                                    >
                                                        <a href={item.url} className="flex items-center gap-2">
                                                            <item.icon className="w-4 h-4" />
                                                            <span className="text-sm">{item.title}</span>
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>

                            {/* System Config */}
                            <SidebarMenuItem>
                                <Collapsible
                                    open={isSectionOpen('system-config')}
                                    onOpenChange={() => handleToggleSection('system-config')}
                                >
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            className={`hover:bg-primary-100 text-primary-700 hover:text-primary-800 ${isSectionActive(systemConfigItems) ? 'bg-primary-100 text-primary-800 font-medium' : ''
                                                }`}
                                        >
                                            <Settings className="w-5 h-5" />
                                            <span>System Config</span>
                                            {isSectionOpen('system-config') ?
                                                <ChevronDown className="w-4 h-4 ml-auto" /> :
                                                <ChevronRight className="w-4 h-4 ml-auto" />
                                            }
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {systemConfigItems.map((item) => (
                                                <SidebarMenuSubItem key={item.title}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        className={`hover:bg-primary-100 text-primary-600 hover:text-primary-700 ${isActive(item.url) ? 'bg-primary-100 text-primary-700 font-medium' : ''
                                                            }`}
                                                    >
                                                        <a href={item.url} className="flex items-center gap-2">
                                                            <item.icon className="w-4 h-4" />
                                                            <span className="text-sm">{item.title}</span>
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>

                            {/* Support Tickets */}
                            <SidebarMenuItem>
                                <Collapsible
                                    open={isSectionOpen('support-tickets')}
                                    onOpenChange={() => handleToggleSection('support-tickets')}
                                >
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            className={`hover:bg-primary-100 text-primary-700 hover:text-primary-800 ${isSectionActive(supportTicketsItems) ? 'bg-primary-100 text-primary-800 font-medium' : ''
                                                }`}
                                        >
                                            <HeadphonesIcon className="w-5 h-5" />
                                            <span>Support Tickets</span>
                                            {isSectionOpen('support-tickets') ?
                                                <ChevronDown className="w-4 h-4 ml-auto" /> :
                                                <ChevronRight className="w-4 h-4 ml-auto" />
                                            }
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {supportTicketsItems.map((item) => (
                                                <SidebarMenuSubItem key={item.title}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        className={`hover:bg-primary-100 text-primary-600 hover:text-primary-700 ${isActive(item.url) ? 'bg-primary-100 text-primary-700 font-medium' : ''
                                                            }`}
                                                    >
                                                        <a href={item.url} className="flex items-center gap-2">
                                                            <item.icon className="w-4 h-4" />
                                                            <span className="text-sm">{item.title}</span>
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>

                            {/* Analytics */}
                            <SidebarMenuItem>
                                <Collapsible
                                    open={isSectionOpen('analytics')}
                                    onOpenChange={() => handleToggleSection('analytics')}
                                >
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            className={`hover:bg-primary-100 text-primary-700 hover:text-primary-800 ${isSectionActive(analyticsItems) ? 'bg-primary-100 text-primary-800 font-medium' : ''
                                                }`}
                                        >
                                            <BarChart className="w-5 h-5" />
                                            <span>Analytics</span>
                                            {isSectionOpen('analytics') ?
                                                <ChevronDown className="w-4 h-4 ml-auto" /> :
                                                <ChevronRight className="w-4 h-4 ml-auto" />
                                            }
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {analyticsItems.map((item) => (
                                                <SidebarMenuSubItem key={item.title}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        className={`hover:bg-primary-100 text-primary-600 hover:text-primary-700 ${isActive(item.url) ? 'bg-primary-100 text-primary-700 font-medium' : ''
                                                            }`}
                                                    >
                                                        <a href={item.url} className="flex items-center gap-2">
                                                            <item.icon className="w-4 h-4" />
                                                            <span className="text-sm">{item.title}</span>
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>

                            {/* Content Verification */}
                            <SidebarMenuItem>
                                <Collapsible
                                    open={isSectionOpen('content-verification')}
                                    onOpenChange={() => handleToggleSection('content-verification')}
                                >
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            className={`hover:bg-primary-100 text-primary-700 hover:text-primary-800 ${isSectionActive(contentVerificationItems) ? 'bg-primary-100 text-primary-800 font-medium' : ''
                                                }`}
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            <span>Content Verification</span>
                                            {isSectionOpen('content-verification') ?
                                                <ChevronDown className="w-4 h-4 ml-auto" /> :
                                                <ChevronRight className="w-4 h-4 ml-auto" />
                                            }
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {contentVerificationItems.map((item) => (
                                                <SidebarMenuSubItem key={item.title}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        className={`hover:bg-primary-100 text-primary-600 hover:text-primary-700 ${isActive(item.url) ? 'bg-primary-100 text-primary-700 font-medium' : ''
                                                            }`}
                                                    >
                                                        <a href={item.url} className="flex items-center gap-2">
                                                            <item.icon className="w-4 h-4" />
                                                            <span className="text-sm">{item.title}</span>
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>

                            {/* Moderation Queue */}
                            <SidebarMenuItem>
                                <Collapsible
                                    open={isSectionOpen('moderation-queue')}
                                    onOpenChange={() => handleToggleSection('moderation-queue')}
                                >
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            className={`hover:bg-primary-100 text-primary-700 hover:text-primary-800 ${isSectionActive(moderationQueueItems) ? 'bg-primary-100 text-primary-800 font-medium' : ''
                                                }`}
                                        >
                                            <UserCheck className="w-5 h-5" />
                                            <span>Moderation Queue</span>
                                            {isSectionOpen('moderation-queue') ?
                                                <ChevronDown className="w-4 h-4 ml-auto" /> :
                                                <ChevronRight className="w-4 h-4 ml-auto" />
                                            }
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {moderationQueueItems.map((item) => (
                                                <SidebarMenuSubItem key={item.title}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        className={`hover:bg-primary-100 text-primary-600 hover:text-primary-700 ${isActive(item.url) ? 'bg-primary-100 text-primary-700 font-medium' : ''
                                                            }`}
                                                    >
                                                        <a href={item.url} className="flex items-center gap-2">
                                                            <item.icon className="w-4 h-4" />
                                                            <span className="text-sm">{item.title}</span>
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
