import Logo from '@/components/Logo';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

const data = {
  facebookLink: 'https://www.facebook.com/qanoonmateofficial/',
  instaLink: 'https://www.instagram.com/qanoonmateofficial/',
  twitterLink: 'https://x.com/qanoonmate',
  // githubLink: 'https://github.com/qanoonmate',
  linkedin: "https://www.linkedin.com/company/qanoonmate/",
  services: {
    chatbot: '/chatbot',
    knowledgebase: '/knowledgebase',
    summarizers: '/summarizers',
    lawyers: '/lawyers',
    blogs: '/blogs',
    pricing: '/pricing',
  },
  about: {
    about: '/about',
    privacy: '/privacy-policy',
    terms: '/terms-of-services',
    contact: '/contacts',
  },
  help: {
    faq: '/faq',
    support: '/support',
    contact: '/contacts',
  },
  contact: {
    email: 'contact@qanoonmate.com',
    phone: '+92 300 1234567',
    address: 'Islamabad, Pakistan',
  },
  company: {
    name: 'QanoonMate',
    description:
      'AI-powered legal assistant for Pakistan. Search laws, read case laws, draft documents, and get reliable legal insights instantly.',
    logo: '/favicon.ico',
  },
};

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: data.facebookLink },
  { icon: Instagram, label: 'Instagram', href: data.instaLink },
  { icon: Twitter, label: 'Twitter', href: data.twitterLink },
  // { icon: Github, label: 'GitHub', href: data.githubLink },
  { icon: Linkedin, label: 'LinkedIn', href: data.linkedin },
];

const aboutLinks = [
  { text: 'About Us', href: data.about.about },
  { text: 'Privacy Policy', href: data.about.privacy },
  { text: 'Terms & Conditions', href: data.about.terms },
  { text: 'Contact', href: data.about.contact },
];

const serviceLinks = [
  { text: 'AI Legal Chatbot', href: data.services.chatbot },
  { text: 'Knowledge Base', href: data.services.knowledgebase },
  { text: 'Summarizers', href: data.services.summarizers },
  { text: 'Find Lawyers', href: data.services.lawyers },
  { text: 'Blogs', href: data.services.blogs },
  { text: 'Pricing', href: data.services.pricing },
];

const helpfulLinks = [
  { text: 'FAQs', href: data.help.faq },
  { text: 'Support', href: data.help.support },
  { text: 'Contact', href: data.help.contact, hasIndicator: true },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

const Footer = () => {
  return (
    <footer className="bg-primary-dark dark:bg-secondary/20 mt-16 w-full place-self-end rounded-t-xl">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <Logo />

            <p className="text-foreground/60 mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-primary hover:text-primary/80 transition"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="h-5 w-5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">About</p>
              <ul className="mt-8 space-y-4 text-sm">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-secondary-foreground/70 hover:text-secondary-foreground transition"
                      href={href}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Products</p>
              <ul className="mt-8 space-y-4 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-secondary-foreground/70 hover:text-secondary-foreground transition"
                      href={href}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Helpful Links</p>
              <ul className="mt-8 space-y-4 text-sm">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className={`${hasIndicator
                        ? 'group flex justify-center gap-1.5 sm:justify-start'
                        : 'text-secondary-foreground/70 hover:text-secondary-foreground transition'
                        }`}
                    >
                      <span className="text-secondary-foreground/70 group-hover:text-secondary-foreground transition">
                        {text}
                      </span>
                      {hasIndicator && (
                        <span className="relative flex size-2">
                          <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                          <span className="bg-primary relative inline-flex size-2 rounded-full" />
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Contact</p>
              <ul className="mt-8 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <a
                      className="flex items-center justify-center gap-1.5 sm:justify-start"
                      href="#"
                    >
                      <Icon className="text-primary h-5 w-5 shrink-0" />
                      {isAddress ? (
                        <address className="text-secondary-foreground/70 -mt-0.5 flex-1 not-italic transition">
                          {text}
                        </address>
                      ) : (
                        <span className="text-secondary-foreground/70 flex-1 transition">
                          {text}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm">
              <span className="block sm:inline">All rights reserved.</span>
            </p>

            <p className="text-secondary-foreground/70 mt-4 text-sm transition sm:order-first sm:mt-0">
              &copy; 2025 {data.company.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
