import React from 'react'

const LandingPageHeader = ({ title, description }: { title: string, description: string }) => {
    return (
        <section className="relative h-[300px] pt-[240px] bg-gradient-to-br from-surface to-background overflow-hidden">
            {/* Green blurred blob */}
            <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-primary opacity-20 blur-3xl rounded-full pointer-events-none" />

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 z-0 opacity-5 bg-[url('/general/grid.svg')] bg-cover" />

            {/* Text content */}
            <div className="relative z-10 container flex flex-col items-start justify-center h-full px-4 mx-auto md:px-6">
                <h1 className="text-4xl text-foreground font-bold md:text-5xl lg:text-6xl mb-2">{title}</h1>
                <p className="text-xl text-muted-foreground max-w-5xl ">{description}</p>
            </div>

            {/* Bottom wave divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0 rotate-0">
                <svg className="relative block w-[calc(100%+1.3px)] h-[50px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M1200 0L0 0 892.25 114.72 1200 0z" fill="currentColor" className="text-background" />
                </svg>
            </div>
        </section>
    )
}

export default LandingPageHeader
