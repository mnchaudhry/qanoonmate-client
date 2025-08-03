import React from 'react';
import Link from 'next/link';
import { FileText, SlidersHorizontal, AlertCircle, Eye, Star } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { Button } from '@/components/ui/button';

const features = [
    {
        title: "Organized by Legal Categories",
        description:
            "Browse drafts by area of law—employment, tenancy, business, and more—for quicker navigation and relevance.",
        icon: FileText,
    },
    {
        title: "Multiple Draft Types",
        description:
            "Choose from editable templates, downloadable formats, or explore our upcoming AI-powered draft builder for intelligent automation.",
        icon: SlidersHorizontal,
    },
    {
        title: "Community Ratings",
        description:
            "View feedback and ratings from other users to choose the most reliable and useful drafts.",
        icon: Star,
    },
    {
        title: "Preview Before You Download",
        description:
            "Instantly preview the structure and content of a draft before using it, ensuring it fits your specific needs.",
        icon: Eye,
    },
    {
        title: "Disclaimer & Ethical Considerations",
        description:
            "Drafts are tools to support your legal needs—not a replacement for professional legal advice, especially in sensitive or complex cases.",
        icon: AlertCircle,
    },
    {
        title: "Filters & Reporting",
        description:
            "Easily filter drafts by type, category, or popularity—and report any issues to help us maintain quality and accuracy.",
        icon: SlidersHorizontal,
    },
];

const LegalDrafts: React.FC = () => {
    return (
        <section className="bg-neutral">
            <div className="container px-4 mx-auto max-w-7xl md:px-6">

                <SectionHeading
                    title='Legal Drafts'
                    topTitle='Professionally crafted legal documents at your fingertips'
                    description='Access a comprehensive library of legal drafts—organized, editable, and easy to use. Whether you need a simple agreement or a detailed contract, LegalEase offers structured templates that save time and ensure quality.'
                />

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="bg-neutral p-6 rounded-lg shadow-md">
                                <Icon className="w-8 h-8 text-primary mb-4" />
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <Link href="/legal-drafts">
                        <Button>Explore Draft Library</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default LegalDrafts;
