import React from 'react'
import { PageHeader } from '@/app/(Gated)/(Admin)/_components/PageHeader';

const Admin = () => {

    return (
        <div className='space-y-6'>
            <PageHeader
                title="Admin"
                description="View and manage admin."
            />
        </div>
    )
}

export default Admin