import React from 'react'

const PageHeader = ({ title, description }: { title: string, description: string }) => {
    return (
        <div className="flex flex-col gap-1 px-2 md:px-0">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
        </div>
    )
}

export default PageHeader