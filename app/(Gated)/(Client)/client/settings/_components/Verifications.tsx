"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileText, Upload, Check, CheckCircle } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { updateClientSettings } from '@/store/reducers/clientSettingsSlice'
import { SubsectionHeader } from './sections/SubsectionHeader'

const Verifications = () => {

  //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { selectedSettings } = useSelector((state: RootState) => state.clientSettings)

  //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
  const [documents, setDocuments] = useState({
    cnicFront: null as File | null,
    cnicBack: null as File | null,
    supportingDocs: null as File | null
  })
  const [loading, setLoading] = useState(false)

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleFileChange = (field: string, file: File | null) => {
    setDocuments(prev => ({ ...prev, [field]: file }))
  }

  const handleSubmit = () => {
    if (!documents.cnicFront) return;
    setLoading(true)
    
    // TODO: Implement file upload logic
    // For now, just update the verification status
    dispatch(updateClientSettings({
      identityVerification: {
        documentType: 'CNIC',
        status: 'pending',
        submittedAt: new Date().toISOString()
      }
    }))
      .finally(() => setLoading(false))
  }

  //////////////////////////////////////////////// COMPONENTS /////////////////////////////////////////////////
  const FileUploadField = ({ id, label, file, onChange, accept = "image/*,.pdf" }: { id: string; label: string; file: File | null; onChange: (file: File | null) => void; accept?: string; }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Input
            id={id}
            type="file"
            accept={accept}
            onChange={(e) => onChange(e.target.files?.[0] || null)}
            className="cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-2">
          {file ? (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="h-4 w-4" />
              <span>{file.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>No file selected</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <CheckCircle className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Identity Verification</h2>
          <p className="text-sm text-muted-foreground mt-1">Upload your identity documents for account verification</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <SubsectionHeader
              title="Document Upload"
              description="Upload your CNIC or identity documents"
            />
          </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Upload your identity documents for verification.
        </p>

        <div className="space-y-4">
          {selectedSettings?.identityVerification?.status === 'pending' && (
            <div className="rounded-md bg-yellow-50 border border-yellow-200 px-4 py-2 text-sm text-yellow-900 mb-2">
              Your identity verification is pending. You may resubmit your file if you wish.
            </div>
          )}
          
          {selectedSettings?.identityVerification?.status === 'rejected' && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-900 mb-2">
              Your identity verification was rejected. Reason: {selectedSettings.identityVerification.rejectionReason}
            </div>
          )}

          {selectedSettings?.identityVerification?.status === 'verified' && (
            <div className="rounded-md bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-900 mb-2">
              Your identity has been verified successfully.
            </div>
          )}

          <FileUploadField
            id="cnicFront"
            label="▸ CNIC Front"
            file={documents.cnicFront}
            onChange={(file) => handleFileChange('cnicFront', file)}
          />

          <FileUploadField
            id="cnicBack"
            label="▸ CNIC Back"
            file={documents.cnicBack}
            onChange={(file) => handleFileChange('cnicBack', file)}
          />

          <FileUploadField
            id="supportingDocs"
            label="▸ Supporting Docs (optional)"
            file={documents.supportingDocs}
            onChange={(file) => handleFileChange('supportingDocs', file)}
            accept="image/*,.pdf,.doc,.docx"
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSubmit} disabled={loading} size="lg">
            <Upload className="h-4 w-4 mr-2" />
            {loading ? 'Submitting...' : 'Submit Verification'}
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  </div>
  )
}

export default Verifications
