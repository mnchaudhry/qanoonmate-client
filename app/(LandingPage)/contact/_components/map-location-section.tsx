'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  ExternalLink, 
  Navigation, 
  Phone,
  Clock,
  Building2
} from 'lucide-react';

export default function MapLocationSection() {
  const handleGetDirections = () => {
    // Open Google Maps with directions
    const address = encodeURIComponent("Islamabad, Pakistan");
    const url = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
    window.open(url, '_blank');
  };

  const handleViewOnMap = () => {
    // Open Google Maps with location
    const address = encodeURIComponent("Islamabad, Pakistan");
    const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    window.open(url, '_blank');
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Find Us Here
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Located in the heart of Islamabad, we&apos;re easily accessible and ready to meet with you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  {/* Map Placeholder */}
                  <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 via-accent/10 to-muted/20 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                        <MapPin className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          TrainityHub Office
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Islamabad, Pakistan
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Map Overlay */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button 
                      onClick={handleViewOnMap}
                      size="lg"
                      className="bg-background/90 text-foreground hover:bg-background shadow-lg"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Google Maps
                    </Button>
                  </div>

                  {/* Location Pin */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <MapPin className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Details */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Office Location
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        F-8 Markaz, Islamabad
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Capital Territory, Pakistan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        +92-300-1234567
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Primary contact
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Mon-Fri: 9:00 AM - 6:00 PM
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Pakistan Standard Time (PKT)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t !border-border">
                  <Button 
                    onClick={handleGetDirections}
                    className="w-full group"
                    size="lg"
                  >
                    <Navigation className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-accent/5 to-success/5">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Visit Us
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <span className="text-sm text-muted-foreground">
                      Free parking available
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm text-muted-foreground">
                      Wheelchair accessible
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-sm text-muted-foreground">
                      Meeting rooms available
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full" />
                    <span className="text-sm text-muted-foreground">
                      Please schedule in advance
                    </span>
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
