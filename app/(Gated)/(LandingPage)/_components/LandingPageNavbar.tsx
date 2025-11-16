'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useStateContext } from '@/context/useStateContext'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import ProfileButton from '@/components/profile-button';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, } from "@/components/ui/navigation-menu"
import { ReleaseChannel, UserRole } from '@/lib/enums';
import { Menu, X, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import NotificationDropdown from '@/components/NotificationDropdown';

const LandingPageNavbar: React.FC = () => {

  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
  const pathname = usePathname();
  const { isScrolled } = useStateContext();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  //////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { label: 'Home', link: '/', subLinks: [], description: 'Go to the homepage.' },
    {
      label: 'Legal KnowledgeBase',
      link: '/knowledgebase',
      description: 'Access acts, case laws, guides, and more.',
      subLinks: [
        { label: 'Acts', link: '/knowledgebase/acts', description: 'Browse a comprehensive collection of Pakistan’s laws, categorized by legal domain.' },
        { label: 'Case Laws', link: '/knowledgebase/case-laws', description: 'Explore key judgments and case summaries from the Supreme Court and High Courts.' },
        { label: 'Legal Dictionary', link: '/knowledgebase/dictionary', description: 'Quick reference for legal terms and phrases to simplify complex jargon.' },
        // { label: 'Legal Guides', link: '/knowledgebase/guides', description: 'Step-by-step guides for legal processes like business registration or IP protection.' },
        { label: 'Drafts', link: '/knowledgebase/drafts', description: "Access legal document drafts." },
        { label: 'FAQs', link: '/knowledgebase/faqs', description: 'Find answers to commonly asked legal questions across different topics.' },
        // { label: 'Legal Forums', link: '/knowledgebase/forums', description: 'Coming soon: Engage with a community of learners and experts in legal discussions.' }
      ]
    },
    { label: 'Chatbot', link: '/chat', subLinks: [], description: 'Get instant legal answers from our AI chatbot.' },
    { label: 'Summarizers', link: '/summarizers', subLinks: [], description: 'Summarize legal documents and cases.' },
    { label: 'Blogs', link: '/blogs', subLinks: [], description: 'Read articles and updates on legal topics.' },
    { label: 'Find Lawyer', link: '/lawyers', subLinks: [], description: 'Search and connect with lawyers.' },
    { label: 'Pricing', link: '/pricing', subLinks: [], description: 'View our subscription and pricing plans.' },
  ];

  //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
  return (
    <>
      {
        user?.releaseChannel === ReleaseChannel.BETA &&
        <div className='bg-indigo-500 text-white p-2 text-center hidden md:block'>
          <p className="text-sm">You are using the beta version of QanoonMate. Please report any issues to <a href="mailto:support@qanoonmate.com" className='underline'>support@qanoonmate.com</a></p>
        </div>
      }
      {
        user?.role === UserRole.ADMIN &&
        <div className='bg-lime-700 text-white p-2 text-center hidden md:block'>
          <p className="text-sm">
            Welcome, Supreme Admin! You now possess godlike powers. Please use them only for good (and maybe a little mischief).
          </p>
        </div>
      }
      <nav
        className={cn(
          "fixed top-0 z-[60] w-full transition-all duration-300 ease-in-out",
          (user?.releaseChannel === ReleaseChannel.BETA || user?.role === UserRole.ADMIN) && !isScrolled && 'md:pt-16',
          isScrolled
            ? 'h-[80px] shadow-md bg-background text-neutral-foreground'
            : 'h-[100px] bg-transparent text-foreground'
        )}
      >
        <div className="h-full w-full flex items-center justify-between px-4 mx-auto md:px-6">
          <div className="flex items-center gap-2">
            <button className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border !border-border bg-background" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Logo size="md" />
          </div>

          <div className="md:hidden block">
            {isAuthenticated ? (
              <ProfileButton />
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" asChild className="flex-1 h-10">
                  <Link href={`/auth/sign-in`} prefetch={true}>Sign In</Link>
                </Button>
                <Button variant="default" asChild className="flex-1 h-10">
                  <Link href={`/auth/sign-up?role=${UserRole.LAWYER}`} prefetch={true}>Register</Link>
                </Button>
              </div>
            )}
          </div>

          <ul className="hidden md:flex items-center space-x-6">

            <NavigationMenu>
              <NavigationMenuList>

                {links.map((item, index) => {

                  const isActive = item.subLinks?.length > 0 ? pathname.includes(item.link) : pathname === item.link;

                  return (
                    <NavigationMenuItem key={index} >
                      {
                        item.subLinks.length > 0
                          ?
                          <>
                            <NavigationMenuTrigger className={cn(isActive ? 'bg-muted' : 'bg-transparent')} >{item.label}</NavigationMenuTrigger>
                            <NavigationMenuContent>
                              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {item.subLinks.map((subLink, index) => (
                                  <Link key={index} prefetch={true} href={subLink.link} passHref className='cursor-pointer' >
                                    <span className={cn("group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted focus:bg-accent focus:text-accent-foreground",)}>
                                      <div className="text-sm font-medium leading-none">{subLink.label}</div>
                                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground ">
                                        {subLink.description}
                                      </p>
                                    </span>
                                  </Link>
                                ))}
                              </ul>
                            </NavigationMenuContent>
                          </>
                          :
                          <Link prefetch={true} href={item.link} passHref className='cursor-pointer' >
                            <span className={cn(navigationMenuTriggerStyle(), isActive ? 'bg-muted' : 'bg-transparent')}>
                              {item.label}
                            </span>
                          </Link>
                      }
                    </NavigationMenuItem>
                  )
                })}

              </NavigationMenuList>
            </NavigationMenu>

            {/* Profile/Sign-In/Sign-Up buttons */}
            {isAuthenticated ? (
              <div className='flex gap-2' >
                <NotificationDropdown viewAllLink={`/${user?.role}/notifications`} />
                <ProfileButton />
              </div>
            ) : (
              <div className="flex gap-3 ml-4">
                <Button
                  variant="outline"
                  asChild
                >
                  <Link href={`/auth/sign-in`} prefetch={true} passHref className='cursor-pointer'>
                    Sign In
                  </Link>
                </Button>
                <Button
                  variant="default"
                  asChild
                >
                  <Link href={`/auth/sign-up?role=${UserRole.LAWYER}`} prefetch={true} passHref className='cursor-pointer'>
                    Register as Lawyer
                  </Link>
                </Button>
              </div>
            )}
          </ul>

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div className="absolute left-0 right-0 top-full bg-background border-t !border-border shadow-md md:hidden">
              <div className="p-3 flex flex-col">
                {links.map((item, index) => {
                  const isActive = item.subLinks?.length > 0 ? pathname.includes(item.link) : pathname === item.link;
                  if (item.subLinks.length === 0) {
                    return (
                      <Link key={index} href={item.link} prefetch={true} className={cn("px-3 py-2 rounded-md text-sm", isActive ? "bg-muted" : "")}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    );
                  }
                  return (
                    <div key={index} className="mb-2">
                      <div className={cn("px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1", isActive ? "bg-muted" : "")}>{item.label}</div>
                      <div className="pl-4 flex flex-col">
                        {item.subLinks.map((sub, idx) => (
                          <Link key={idx} href={sub.link} prefetch={true} className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent flex items-center gap-2"
                            onClick={() => setMobileOpen(false)}
                          >
                            <ChevronRight className="w-3 h-3" />{sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav >
    </>
  );
};

export default LandingPageNavbar;
