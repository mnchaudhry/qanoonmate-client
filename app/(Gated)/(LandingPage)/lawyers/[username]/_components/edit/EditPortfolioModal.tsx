"use client";

import { useState, useEffect } from "react";
import { EditModal } from "./EditModal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditModal } from "./EditModalContext";
import { X, Plus, FileText, BookOpen, Trophy, Award } from "lucide-react";

interface EditPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotableCase {
  title: string;
  description: string;
  outcome: string;
  year: number;
  anonymized: boolean;
}

interface Publication {
  title: string;
  type: string;
  publisher?: string;
  year: number;
}

interface Award {
  title: string;
  organization: string;
  year: number;
  description?: string;
}

interface CaseStudy {
  title: string;
  challenge: string;
  solution: string;
  outcome: string;
  anonymized: boolean;
}

export function EditPortfolioModal({ isOpen, onClose }: EditPortfolioModalProps) {
  const { lawyer } = useEditModal();
  const [formData, setFormData] = useState({
    notableCases: [] as NotableCase[],
    publications: [] as Publication[],
    awards: [] as Award[],
    caseStudies: [] as CaseStudy[],
  });

  const [newCase, setNewCase] = useState({
    title: "",
    description: "",
    outcome: "",
    year: new Date().getFullYear(),
    anonymized: false,
  });

  const [newPublication, setNewPublication] = useState({
    title: "",
    type: "",
    publisher: "",
    year: new Date().getFullYear(),
  });

  const [newAward, setNewAward] = useState({
    title: "",
    organization: "",
    year: new Date().getFullYear(),
    description: "",
  });

  const [newCaseStudy, setNewCaseStudy] = useState({
    title: "",
    challenge: "",
    solution: "",
    outcome: "",
    anonymized: false,
  });

  const publicationTypes = [
    "Journal Article",
    "Book",
    "Book Chapter",
    "Conference Paper",
    "Blog Post",
    "Legal Brief",
    "Research Paper"
  ];

  useEffect(() => {
    if (lawyer) {
      setFormData({
        notableCases: [], // This field doesn't exist in Lawyer type yet
        publications: [], // This field doesn't exist in Lawyer type yet
        awards: [], // This field doesn't exist in Lawyer type yet
        caseStudies: [], // This field doesn't exist in Lawyer type yet
      });
    }
  }, [lawyer]);

  const addNotableCase = () => {
    if (newCase.title && newCase.description && newCase.outcome && newCase.year) {
      setFormData(prev => ({
        ...prev,
        notableCases: [...prev.notableCases, { ...newCase }]
      }));
      setNewCase({ title: "", description: "", outcome: "", year: new Date().getFullYear(), anonymized: false });
    }
  };

  const removeNotableCase = (index: number) => {
    setFormData(prev => ({
      ...prev,
      notableCases: prev.notableCases.filter((_, i) => i !== index)
    }));
  };

  const addPublication = () => {
    if (newPublication.title && newPublication.type && newPublication.year) {
      setFormData(prev => ({
        ...prev,
        publications: [...prev.publications, { ...newPublication }]
      }));
      setNewPublication({ title: "", type: "", publisher: "", year: new Date().getFullYear() });
    }
  };

  const removePublication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      publications: prev.publications.filter((_, i) => i !== index)
    }));
  };

  const addAward = () => {
    if (newAward.title && newAward.organization && newAward.year) {
      setFormData(prev => ({
        ...prev,
        awards: [...prev.awards, { ...newAward }]
      }));
      setNewAward({ title: "", organization: "", year: new Date().getFullYear(), description: "" });
    }
  };

  const removeAward = (index: number) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
    }));
  };

  const addCaseStudy = () => {
    if (newCaseStudy.title && newCaseStudy.challenge && newCaseStudy.solution && newCaseStudy.outcome) {
      setFormData(prev => ({
        ...prev,
        caseStudies: [...prev.caseStudies, { ...newCaseStudy }]
      }));
      setNewCaseStudy({ title: "", challenge: "", solution: "", outcome: "", anonymized: false });
    }
  };

  const removeCaseStudy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      caseStudies: prev.caseStudies.filter((_, i) => i !== index)
    }));
  };

  const { updateProfile } = useEditModal();

  const handleSave = async () => {
    if (!lawyer) return;

    try {
      // Note: Portfolio data doesn't exist in the Lawyer type yet
      // This would need to be added to the backend Lawyer model
      // For now, we'll store it in a custom field or handle it separately
      await updateProfile({
        // This would need to be implemented when portfolio fields are added to Lawyer type
        // portfolio: {
        //   notableCases: formData.notableCases,
        //   publications: formData.publications,
        //   awards: formData.awards,
        //   caseStudies: formData.caseStudies,
        // }
      });
      
      console.log("Portfolio data ready for backend implementation:", formData);
    } catch (error) {
      console.error("Failed to save portfolio data:", error);
      throw error;
    }
  };

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Portfolio & Achievements"
      onSave={handleSave}
      maxWidth="6xl"
    >
      <div className="space-y-6">
        {/* Notable Cases */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notable Cases
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="case-title">Case Title</Label>
                <Input
                  id="case-title"
                  value={newCase.title}
                  onChange={(e) => setNewCase(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Landmark Property Dispute Resolution"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="case-year">Year</Label>
                <Input
                  id="case-year"
                  type="number"
                  value={newCase.year}
                  onChange={(e) => setNewCase(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                  placeholder="e.g., 2023"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="case-outcome">Outcome</Label>
                <Input
                  id="case-outcome"
                  value={newCase.outcome}
                  onChange={(e) => setNewCase(prev => ({ ...prev, outcome: e.target.value }))}
                  placeholder="e.g., Favorable settlement for client"
                />
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="case-anonymized"
                    checked={newCase.anonymized}
                    onChange={(e) => setNewCase(prev => ({ ...prev, anonymized: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="case-anonymized" className="text-sm">Anonymized</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="case-description">Description</Label>
              <Textarea
                id="case-description"
                value={newCase.description}
                onChange={(e) => setNewCase(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the case details and your role..."
                rows={3}
              />
            </div>
            <Button onClick={addNotableCase} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Notable Case
            </Button>

            {formData.notableCases.length > 0 && (
              <div className="space-y-2">
                <Label>Notable Cases</Label>
                <div className="space-y-2">
                  {formData.notableCases.map((case_, index) => (
                    <div key={index} className="flex items-start justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{case_.title}</div>
                        <div className="text-xs text-muted-foreground mb-1">{case_.description}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{case_.outcome}</Badge>
                          <Badge variant="outline" className="text-xs">{case_.year}</Badge>
                          {case_.anonymized && <Badge variant="outline" className="text-xs">Anonymized</Badge>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeNotableCase(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Publications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Publications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="pub-title">Title</Label>
                <Input
                  id="pub-title"
                  value={newPublication.title}
                  onChange={(e) => setNewPublication(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Modern Approaches to Contract Law"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pub-type">Type</Label>
                <Select value={newPublication.type} onValueChange={(value) => setNewPublication(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {publicationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pub-publisher">Publisher</Label>
                <Input
                  id="pub-publisher"
                  value={newPublication.publisher}
                  onChange={(e) => setNewPublication(prev => ({ ...prev, publisher: e.target.value }))}
                  placeholder="e.g., Legal Journal of Pakistan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pub-year">Year</Label>
                <Input
                  id="pub-year"
                  type="number"
                  value={newPublication.year}
                  onChange={(e) => setNewPublication(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                  placeholder="e.g., 2023"
                />
              </div>
            </div>
            <Button onClick={addPublication} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Publication
            </Button>

            {formData.publications.length > 0 && (
              <div className="space-y-2">
                <Label>Publications</Label>
                <div className="space-y-2">
                  {formData.publications.map((pub, index) => (
                    <div key={index} className="flex items-start justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{pub.title}</div>
                        <div className="text-xs text-muted-foreground">{pub.type} • {pub.year}</div>
                        {pub.publisher && <div className="text-xs text-muted-foreground">{pub.publisher}</div>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removePublication(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Awards */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Awards & Recognition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="award-title">Award Title</Label>
                <Input
                  id="award-title"
                  value={newAward.title}
                  onChange={(e) => setNewAward(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Best Young Lawyer Award"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="award-organization">Organization</Label>
                <Input
                  id="award-organization"
                  value={newAward.organization}
                  onChange={(e) => setNewAward(prev => ({ ...prev, organization: e.target.value }))}
                  placeholder="e.g., Pakistan Bar Council"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="award-year">Year</Label>
                <Input
                  id="award-year"
                  type="number"
                  value={newAward.year}
                  onChange={(e) => setNewAward(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                  placeholder="e.g., 2023"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="award-description">Description</Label>
                <Input
                  id="award-description"
                  value={newAward.description}
                  onChange={(e) => setNewAward(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Recognition for excellence in criminal law"
                />
              </div>
            </div>
            <Button onClick={addAward} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Award
            </Button>

            {formData.awards.length > 0 && (
              <div className="space-y-2">
                <Label>Awards & Recognition</Label>
                <div className="space-y-2">
                  {formData.awards.map((award, index) => (
                    <div key={index} className="flex items-start justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{award.title}</div>
                        <div className="text-xs text-muted-foreground">{award.organization} • {award.year}</div>
                        {award.description && <div className="text-xs text-muted-foreground">{award.description}</div>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeAward(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Case Studies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Award className="w-4 h-4" />
              Case Studies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="study-title">Title</Label>
                <Input
                  id="study-title"
                  value={newCaseStudy.title}
                  onChange={(e) => setNewCaseStudy(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Complex Corporate Merger"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="study-challenge">Challenge</Label>
                <Textarea
                  id="study-challenge"
                  value={newCaseStudy.challenge}
                  onChange={(e) => setNewCaseStudy(prev => ({ ...prev, challenge: e.target.value }))}
                  placeholder="Describe the challenge faced..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="study-solution">Solution</Label>
                <Textarea
                  id="study-solution"
                  value={newCaseStudy.solution}
                  onChange={(e) => setNewCaseStudy(prev => ({ ...prev, solution: e.target.value }))}
                  placeholder="Describe the solution implemented..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="study-outcome">Outcome</Label>
                <Textarea
                  id="study-outcome"
                  value={newCaseStudy.outcome}
                  onChange={(e) => setNewCaseStudy(prev => ({ ...prev, outcome: e.target.value }))}
                  placeholder="Describe the final outcome..."
                  rows={2}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="study-anonymized"
                  checked={newCaseStudy.anonymized}
                  onChange={(e) => setNewCaseStudy(prev => ({ ...prev, anonymized: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="study-anonymized" className="text-sm">Anonymized</Label>
              </div>
            </div>
            <Button onClick={addCaseStudy} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Case Study
            </Button>

            {formData.caseStudies.length > 0 && (
              <div className="space-y-2">
                <Label>Case Studies</Label>
                <div className="space-y-2">
                  {formData.caseStudies.map((study, index) => (
                    <div key={index} className="flex items-start justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{study.title}</div>
                        <div className="text-xs text-muted-foreground space-y-1 mt-1">
                          <div><strong>Challenge:</strong> {study.challenge}</div>
                          <div><strong>Solution:</strong> {study.solution}</div>
                          <div><strong>Outcome:</strong> {study.outcome}</div>
                        </div>
                        {study.anonymized && <Badge variant="outline" className="text-xs mt-1">Anonymized</Badge>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeCaseStudy(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EditModal>
  );
}
