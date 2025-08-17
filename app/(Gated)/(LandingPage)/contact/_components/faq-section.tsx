'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'support' | 'onboarding' | 'billing' | 'technical';
}

export default function FAQSection() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How fast do you reply to support requests?',
      answer: 'We typically respond to all support requests within 24 hours during business days (Monday-Friday, 9 AM - 6 PM PKT). For urgent technical issues, our response time is usually 2-4 hours. Premium support customers get priority response within 1 hour.',
      category: 'support'
    },
    {
      id: '2',
      question: 'Do you provide onboarding help for new users?',
      answer: 'Yes! We offer comprehensive onboarding support including personalized demo sessions, step-by-step setup guides, training materials, and dedicated onboarding specialists. New users get 30 days of free premium support to ensure smooth platform adoption.',
      category: 'onboarding'
    },
    {
      id: '3',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Absolutely. You can cancel your subscription at any time without any cancellation fees. Your account will remain active until the end of your current billing period. All your data is safely stored and can be exported before cancellation.',
      category: 'billing'
    },
    {
      id: '4',
      question: 'What integrations do you support?',
      answer: 'We support integrations with popular fitness apps, payment processors (Stripe, PayPal), calendar systems (Google Calendar, Outlook), marketing tools (Mailchimp, Klaviyo), and accounting software (QuickBooks, Xero). Our API allows custom integrations as well.',
      category: 'technical'
    },
    {
      id: '5',
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a 14-day free trial with full access to all features. No credit card required to start. You can explore all functionalities, add team members, and set up your gym operations during the trial period.',
      category: 'billing'
    },
    {
      id: '6',
      question: 'How secure is my data?',
      answer: 'We take data security very seriously. Our platform uses enterprise-grade encryption, secure cloud infrastructure, regular security audits, and compliance with international data protection standards. All data is backed up daily and stored in multiple secure locations.',
      category: 'technical'
    },
    {
      id: '7',
      question: 'Can I import my existing member data?',
      answer: 'Yes, we provide data import tools and services to help you migrate from other gym management systems. Our team can assist with data mapping, cleaning, and import to ensure a smooth transition without losing any member information.',
      category: 'onboarding'
    },
    {
      id: '8',
      question: 'What training resources are available?',
      answer: 'We offer extensive training resources including video tutorials, written guides, webinars, and live training sessions. Our knowledge base contains step-by-step instructions for all features, and our support team is always ready to help with specific questions.',
      category: 'support'
    }
  ];

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our platform, support, and services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground pr-4">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>
                
                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-4 border-t !border-border/50">
                    <p className="text-muted-foreground pt-4 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-6">
                Our support team is here to help. Get personalized assistance for your specific needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:support@trainityhub.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Email Support
                </a>
                <a 
                  href="tel:+92-300-1234567"
                  className="inline-flex items-center justify-center px-6 py-3 border !border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  Call Us
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
