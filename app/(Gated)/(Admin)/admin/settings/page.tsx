import React from 'react'
import { PageHeader } from '../../_components/PageHeader'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

const AdminSettings = () => {
    return (
        <div className='space-y-6'>
            <PageHeader
                title="Settings"
                description="Manage your settings"
                actions={
                    <Button>
                        <PlusIcon className='w-4 h-4 mr-2' />
                        Add Setting
                    </Button>
                }
            />
        </div>
    )
}

export default AdminSettings