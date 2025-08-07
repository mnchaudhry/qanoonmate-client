import React from 'react';
import { FileText, BookOpen, UploadCloud,  AlertTriangle, MessageSquareText, ArchiveRestore } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionHeading from './SectionHeading';

const summaryCards = [
  {
    title: "Act & Section Summaries",
    description:
      "Understand the essence, structure, and practical uses of legislative acts and their sections.",
    icon: BookOpen,
  },
  {
    title: "Case Law Judgement Breakdown",
    description:
      "Summarized judgements, legal reasoning, and implications for relevant legal precedents.",
    icon: MessageSquareText,
  },
  {
    title: "Document Analysis",
    description:
      "Upload legal documents and receive concise summaries of their contents and meanings.",
    icon: FileText,
  },
  {
    title: "Topic Explanations",
    description:
      "Deep dives into legal topics like Succession, Property Transfer, Contracts, and more.",
    icon: ArchiveRestore,
  },
];

const LegalSummaries: React.FC = () => {
  return (
    <section className="bg-surface relative">

      <div className="container px-4 mx-auto max-w-7xl md:px-6">

        <SectionHeading
          title='AI-GENERATED LEGAL SUMMARIES'
          topTitle='Legal complexity simplified through smart summaries'
          description='Our AI helps you break down acts, case laws, legal documents, and broad legal topics into concise and readable summaries.
            Input a query, upload a document, and get clarity—fast.'
        />

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {summaryCards.map((card, index) => (
            <SummaryCard
              key={index}
              icon={<card.icon className="w-7 h-7 text-neutral" />}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>


        {/* Upload & Query */}
        <div className="bg-neutral p-6 rounded-lg shadow-md max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Ask a legal question or upload a file..."
              className="w-full border border-border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button>Submit</Button>
            <button className="flex items-center gap-2 text-muted-foreground font-medium hover:underline">
              <UploadCloud className="w-5 h-5" /> Upload
            </button>
          </div>
        </div>

        {/* Features & Disclaimer */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div>
            <h4 className="font-semibold text-lg mb-2 text-foreground">Download & Save</h4>
            <p className="text-muted-foreground">Registered users can save summaries to their profile or download them in PDF format for later use.</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2 text-foreground">Knowledge Integration</h4>
            <p className="text-muted-foreground">Summaries can also be triggered from relevant content within the Legal Knowledge Base.</p>
          </div>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-md">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-700" />
              <span className="font-medium text-yellow-800">Disclaimer</span>
            </div>
            <p className="text-yellow-700 mt-1 text-sm">
              AI summaries are not a replacement for professional legal consultation. Use with caution, especially for sensitive matters. Incorrect or misleading content can be reported for review.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="../summarizers">
            <Button>Explore Legal Summaries</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LegalSummaries;

const SummaryCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-neutral rounded-lg p-6 shadow-md hover:shadow-xl transition-all">
      <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-xl mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
