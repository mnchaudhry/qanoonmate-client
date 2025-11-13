import React from 'react'

interface DashboardPageHeaderProps {
    title: string;
    description: string;
    action?: React.ReactNode;
}

const DashboardPageHeader = ({ title, description, action }: DashboardPageHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col gap-1 px-2 md:px-0">
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
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