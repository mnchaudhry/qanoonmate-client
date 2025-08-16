'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Users } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Left Column - 60% width */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <span className="text-primary font-medium">Get in Touch</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Let&apos;s Connect
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              Have a question or want to partner with us? Fill the form and we&apos;ll 
              get back to you within 24 hours. We&apos;re here to help you succeed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="group">
                Start Conversation
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg">
                Book a Demo
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t !border-border/50">
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-primary mb-1">24h</div>
                <div className="text-sm text-muted-foreground">Response Time</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-accent mb-1">99%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
              <div className="text-center sm:text-left col-span-2 sm:col-span-1">
                <div className="text-2xl font-bold text-success mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Support Available</div>
              </div>
            </div>
          </div>

          {/* Right Column - 40% width */}
          <div className="lg:col-span-2 relative">
            <div className="relative">
              {/* 3D-style illustration placeholder */}
              <div className="aspect-square bg-gradient-to-br from-primary/10 via-accent/10 to-success/10 rounded-2xl p-8 shadow-2xl">
                <div className="h-full w-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                      <Users className="h-12 w-12 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-lg font-semibold text-foreground">
                        Connect with Us
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Join thousands of fitness professionals
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center animate-bounce">
                <ArrowRight className="h-6 w-6 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
