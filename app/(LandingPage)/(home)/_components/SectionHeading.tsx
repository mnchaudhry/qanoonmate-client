import React from 'react'

const SectionHeading = ({ title, topTitle, description }: { title: string, topTitle: string, description: string }) => {
    return (
        <div className="mb-16 text-center md:text-left">
            <div className="text-sm text-primary font-semibold uppercase mb-3 tracking-wider">
                {title}
            </div>
            <h2 className="text-4xl font-bold text-foreground">
                {topTitle}
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl">
                {description}
            </p>
        </div>
    )
}

export default SectionHeading