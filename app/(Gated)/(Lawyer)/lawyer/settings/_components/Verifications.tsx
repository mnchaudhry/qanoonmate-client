"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload as UploadIcon, UserCheck, BadgeCheck, CheckCircle2 } from 'lucide-react';
import Upload from '@/components/ui/upload';

const FileUploadField = ({
  id,
  label,
  files,
  onChange,
  accept = 'image/*,.pdf',
  helperText,
}: {
  id: string;
  label: string;
  files: File[];
  onChange: (files: File[]) => void;
  accept?: string;
  helperText?: string;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Upload
      value={files}
      onChange={onChange}
      accept={accept}
      multiple={true}
      maxSizeMB={5}
      helperText={helperText || 'Supported formats: PDF, DOC, DOCX, Images. Maximum size: 5MB'}
    />
  </div>
);

const Verifications = () => {
  //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////

  //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
  const [docs, setDocs] = useState({
    cnicFront: [] as File[],
    cnicBack: [] as File[],
    barCardFront: [] as File[],
    barCardBack: [] as File[],
    selfie: [] as File[],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //////////////////////////////////////////////// HANDLERS /////////////////////////////////////////////////
  const handleFileChange = (field: keyof typeof docs, files: File[]) => setDocs(prev => ({ ...prev, [field]: files }));

  const canSubmit = docs.cnicFront.length > 0 && docs.cnicBack.length > 0 && docs.barCardFront.length > 0 && docs.barCardBack.length > 0 && docs.selfie.length > 0;

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);
    if (!canSubmit) {
      setError('Please upload all required documents: CNIC front, CNIC back, bar card front, bar card back, and selfie.');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Optionally reset state here
      // setDocs({ idDoc: [], selfie: [], barCert: [], license: [], video: [] });
    }, 1200);
  };

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl ">
          <UserCheck className="h-5 w-5 text-primary" />
          Verifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Identity Verification */}
        <section className='py-0' >
          <div className="font-semibold mb-2 flex items-center gap-2">Identity Verification <span className="text-xs text-muted-foreground">(CNIC)</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUploadField
              id="cnicFront"
              label="CNIC Front"
              files={docs.cnicFront}
              onChange={f => handleFileChange('cnicFront', f)}
              accept="image/*,.pdf"
              helperText="Front side of CNIC"
            />
            <FileUploadField
              id="cnicBack"
              label="CNIC Back"
              files={docs.cnicBack}
              onChange={f => handleFileChange('cnicBack', f)}
              accept="image/*,.pdf"
              helperText="Back side of CNIC"
            />
          </div>
        </section>
        {/* Professional Credentials */}
        <section className='py-0' >
          <div className="font-semibold mb-2 flex items-center gap-2">Professional Credentials <BadgeCheck className="h-4 w-4 text-primary" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUploadField
              id="barCardFront"
              label="Bar Card Front"
              files={docs.barCardFront}
              onChange={f => handleFileChange('barCardFront', f)}
              accept="image/*,.pdf"
              helperText="Front side of bar card"
            />
            <FileUploadField
              id="barCardBack"
              label="Bar Card Back"
              files={docs.barCardBack}
              onChange={f => handleFileChange('barCardBack', f)}
              accept="image/*,.pdf"
              helperText="Back side of bar card"
            />
          </div>
        </section>
        {/* Selfie Upload (required) */}
        <section className='py-0' >
          <div className="font-semibold mb-2 flex items-center gap-2">Selfie (required)</div>
          <FileUploadField
            id="selfie"
            label="Selfie Photo"
            files={docs.selfie}
            onChange={f => handleFileChange('selfie', f)}
            accept="image/*"
            helperText="Clear selfie photo for identity verification"
          />
        </section>
        {/* KYC Verification Summary */}
        <section className='py-0' >
          <div className="font-semibold mb-2 flex items-center gap-2">KYC Verification Summary</div>
          <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>Date of Last Verification: <span className="font-medium">N/A</span></div>
            <div>Verified By: <span className="font-medium">N/A</span></div>
          </div>
        </section>
        {error && <div className="text-red-500 text-sm font-medium mt-2">{error}</div>}
        {success && (
          <div className="flex items-center gap-2 text-green-600 font-medium mt-2">
            <CheckCircle2 className="h-4 w-4" /> Verification documents uploaded successfully!
          </div>
        )}
        <div className="flex justify-end">
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90" disabled={loading || !canSubmit} >
            <UploadIcon className="h-4 w-4 mr-2" />
            {loading ? 'Uploading...' : 'Upload/Update Verification'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Verifications;
