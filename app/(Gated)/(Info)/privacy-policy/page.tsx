import React from 'react'
import Breadcrumbs from "@/components/bread-crumb"

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl font-bold text-foreground mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            How we collect, use, and protect your information
                        </p>
                        <div className="text-sm text-muted-foreground mt-2">
                            Last updated: {new Date().toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="container mx-auto px-4 py-4">
                <Breadcrumbs />
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg max-w-none">
                        <div className="bg-muted/30 rounded-lg border border-border p-8 text-center">
                            <h2 className="text-2xl font-semibold text-foreground mb-4">
                                Privacy Policy Coming Soon
                            </h2>
                            <p className="text-muted-foreground">
                                We&apos;re working on our comprehensive privacy policy. Please check back soon for detailed information about how we handle your data.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy