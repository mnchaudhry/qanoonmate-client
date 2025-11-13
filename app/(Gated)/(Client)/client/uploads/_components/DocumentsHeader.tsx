"use client"

import React from 'react'
import { Shield } from 'lucide-react'
import DashboardPageHeader from '@/components/DashboardPageHeader'

const DocumentsHeader = () => {
    return (
        <div className='mb-4 space-y-4' >

            <DashboardPageHeader
                title="Legal Documents & Upload"
                description="Upload your legal documents (e.g., Agreements, Notices, FIRs) securely here."
            />

            <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                        Quick Note: Upload your legal documents (e.g., Agreements, Notices, FIRs) securely here.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        All files are encrypted and visible only to you and your assigned lawyer.
                    </p>
                </div>
            </div>

        </div>
    )
}

export default DocumentsHeader
