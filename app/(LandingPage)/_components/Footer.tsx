"use client"

import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { FaInstagram, FaTwitter, FaFacebook, FaEnvelope, } from 'react-icons/fa';

const LandingPageFooter: React.FC = () => {

  /////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////////// 
  const services = [
    { name: 'Legal Chatbot', link: '/chatbot', description: 'Ask legal questions and get instant, AI-generated responses tailored to Pakistan’s legal system.', },
    { name: 'Legal KnowledgeBase', link: '/knowledge', description: 'Browse simplified summaries of laws, legal topics, and documents — your go-to legal resource hub.', },
    { name: 'Legal Drafts', link: '/drafts', description: 'Access downloadable, editable legal documents — from contracts to affidavits — organized by category.', },
    { name: 'Legal Summaries', link: '/summaries', description: 'Upload legal content or enter queries to receive AI-generated act, case law, and topic summaries.', },
    { name: 'Legal Blogs', link: '/blogs', description: 'Read expert-written articles on legal trends, reforms, and insights from lawyers and researchers.', },
    { name: 'Legal News', link: '/news', description: 'Stay updated with weekly or real-time coverage of court rulings, policy changes, and legal reforms.', },
    { name: 'Find Lawyer', link: '/find-lawyer', description: 'Search verified lawyers by expertise, location, and availability — complete with filters and profiles.', },
    { name: 'Book Consultations', link: '/consultations', description: 'Schedule secure legal consultations online or in-person with trusted, verified professionals.', },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ];

  const socialLinks = [
    { name: 'Instagram', icon: <FaInstagram size={20} /> },
    { name: 'Twitter', icon: <FaTwitter size={20} /> },
    { name: 'Facebook', icon: <FaFacebook size={20} /> },
    { name: 'Email', icon: <FaEnvelope size={20} /> },
  ];

  /////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////////// 
  return (
    <footer className="bg-primary-dark text-neutral pt-24 pb-8">

      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & About */}
        <div className='space-y-5'>
          <Logo type='white' />
          <p className="text-muted text-sm leading-relaxed">
            LegalEase combines cutting-edge AI with expert legal knowledge to make law accessible, fast, and affordable for everyone.
          </p>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Services</h4>
          <ul className="space-y-3 text-sm text-muted">
            {services.slice(0, 6).map((service) => (
              <li key={service.name} className="hover:text-green-400 transition">
                {service.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Company</h4>
          <ul className="space-y-3 text-sm text-muted">
            {companyLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="hover:text-green-400 transition">{link.name}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social + Newsletter */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
          <div className="flex space-x-4 mb-6 text-muted">
            {socialLinks.map((social) => (
              <a key={social.name} href="#" className="hover:text-green-400 transition">{social.icon}</a>
            ))}
          </div>

          <h4 className="font-semibold text-lg mb-4">Stay Updated</h4>
          <form className="flex items-center space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md text-black text-sm"
            />
            <Button type="submit" className="py-2 px-5 text-sm">
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-muted-foreground text-sm mt-16">
        © 2025 LegalEase. All rights reserved.
      </div>
    </footer>
  );
};

export default LandingPageFooter;
