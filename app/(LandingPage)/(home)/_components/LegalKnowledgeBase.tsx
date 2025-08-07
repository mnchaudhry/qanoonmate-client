import Link from 'next/link';
import Image from 'next/image';
import SectionHeading from './SectionHeading';

interface CardProps {
  title: string;
  description: string;
  link: string;
  imageSrc: string;
  imageAlt?: string;
}

const Card: React.FC<CardProps> = ({ title, description, link, imageSrc, imageAlt = 'Card image' }) => {
  return (
    <div className="bg-card rounded-md overflow-hidden shadow-sm transition-transform duration-300 ease-in-out hover:scale-105">
      {/* Dynamic Image */}
      <div className="h-60 relative">
        <Image src={imageSrc} alt={imageAlt} height={240} width={200} className="w-full object-cover" />
      </div>

      {/* Card Content */}
      <div className="p-6">
        <h3 className="text-card-foreground font-bold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Link href={link} className="text-gray font-medium hover:underline">
          Learn more
        </Link>
      </div>
    </div>
  )
}


const LegalKnowledgeBase: React.FC = () => {
  return (
    <section className="bg-neutral">

      <div className="container px-4 mx-auto max-w-7xl md:px-6">

        <SectionHeading
          title='Legal Knowledge Base'
          topTitle='Your Legal Resource Hub — Simplified'
          description='Dive into a curated library of legal insights, summaries, drafts, and expert-written blogs. Whether you&apos;re a law student, professional, or just legally curious, our knowledge base makes complex legal concepts simple and accessible — all in one place.'
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            imageSrc="/Pictures/instantlegalconsult.jpg"
            title="Acts & Statutes"
            description="Explore a categorized collection of national laws and legislative acts with detailed summaries, amendments, and interpretations."
            link="../knowledgebase/acts"
          />

          <Card
            imageSrc="/Pictures/docanalysis.jpg"
            title="Case Laws"
            description="Access landmark judgments, high court and supreme court decisions, all indexed and summarized for easier understanding."
            link="../knowledgebase/case-laws"
          />

          <Card
            imageSrc="/Pictures/lawyerconnection.jpg"
            title="Legal Guides & Dictionary"
            description="Understand complex legal jargon with simplified guides and a built-in legal dictionary designed for everyone — from students to professionals."
            link="../knowledgebase/dictionary"
          />
        </div>
      </div>
    </section>
  )
}

export default LegalKnowledgeBase


