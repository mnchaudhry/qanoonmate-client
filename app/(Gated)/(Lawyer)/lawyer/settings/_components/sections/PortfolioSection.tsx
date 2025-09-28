"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Award, Plus, Trash2, Save, FileText, Star, Users, Calendar } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SubsectionHeader } from "./SubsectionHeader";
import { LawyerProfile, ProfileCompletionData } from "@/lib/types/profile.types";

interface PortfolioSectionProps {
  profile: LawyerProfile;
  completion: ProfileCompletionData;
  onUpdate: (updatedProfile: Partial<LawyerProfile>) => void;
}

interface NotableCase {
  id: string;
  title: string;
  description: string;
  outcome: string;
  year: number;
  category: string;
}

interface Publication {
  id: string;
  title: string;
  journal: string;
  year: number;
  url?: string;
}

interface AwardItem {
  id: string;
  title: string;
  organization: string;
  year: number;
  description: string;
}

export function PortfolioSection({ }: PortfolioSectionProps) {
  const [notableCases, setNotableCases] = useState<NotableCase[]>([
    {
      id: '1',
      title: 'Landmark Property Dispute Resolution',
      description: 'Successfully resolved a complex property dispute involving multiple parties and inheritance claims.',
      outcome: 'Favorable settlement for client',
      year: 2023,
      category: 'Property Law'
    }
  ]);

  const [publications, setPublications] = useState<Publication[]>([
    {
      id: '1',
      title: 'Modern Approaches to Contract Law in Pakistan',
      journal: 'Pakistan Law Review',
      year: 2023,
      url: 'https://example.com'
    }
  ]);

  const [awards, setAwards] = useState<AwardItem[]>([
    {
      id: '1',
      title: 'Excellence in Legal Practice',
      organization: 'Pakistan Bar Council',
      year: 2023,
      description: 'Recognized for outstanding contribution to legal practice'
    }
  ]);

  const [newCase, setNewCase] = useState<Partial<NotableCase>>({});
  const [newPublication, setNewPublication] = useState<Partial<Publication>>({});
  const [newAward, setNewAward] = useState<Partial<AwardItem>>({});
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement portfolio update
      console.log('Portfolio updated:', { notableCases, publications, awards });
      
    } catch (error) {
      console.error('Error saving portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNotableCase = () => {
    if (newCase.title && newCase.description && newCase.outcome && newCase.year && newCase.category) {
      const caseItem: NotableCase = {
        id: Date.now().toString(),
        title: newCase.title,
        description: newCase.description,
        outcome: newCase.outcome,
        year: newCase.year,
        category: newCase.category
      };
      setNotableCases(prev => [...prev, caseItem]);
      setNewCase({});
    }
  };

  const addPublication = () => {
    if (newPublication.title && newPublication.journal && newPublication.year) {
      const publication: Publication = {
        id: Date.now().toString(),
        title: newPublication.title,
        journal: newPublication.journal,
        year: newPublication.year,
        url: newPublication.url
      };
      setPublications(prev => [...prev, publication]);
      setNewPublication({});
    }
  };

  const addAward = () => {
    if (newAward.title && newAward.organization && newAward.year && newAward.description) {
      const award: AwardItem = {
        id: Date.now().toString(),
        title: newAward.title,
        organization: newAward.organization,
        year: newAward.year,
        description: newAward.description
      };
      setAwards(prev => [...prev, award]);
      setNewAward({});
    }
  };

  const removeNotableCase = (id: string) => {
    setNotableCases(prev => prev.filter(caseItem => caseItem.id !== id));
  };

  const removePublication = (id: string) => {
    setPublications(prev => prev.filter(pub => pub.id !== id));
  };

  const removeAward = (id: string) => {
    setAwards(prev => prev.filter(award => award.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <SectionHeader
          title="Portfolio & Achievements"
          description="Showcase your notable cases, publications, awards, and client testimonials"
          icon={<Award className="w-4 h-4 text-primary" />}
          action={{
            label: "Save Changes",
            onClick: handleSave,
            variant: "default"
          }}
        />
        <CardContent className="space-y-4">
          {/* Notable Cases */}
          <div className="space-y-2">
            <SubsectionHeader title="Notable Cases" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                {notableCases.map((caseItem) => (
                  <div key={caseItem.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{caseItem.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{caseItem.category}</Badge>
                            <span className="text-sm text-muted-foreground">{caseItem.year}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNotableCase(caseItem.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{caseItem.description}</p>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium text-foreground">Outcome: {caseItem.outcome}</span>
                    </div>
                  </div>
                ))}

                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-4">Add Notable Case</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Case Title</Label>
                        <Input
                          value={newCase.title || ''}
                          onChange={(e) => setNewCase(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter case title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Input
                          value={newCase.category || ''}
                          onChange={(e) => setNewCase(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="e.g., Property Law"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newCase.description || ''}
                        onChange={(e) => setNewCase(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the case details"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Outcome</Label>
                        <Input
                          value={newCase.outcome || ''}
                          onChange={(e) => setNewCase(prev => ({ ...prev, outcome: e.target.value }))}
                          placeholder="e.g., Favorable settlement"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Input
                          type="number"
                          value={newCase.year || ''}
                          onChange={(e) => setNewCase(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                          placeholder="2023"
                        />
                      </div>
                    </div>
                    <Button onClick={addNotableCase} size="sm" className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Case
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Publications */}
          <div className="space-y-2">
            <SubsectionHeader title="Publications" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                {publications.map((publication) => (
                  <div key={publication.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{publication.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground">{publication.journal}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{publication.year}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePublication(publication.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {publication.url && (
                      <a 
                        href={publication.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        View Publication →
                      </a>
                    )}
                  </div>
                ))}

                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-4">Add Publication</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Publication Title</Label>
                      <Input
                        value={newPublication.title || ''}
                        onChange={(e) => setNewPublication(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter publication title"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Journal/Publisher</Label>
                        <Input
                          value={newPublication.journal || ''}
                          onChange={(e) => setNewPublication(prev => ({ ...prev, journal: e.target.value }))}
                          placeholder="Enter journal name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Input
                          type="number"
                          value={newPublication.year || ''}
                          onChange={(e) => setNewPublication(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                          placeholder="2023"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>URL (Optional)</Label>
                      <Input
                        value={newPublication.url || ''}
                        onChange={(e) => setNewPublication(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com"
                      />
                    </div>
                    <Button onClick={addPublication} size="sm" className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Publication
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Awards */}
          <div className="space-y-2">
            <SubsectionHeader title="Awards & Recognition" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                {awards.map((award) => (
                  <div key={award.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{award.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground">{award.organization}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{award.year}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAward(award.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{award.description}</p>
                  </div>
                ))}

                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-4">Add Award</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Award Title</Label>
                        <Input
                          value={newAward.title || ''}
                          onChange={(e) => setNewAward(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter award title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Organization</Label>
                        <Input
                          value={newAward.organization || ''}
                          onChange={(e) => setNewAward(prev => ({ ...prev, organization: e.target.value }))}
                          placeholder="Enter organization name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newAward.description || ''}
                        onChange={(e) => setNewAward(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the award"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Input
                        type="number"
                        value={newAward.year || ''}
                        onChange={(e) => setNewAward(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                        placeholder="2023"
                      />
                    </div>
                    <Button onClick={addAward} size="sm" className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Award
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Tips */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-primary mb-2">🏆 Portfolio Tips</h4>
            <ul className="text-sm text-primary/80 space-y-1">
              <li>• Highlight your most significant cases and achievements</li>
              <li>• Include publications that demonstrate your expertise</li>
              <li>• Showcase awards and recognition from professional bodies</li>
              <li>• Keep your portfolio updated with recent accomplishments</li>
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
