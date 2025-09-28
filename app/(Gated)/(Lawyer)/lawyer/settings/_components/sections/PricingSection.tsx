"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Plus, Trash2, Save, Clock, Users, MessageSquare, Video, Phone } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SubsectionHeader } from "./SubsectionHeader";
import { LawyerProfile, ProfileCompletionData } from "@/lib/types/profile.types";

interface PricingSectionProps {
  profile: LawyerProfile;
  completion: ProfileCompletionData;
  onUpdate: (updatedProfile: Partial<LawyerProfile>) => void;
}

interface PricingPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  features: string[];
  isPopular: boolean;
  consultationMode: string;
}

const CONSULTATION_MODES = [
  { value: 'video', label: 'Video Call', icon: Video },
  { value: 'phone', label: 'Phone Call', icon: Phone },
  { value: 'in-person', label: 'In-Person', icon: Users },
  { value: 'chat', label: 'Chat', icon: MessageSquare },
];

const DURATION_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

export function PricingSection({ }: PricingSectionProps) {
  const [packages, setPackages] = useState<PricingPackage[]>([
    {
      id: '1',
      name: 'Initial Consultation',
      description: 'First-time consultation to understand your case',
      price: 5000,
      currency: 'PKR',
      duration: 60,
      features: ['Case analysis', 'Legal advice', 'Next steps guidance'],
      isPopular: true,
      consultationMode: 'video'
    },
    {
      id: '2',
      name: 'Quick Legal Question',
      description: 'Brief consultation for simple legal questions',
      price: 2500,
      currency: 'PKR',
      duration: 30,
      features: ['Quick advice', 'Basic guidance'],
      isPopular: false,
      consultationMode: 'phone'
    }
  ]);

  const [newPackage, setNewPackage] = useState<Partial<PricingPackage>>({
    currency: 'PKR',
    duration: 60,
    consultationMode: 'video',
    features: [],
    isPopular: false
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement pricing update
      console.log('Pricing updated:', packages);
      
    } catch (error) {
      console.error('Error saving pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPackage = () => {
    if (newPackage.name && newPackage.description && newPackage.price && newPackage.duration) {
      const packageItem: PricingPackage = {
        id: Date.now().toString(),
        name: newPackage.name,
        description: newPackage.description,
        price: newPackage.price,
        currency: newPackage.currency || 'PKR',
        duration: newPackage.duration,
        features: newPackage.features || [],
        isPopular: newPackage.isPopular || false,
        consultationMode: newPackage.consultationMode || 'video'
      };
      setPackages(prev => [...prev, packageItem]);
      setNewPackage({
        currency: 'PKR',
        duration: 60,
        consultationMode: 'video',
        features: [],
        isPopular: false
      });
    }
  };

  const removePackage = (id: string) => {
    setPackages(prev => prev.filter(pkg => pkg.id !== id));
  };

  const togglePopular = (id: string) => {
    setPackages(prev => prev.map(pkg => ({
      ...pkg,
      isPopular: pkg.id === id ? !pkg.isPopular : false // Only one can be popular
    })));
  };

  const addFeature = () => {
    const feature = prompt('Enter feature:');
    if (feature) {
      setNewPackage(prev => ({
        ...prev,
        features: [...(prev.features || []), feature]
      }));
    }
  };

  const removeFeature = (index: number) => {
    setNewPackage(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  const getModeIcon = (mode: string) => {
    const modeConfig = CONSULTATION_MODES.find(m => m.value === mode);
    return modeConfig ? modeConfig.icon : Video;
  };

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <SectionHeader
          title="Pricing & Packages"
          description="Set your consultation fees and create service packages"
          icon={<DollarSign className="w-4 h-4 text-primary" />}
          action={{
            label: "Save Changes",
            onClick: handleSave,
            variant: "default"
          }}
        />
        <CardContent className="space-y-4">
          {/* Current Packages */}
          <div className="space-y-2">
            <SubsectionHeader title="Current Packages" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages.map((packageItem) => {
                  const ModeIcon = getModeIcon(packageItem.consultationMode);
                  return (
                    <div key={packageItem.id} className={`p-4 border-2 rounded-lg relative ${packageItem.isPopular ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      {packageItem.isPopular && (
                        <Badge className="absolute -top-2 left-4 bg-primary text-primary-foreground">
                          Popular
                        </Badge>
                      )}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <ModeIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{packageItem.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{packageItem.duration} min</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePopular(packageItem.id)}
                          >
                            {packageItem.isPopular ? '⭐' : '☆'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePackage(packageItem.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{packageItem.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-foreground">
                          {packageItem.currency} {packageItem.price.toLocaleString()}
                        </span>
                        <Badge variant="outline" className="capitalize">
                          {packageItem.consultationMode.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {packageItem.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Add New Package */}
          <div className="space-y-2">
            <SubsectionHeader title="Add New Package" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Package Name</Label>
                    <Input
                      value={newPackage.name || ''}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Initial Consultation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={newPackage.price || ''}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                      placeholder="5000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newPackage.description || ''}
                    onChange={(e) => setNewPackage(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this package includes"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={newPackage.currency} onValueChange={(value) => setNewPackage(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PKR">PKR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Select value={newPackage.duration?.toString()} onValueChange={(value) => setNewPackage(prev => ({ ...prev, duration: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATION_OPTIONS.map(duration => (
                          <SelectItem key={duration.value} value={duration.value.toString()}>
                            {duration.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Consultation Mode</Label>
                    <Select value={newPackage.consultationMode} onValueChange={(value) => setNewPackage(prev => ({ ...prev, consultationMode: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONSULTATION_MODES.map(mode => (
                          <SelectItem key={mode.value} value={mode.value}>
                            {mode.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Features</Label>
                  <div className="space-y-2">
                    {newPackage.features?.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span className="text-sm text-foreground flex-1">{feature}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(index)}
                          className="text-destructive hover:text-destructive h-6 w-6 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addFeature}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={newPackage.isPopular || false}
                      onCheckedChange={(checked) => setNewPackage(prev => ({ ...prev, isPopular: checked }))}
                    />
                    <Label>Mark as Popular</Label>
                  </div>
                  <Button onClick={addPackage} size="sm" className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Package
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Tips */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-primary mb-2">💰 Pricing Tips</h4>
            <ul className="text-sm text-primary/80 space-y-1">
              <li>• Research market rates for similar services in your area</li>
              <li>• Consider your experience level and specialization</li>
              <li>• Offer different packages for different client needs</li>
              <li>• Be transparent about what each package includes</li>
            </ul>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={loading}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
