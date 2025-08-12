'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Send, 
  MapPin, 
  Mail, 
  Phone, 
  Clock,
  CheckCircle,
  Building2
} from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  agreeToTerms: boolean;
}

export default function ContactFormSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    agreeToTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ContactFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Form submitted:', formData);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      agreeToTerms: false
    });
    
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: 'Address',
      value: 'Islamabad, Pakistan',
      subvalue: 'F-8 Markaz, Islamabad'
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'support@trainityhub.com',
      subvalue: 'hello@trainityhub.com'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+92-300-1234567',
      subvalue: '+92-51-1234567'
    },
    {
      icon: Clock,
      label: 'Hours',
      value: 'Mon–Fri: 9am–6pm PKT',
      subvalue: 'Weekend: 10am–4pm PKT'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Send Us a Message
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We&apos;re here to help you succeed. Reach out to us with any questions, 
            feedback, or partnership opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Contact Form (2/3 width) */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Your full name"
                        className="h-12 border-0 bg-muted/50 focus:bg-background transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                        className="h-12 border-0 bg-muted/50 focus:bg-background transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-semibold">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="What is this about?"
                      className="h-12 border-0 bg-muted/50 focus:bg-background transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us more about your inquiry..."
                      rows={8}
                      className="border-0 bg-muted/50 focus:bg-background transition-colors resize-none"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground">
                      I agree to the{' '}
                      <a href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={!formData.agreeToTerms || isSubmitting}
                    className="w-full sm:w-auto h-12 px-8 group"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Info (1/3 width) */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Contact Information
                  </h3>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            {info.label}
                          </div>
                          <div className="text-sm font-semibold text-foreground mb-1">
                            {info.value}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {info.subvalue}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Response Promise */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Quick Response
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <span className="text-xs text-muted-foreground">General inquiries: 2-4 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full" />
                    <span className="text-xs text-muted-foreground">Technical support: 4-8 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-xs text-muted-foreground">Partnership requests: 1-2 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
