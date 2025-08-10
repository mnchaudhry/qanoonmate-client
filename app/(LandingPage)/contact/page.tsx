import { Metadata } from 'next';
import HeroSection from './_components/hero-section';
import ContactFormSection from './_components/contact-form-section';
import MapLocationSection from './_components/map-location-section';
import CTABanner from './_components/cta-banner';
import FAQSection from './_components/faq-section';

export const metadata: Metadata = {
  title: 'Contact Us | QanoonMate - Get Legal Help',
  description: 'Get in touch with QanoonMate. We\'re here to help you with legal queries, connect you with qualified lawyers, and provide AI-driven legal solutions. Contact us today!',
  keywords: 'contact QanoonMate, legal help Pakistan, lawyer consultation, legal advice, law platform, legal tech support',
  openGraph: {
    title: 'Contact Us | QanoonMate - Get Legal Help',
    description: 'Get in touch with QanoonMate. We\'re here to help you with legal queries, connect you with qualified lawyers, and provide AI-driven legal solutions.',
    type: 'website',
    url: 'https://qanoonmate.com/contact',
    images: [
      {
        url: '/Pictures/qanoonmate-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact QanoonMate - Legal Tech Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | QanoonMate - Get Legal Help',
    description: 'Get in touch with QanoonMate. We\'re here to help you with legal queries and connect you with qualified lawyers.',
    images: ['/Pictures/qanoonmate-twitter-image.jpg']
  }
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ContactFormSection />
      <MapLocationSection />
      <CTABanner />
      <FAQSection />
    </div>
  );
} 