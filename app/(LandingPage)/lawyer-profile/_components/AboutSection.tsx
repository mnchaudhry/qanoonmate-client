import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Globe, DollarSign, Monitor, MapPin } from 'lucide-react';

interface LawyerData {
  biography: string;
  languages: string[];
  consultationFee: number;
  preferredMode: string[];
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
}

interface Props {
  lawyer: LawyerData;
}

const AboutSection = ({ lawyer }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Biography */}
      <div className="lg:col-span-2">
        <Card className="border-primary-200">
          <CardHeader>
            <CardTitle className="text-xl text-primary-900">Biography</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-700 leading-relaxed text-base">
              {lawyer.biography}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Details and Map */}
      <div className="space-y-6">
        {/* Professional Details */}
        <Card className="border-primary-200">
          <CardHeader>
            <CardTitle className="text-lg text-primary-900">Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Languages */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-secondary-600" />
                <span className="text-sm font-medium text-secondary-700">Languages:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {lawyer.languages.map((lang, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="border-secondary-200 text-secondary-700"
                  >
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Consultation Fee */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-secondary-600" />
                <span className="text-sm font-medium text-secondary-700">Consultation Fee:</span>
              </div>
              <p className="text-lg font-semibold text-primary-900">
                Rs. {lawyer.consultationFee.toLocaleString()} / session
              </p>
            </div>

            <Separator />

            {/* Preferred Mode */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-4 h-4 text-secondary-600" />
                <span className="text-sm font-medium text-secondary-700">Preferred Mode:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {lawyer.preferredMode.map((mode, index) => (
                  <Badge 
                    key={index} 
                    className="bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100"
                  >
                    {mode}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Map */}
        <Card className="border-primary-200">
          <CardHeader>
            <CardTitle className="text-lg text-primary-900">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-secondary-600 mt-0.5" />
                <p className="text-sm text-secondary-700">
                  {lawyer.location.address}
                </p>
              </div>
              
              {/* Map Container */}
              <div className="w-full h-48 bg-secondary-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-secondary-400 mx-auto mb-2" />
                  <p className="text-sm text-secondary-600">Interactive Map</p>
                  <p className="text-xs text-secondary-500">Google Maps integration</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutSection;