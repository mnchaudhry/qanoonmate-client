import React from 'react'

interface DashboardPageHeaderProps {
    title: string;
    description: string;
    action?: React.ReactNode;
}

const DashboardPageHeader = ({ title, description, action }: DashboardPageHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
            <div className="flex flex-col gap-1 px-2 md:px-0">
                <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
                <p className="text-muted-foreground text-sm">{description}</p>
            </div>
            {action && (
                <div className="flex items-center gap-2">
                    {action}
                </div>
            )}
        </div>
    )
}

export default DashboardPageHeader