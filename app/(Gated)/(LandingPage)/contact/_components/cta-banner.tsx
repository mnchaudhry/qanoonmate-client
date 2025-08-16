'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Calendar, 
  Zap, 
  Star,
  Users,
  TrendingUp
} from 'lucide-react';

export default function CTABanner() {
  const handleBookDemo = () => {
    // Handle demo booking
    console.log('Book demo clicked');
  };

  const handleExploreFeatures = () => {
    // Handle explore features
    console.log('Explore features clicked');
  };

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-success/5 relative overflow-hidden">
          <CardContent className="p-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            
            {/* Floating Elements */}
            <div className="absolute top-8 right-8 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <div className="absolute bottom-8 left-8 w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center animate-bounce">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>

            <div className="relative text-center">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Join 50,000+ Fitness Professionals
                  </span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
                  Ready to elevate your fitness business?
                </h2>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Take the next step towards transforming your fitness journey. 
                  Book a personalized demo or explore our comprehensive features.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button 
                  onClick={handleBookDemo}
                  size="lg" 
                  className="group min-w-[200px] h-12"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Demo
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                
                <Button 
                  onClick={handleExploreFeatures}
                  variant="outline" 
                  size="lg"
                  className="group min-w-[200px] h-12 bg-background/50 hover:bg-background"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Explore Features
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">15min</div>
                  <div className="text-sm text-muted-foreground">Demo Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-1">Free</div>
                  <div className="text-sm text-muted-foreground">No Cost Trial</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Support Access</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
