import React from 'react'
import { Separator } from '@/components/ui/separator'

interface PageHeaderProps {
    title: string;
    description: string;
    action?: React.ReactNode;
}

const PageHeader = ({ title, description, action }: PageHeaderProps) => {
    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col gap-2 px-2 md:px-0">
                    <h1 className="text-3xl font-semibold text-foreground tracking-tight">{title}</h1>
                    <p className="text-muted-foreground text-base">{description}</p>
                </div>
                {action && (
                    <div className="flex items-center gap-2">
                        {action}
                    </div>
                )}
            </div>
            <Separator className="bg-border" />
        </div>
    )
}

export default PageHeader