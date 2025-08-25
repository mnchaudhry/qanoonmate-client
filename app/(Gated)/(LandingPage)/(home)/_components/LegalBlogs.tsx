import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import SectionHeading from './SectionHeading';

const LegalBlogs: React.FC = () => {
    return (
        <section className="bg-surface">

            <div className="container px-4 mx-auto max-w-7xl md:px-6">

                <SectionHeading
                    title='LEGAL BLOGS & NEWS'
                    topTitle='Stay Informed with the Latest Legal Insights'
                    description='Explore legal blogs written by experts, get real-time updates on court decisions, and stay up to date with the latest reforms and bills.'
                />

                {/* Grid Layout for Blog Posts and News Updates */}
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Blog Posts */}
                    <div className="flex-1 order-2 md:order-1">
                        <h3 className="text-2xl font-semibold text-foreground mb-6">Latest Blog Posts</h3>
                        <div className="space-y-6">
                            <BlogCard
                                title="Understanding the Implications of the New Privacy Law"
                                description="A deep dive into the recent changes in privacy laws and their impact on businesses and individuals."
                                author="Prof. John Doe"
                                date="March 30, 2025"
                                link="/blog/privacy-law-implications"
                            />
                            <BlogCard
                                title="The Rise of AI in the Legal Field"
                                description="Exploring how AI is transforming legal practices and the ethical questions it raises."
                                author="Sarah Khan, Legal Consultant"
                                date="March 28, 2025"
                                link="/blog/ai-in-legal-field"
                            />
                            <BlogCard
                                title="Understanding International Arbitration: What You Need to Know"
                                description="An overview of international arbitration, its benefits, and how it is used in cross-border disputes."
                                author="Ali Raza, Legal Advisor"
                                date="March 25, 2025"
                                link="/blog/international-arbitration"
                            />
                        </div>
                    </div>

                    {/* News Updates */}
                    <div className="w-full md:w-1/3 bg-neutral shadow-lg rounded-lg p-6 order-1 md:order-2">
                        <h3 className="text-2xl font-semibold text-foreground mb-6">Latest Legal Updates</h3>
                        <div className="border-t-2 border-primary pt-6 space-y-4">
                            <NewsUpdate
                                title="New Reform on Property Laws Passed in Parliament"
                                date="March 29, 2025"
                                summary="The Parliament has passed a new reform in property laws, which will now make it easier for individuals to transfer property ownership."
                            />
                            <NewsUpdate
                                title="Court Ruling on Cybercrime Sentences: What It Means"
                                date="March 28, 2025"
                                summary="A recent court decision on cybercrime penalties has set a precedent for future cases in this domain. Here's a breakdown of the ruling."
                            />
                            <NewsUpdate
                                title="Bill on Corporate Tax Reductions Signed into Law"
                                date="March 26, 2025"
                                summary="The Corporate Tax Reduction Bill has been signed into law, significantly lowering taxes for businesses across the country."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const BlogCard = ({
    title,
    description,
    author,
    date,
    link,
}: {
    title: string;
    description: string;
    author: string;
    date: string;
    link: string;
}) => {
    return (
        <div className="bg-neutral p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
            <h4 className="text-xl font-semibold text-foreground mb-2">{title}</h4>
            <p className="text-muted-foreground mb-4">{description}</p>
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{author} | {date}</div>
                <Link href={link}>
                    <span className="text-primary hover:underline text-sm">Read More</span>
                </Link>
            </div>
            <div className="mt-4 flex items-center gap-4">
                <Rating />
                <FeedbackButton />
            </div>
        </div>
    );
};

const Rating: React.FC = () => {
    return (
        <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-muted-foreground">4.5</span>
        </div>
    );
};

const FeedbackButton: React.FC = () => {
    return (
        <button className="flex items-center gap-2 text-foreground text-sm hover:underline">
            <MessageSquare className="w-5 h-5" /> Leave Feedback
        </button>
    );
};

const NewsUpdate = ({
    title,
    date,
    summary,
}: {
    title: string;
    date: string;
    summary: string;
}) => {
    return (
        <div className="bg-card p-4 rounded-md shadow-sm">
            <h5 className="text-foreground font-semibold text-lg">{title}</h5>
            <p className="text-muted-foreground text-sm mb-2">{date}</p>
            <p className="text-muted-foreground text-sm">{summary}</p>
        </div>
    );
};

export default LegalBlogs;
