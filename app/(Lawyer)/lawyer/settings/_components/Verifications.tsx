"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload as UploadIcon, UserCheck, BadgeCheck, Video, CheckCircle2 } from 'lucide-react';
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
    idDoc: [] as File[],
    selfie: [] as File[],
    barCert: [] as File[],
    license: [] as File[],
    video: [] as File[],
  });
  const [enrollment, setEnrollment] = useState<{ number?: string; jurisdiction?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //////////////////////////////////////////////// HANDLERS /////////////////////////////////////////////////
  const handleFileChange = (field: keyof typeof docs, files: File[]) => setDocs(prev => ({ ...prev, [field]: files }));
  const handleEnrollmentChange = (k: string, v: string) => setEnrollment(e => ({ ...e, [k]: v }));

  const canSubmit = docs.idDoc.length > 0 || docs.barCert.length > 0;

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);
    if (!canSubmit) {
      setError('Please upload at least one identity or bar certificate document.');
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
          <div className="font-semibold mb-2 flex items-center gap-2">Identity Verification <span className="text-xs text-muted-foreground">(CNIC/NIC/Passport)</span></div>
          <FileUploadField
            id="idDoc"
            label="Identity Document(s)"
            files={docs.idDoc}
            onChange={f => handleFileChange('idDoc', f)}
            accept="image/*,.pdf"
            helperText="Supported formats: PDF, DOC, DOCX, Images. Maximum size: 5MB"
          />
        </section>
        {/* Professional Credentials */}
        <section className='py-0' >
          <div className="font-semibold mb-2 flex items-center gap-2">Professional Credentials <BadgeCheck className="h-4 w-4 text-primary" /></div>
          <FileUploadField
            id="barCert"
            label="Bar Certificate(s)"
            files={docs.barCert}
            onChange={f => handleFileChange('barCert', f)}
            accept="image/*,.pdf"
            helperText="Supported formats: PDF, DOC, DOCX, Images. Maximum size: 5MB"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
              <Input id="enrollmentNumber" value={enrollment.number || ''} onChange={e => handleEnrollmentChange('number', e.target.value)} placeholder="e.g. 12345" />
            </div>
            <div>
              <Label htmlFor="enrollmentJurisdiction">Jurisdiction</Label>
              <Input id="enrollmentJurisdiction" value={enrollment.jurisdiction || ''} onChange={e => handleEnrollmentChange('jurisdiction', e.target.value)} placeholder="e.g. Punjab Bar Council" />
            </div>
          </div>
          <FileUploadField
            id="license"
            label="License Document(s)"
            files={docs.license}
            onChange={f => handleFileChange('license', f)}
            accept="image/*,.pdf"
            helperText="Supported formats: PDF, DOC, DOCX, Images. Maximum size: 5MB"
          />
        </section>
        {/* Selfie Upload (optional) */}
        <section className='py-0' >
          <div className="font-semibold mb-2 flex items-center gap-2">Selfie (optional)</div>
          <FileUploadField
            id="selfie"
            label="Selfie Photo(s)"
            files={docs.selfie}
            onChange={f => handleFileChange('selfie', f)}
            accept="image/*"
            helperText="Supported formats: Images only. Maximum size: 5MB"
          />
        </section>
        {/* Video Verification (optional) */}
        <section className='py-0' >
          <div className="font-semibold mb-2 flex items-center gap-2">Video Verification <Video className="h-4 w-4 text-primary" /></div>
          <FileUploadField
            id="video"
            label="Video(s)"
            files={docs.video}
            onChange={f => handleFileChange('video', f)}
            accept="video/*"
            helperText="Supported formats: MP4, MOV, AVI, WMV. Maximum size: 5MB"
          />
        </section>
        {/* KYC Verification Summary */}
        <section className='py-0' >
          <div className="font-semibold mb-2 flex items-center gap-2">KYC Verification Summary</div>
          <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>Date of Last Verification: <span className="font-medium">N/A</span></div>
            <div>Verified By: <span className="font-medium">N/A</span></div>
            <div>Next Review Date: <span className="font-medium">N/A</span></div>
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
