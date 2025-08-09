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
import { UserRole } from '@/lib/enums';

const LandingPageNavbar: React.FC = () => {

  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
  const pathname = usePathname();
  const { isScrolled } = useStateContext();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  //////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
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
        { label: 'Legal Guides', link: '/knowledgebase/guides', description: 'Step-by-step guides for legal processes like business registration or IP protection.' },
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
    <nav
      className={cn(
        "fixed top-0 z-[60] w-full transition-all duration-300 ease-in-out ",
        isScrolled
          ? 'h-[80px] shadow-md bg-background text-neutral-foreground'
          : 'h-[100px] bg-transparent text-foreground'
      )}
    >
      <div className="h-full w-full flex items-center justify-between px-4 mx-auto md:px-6">
        <Logo size="md" />

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
            <>
              <ProfileButton />
            </>
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


      </div>
    </nav >
  );
};

export default LandingPageNavbar;
