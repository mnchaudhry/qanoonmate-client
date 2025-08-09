import { Metadata } from 'next';
import HeroSection from './_components/hero-section';
import ContactFormSection from './_components/contact-form-section';
import MapLocationSection from './_components/map-location-section';
import CTABanner from './_components/cta-banner';
import FAQSection from './_components/faq-section';

export const metadata: Metadata = {
  title: 'Contact Us | TrainityHub - Get in Touch',
  description: 'Get in touch with TrainityHub. We\'re here to help you with any questions about our fitness platform, partnerships, or technical support. Contact us today!',
  keywords: 'contact TrainityHub, fitness platform support, gym management help, customer service, technical support, partnership inquiries',
  openGraph: {
    title: 'Contact Us | TrainityHub - Get in Touch',
    description: 'Get in touch with TrainityHub. We\'re here to help you with any questions about our fitness platform, partnerships, or technical support.',
    type: 'website',
    url: 'https://trainityhub.com/contact',
    images: [
      {
        url: '/images/contact-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact TrainityHub'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | TrainityHub - Get in Touch',
    description: 'Get in touch with TrainityHub. We\'re here to help you with any questions about our fitness platform.',
    images: ['/images/contact-twitter-image.jpg']
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