"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Upload, Eye, EyeOff, Save, FileText, AlertTriangle } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SubsectionHeader } from "./SubsectionHeader";
import { LawyerProfile, ProfileCompletionData } from "@/lib/types/profile.types";

interface VerificationSectionProps {
  profile: LawyerProfile;
  completion: ProfileCompletionData;
  onUpdate: (updatedProfile: Partial<LawyerProfile>) => void;
}

const VERIFICATION_DOCUMENTS = [
  {
    id: 'identity',
    name: 'Identity Document',
    description: 'CNIC, Passport, or Driver\'s License',
    required: true,
    status: 'verified',
    uploadedAt: '2024-01-15',
  },
  {
    id: 'barCard',
    name: 'Bar Council Card',
    description: 'Valid bar council registration card',
    required: true,
    status: 'pending',
    uploadedAt: null,
  },
  {
    id: 'education',
    name: 'Educational Certificates',
    description: 'Law degree and other relevant certificates',
    required: false,
    status: 'not_uploaded',
    uploadedAt: null,
  },
  {
    id: 'address',
    name: 'Address Proof',
    description: 'Utility bill or bank statement',
    required: false,
    status: 'not_uploaded',
    uploadedAt: null,
  },
];

export function VerificationSection({ }: VerificationSectionProps) {
  const [documents] = useState(VERIFICATION_DOCUMENTS);
  const [loading, setLoading] = useState(false);
  const [showCnic, setShowCnic] = useState(false);

  const [form, setForm] = useState({
    cnic: '',
    barCouncilNumber: '',
    licenseNumber: '',
    licenseExpiry: '',
  });

  const setField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement verification details update
      console.log('Verification details updated:', form);
      
    } catch (error) {
      console.error('Error saving verification details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = (documentId: string) => {
    // TODO: Implement document upload
    console.log('Upload document:', documentId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-amber-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-amber-600 bg-amber-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-muted-foreground bg-muted/50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'pending': return 'Under Review';
      case 'rejected': return 'Rejected';
      case 'not_uploaded': return 'Not Uploaded';
      default: return 'Unknown';
    }
  };

  const getVerificationProgress = () => {
    const requiredDocs = documents.filter(doc => doc.required);
    const verifiedDocs = requiredDocs.filter(doc => doc.status === 'verified');
    return Math.round((verifiedDocs.length / requiredDocs.length) * 100);
  };

  const verificationProgress = getVerificationProgress();

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <SectionHeader
          title="Identity Verification"
          description="Complete your identity verification and upload required documents"
          icon={<CheckCircle className="w-4 h-4 text-primary" />}
          action={{
            label: "Save Changes",
            onClick: handleSave,
            variant: "default"
          }}
        />
        <CardContent className="space-y-4">
          {/* Verification Status */}
          <div className="space-y-2">
            <SubsectionHeader title="Verification Status" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className={`w-5 h-5 ${verificationProgress === 100 ? 'text-green-600' : 'text-amber-600'}`} />
                  <div>
                    <h4 className="font-medium text-foreground">
                      {verificationProgress === 100 ? 'Fully Verified' : 'Verification In Progress'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {verificationProgress}% Complete
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={verificationProgress === 100 ? 'text-green-600' : 'text-amber-600'}>
                  {verificationProgress === 100 ? 'Verified' : 'Pending'}
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    verificationProgress === 100 ? 'bg-green-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${verificationProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-2">
            <SubsectionHeader title="Personal Information" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cnic">CNIC Number</Label>
                  <div className="relative">
                    <Input
                      id="cnic"
                      type={showCnic ? "text" : "password"}
                      value={form.cnic}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 13);
                        setField('cnic', value);
                      }}
                      placeholder="Enter your CNIC number"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => setShowCnic(!showCnic)}
                    >
                      {showCnic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barCouncilNumber">Bar Council Number</Label>
                  <Input
                    id="barCouncilNumber"
                    value={form.barCouncilNumber}
                    onChange={(e) => setField('barCouncilNumber', e.target.value)}
                    placeholder="Enter your bar council number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    value={form.licenseNumber}
                    onChange={(e) => setField('licenseNumber', e.target.value)}
                    placeholder="Enter your license number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                  <Input
                    id="licenseExpiry"
                    type="date"
                    value={form.licenseExpiry}
                    onChange={(e) => setField('licenseExpiry', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="space-y-2">
            <SubsectionHeader title="Document Upload" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        {doc.id === 'identity' ? <FileText className="w-5 h-5 text-primary" /> :
                         doc.id === 'barCard' ? <CheckCircle className="w-5 h-5 text-primary" /> :
                         doc.id === 'education' ? <FileText className="w-5 h-5 text-primary" /> :
                         <FileText className="w-5 h-5 text-primary" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{doc.name}</h4>
                          {doc.required && (
                            <Badge variant="outline" className="text-xs text-red-600">Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                        {doc.uploadedAt && (
                          <p className="text-xs text-muted-foreground">Uploaded: {doc.uploadedAt}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(doc.status)}
                        <Badge className={getStatusColor(doc.status)}>
                          {getStatusLabel(doc.status)}
                        </Badge>
                      </div>
                      {doc.status === 'not_uploaded' && (
                        <Button
                          onClick={() => handleDocumentUpload(doc.id)}
                          size="sm"
                          variant="outline"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Verification Tips */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-primary mb-2">✅ Verification Tips</h4>
            <ul className="text-sm text-primary/80 space-y-1">
              <li>• Ensure all documents are clear and readable</li>
              <li>• Upload high-quality images or PDFs</li>
              <li>• Make sure documents are not expired</li>
              <li>• Contact support if you have verification questions</li>
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
