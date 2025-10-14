import { About } from "./images";

export const NEWS_API_URL = 'https://gnews.io/api/v4/search?q=Pakistan%20law&country=pk&lang=en&max=20&nullable=image&apikey=f469f54797e777cd2433cda4827aa52c'

export const breadcrumbLabels: Record<string, string> = {
  "dashboard": "Dashboard",
  "settings": "Settings",
  "profile": "Profile",
  "legaldb": "Legal Database",
  "law-categories": "Law Categories",
  "acts": "Acts",
  "sections": "Sections",
  "clauses": "Clauses",
  "subclauses": "Subclauses",
  "info": "Information",
  "terms-of-services": "Terms of Services",
  "privacy-policy": "Privacy Policy",
}

import { Currency } from '@/lib/enums';

// Credit-based pricing packages
export const creditPackages = [
  {
    id: 'starter',
    name: 'Starter Package',
    qcAmount: 50,
    price: 5,
    currency: Currency.USD,
    description: 'Perfect for trying out premium features',
    popular: false,
    features: [
      '200 AI chatbot queries (0.25 QC each)',
      '25 document summaries (2 QC each)',
      '50 knowledge base downloads (1 QC each)',
      '10 minutes of consultation (5 QC per 10 min)',
      'Access to all legal guides & dictionary',
      'Bilingual interface (Urdu & English)'
    ],
    savings: null
  },
  {
    id: 'standard',
    name: 'Standard Package',
    qcAmount: 120,
    price: 10,
    currency: Currency.USD,
    description: 'Great value for regular users',
    popular: true,
    features: [
      '480 AI chatbot queries (0.25 QC each)',
      '60 document summaries (2 QC each)',
      '120 knowledge base downloads (1 QC each)',
      '24 minutes of consultation (5 QC per 10 min)',
      '40 blog posts (3 QC each)',
      'Priority customer support',
      'Advanced AI features'
    ],
    savings: 'Best Value'
  },
  {
    id: 'premium',
    name: 'Premium Package',
    qcAmount: 300,
    price: 20,
    currency: Currency.USD,
    description: 'Best value for power users',
    popular: false,
    features: [
      '1200 AI chatbot queries (0.25 QC each)',
      '150 document summaries (2 QC each)',
      '300 knowledge base downloads (1 QC each)',
      '60 minutes of consultation (5 QC per 10 min)',
      '100 blog posts (3 QC each)',
      'Premium AI features & tone control',
      'Priority support & consultation booking',
      'Advanced analytics & insights'
    ],
    savings: 'Save 25%'
  }
];

// Service pricing information
export const servicePricing = [
  {
    service: 'AI Chatbot Queries',
    price: '0.25 QC',
    description: 'Get instant legal answers with AI-powered chatbot',
    icon: '🤖'
  },
  {
    service: 'Document Summarization',
    price: '2 QC',
    description: 'Summarize legal documents and contracts',
    icon: '📄'
  },
  {
    service: 'Knowledge Base Access',
    price: '1 QC',
    description: 'Download case laws, acts, and legal documents',
    icon: '📚'
  },
  {
    service: 'Lawyer Consultation',
    price: '5 QC per 10 min',
    description: 'Get expert legal advice from qualified lawyers',
    icon: '⚖️'
  },
  {
    service: 'Blog Publishing',
    price: '3 QC',
    description: 'Publish legal articles and insights',
    icon: '✍️'
  }
];

// Legacy pricing plans (deprecated)
export const pricingPlans = creditPackages;


export const blogs = [
  {
    title: "Understanding Your Rights When Terminated from Employment",
    summary: "Know your legal options when facing wrongful termination. Learn the steps to protect yourself legally and professionally.",
    date: "April 12, 2025",
    tag: "Employment Law",
    imageUrl: About,
    slug: "rights-when-terminated",
  },
  {
    title: "The Legal Checklist Every Startup Should Follow",
    summary: "Startups often skip crucial legal steps. This checklist helps you launch your company with confidence and compliance.",
    date: "March 27, 2025",
    tag: "Startup Law",
    imageUrl: About,
    slug: "startup-legal-checklist",
  },
  {
    title: "Power of Attorney: What It Means and When You Need It",
    summary: "A breakdown of the power of attorney, its types, and how to use it in personal or financial situations.",
    date: "April 4, 2025",
    tag: "Personal Law",
    imageUrl: About,
    slug: "power-of-attorney-basics",
  },
  {
    title: "Navigating Landlord-Tenant Disputes Legally",
    summary: "Understand how to resolve rental disputes fairly — from unpaid rent to eviction notices and more.",
    date: "March 15, 2025",
    tag: "Real Estate",
    imageUrl: About,
    slug: "landlord-tenant-disputes",
  },
  {
    title: "How to Legally Protect Your Freelance Work",
    summary: "From contracts to copyright – here's how freelancers can safeguard their services and payments.",
    date: "February 21, 2025",
    tag: "Freelance",
    imageUrl: About,
    slug: "protect-your-freelance-work",
  },
  {
    title: "Top 7 Legal Drafts Every Business Needs",
    summary: "Whether you're forming a company or managing employees, these drafts cover the essentials.",
    date: "April 7, 2025",
    tag: "Business Law",
    imageUrl: About,
    slug: "legal-drafts-business",
  },
  {
    title: "Legal Implications of Digital Signatures in 2025",
    summary: "Are digital signatures legally valid? Understand the regulations and best practices for e-signing.",
    date: "April 19, 2025",
    tag: "Tech Law",
    imageUrl: About,
    slug: "digital-signature-law",
  },
  {
    title: "Why You Should Have a Will (Even If You're Under 30)",
    summary: "A will isn't just for the elderly — discover how it helps protect your assets and intentions.",
    date: "March 8, 2025",
    tag: "Estate Planning",
    imageUrl: About,
    slug: "young-adult-will",
  },
  {
    title: "Understanding Copyright Law as a Content Creator",
    summary: "Protect your videos, designs, and ideas online with a deep dive into copyright essentials.",
    date: "March 25, 2025",
    tag: "Creative Rights",
    imageUrl: About,
    slug: "copyright-for-creators",
  },
  {
    title: "When to Consult a Lawyer vs. Use a Chatbot",
    summary: "Legal bots are helpful, but there are times when human expertise is irreplaceable.",
    date: "February 10, 2025",
    tag: "Legal Tech",
    imageUrl: About,
    slug: "chatbot-vs-lawyer",
  },
  {
    title: "Legal Aspects of Remote Work Agreements",
    summary: "Explore what's legally required in a remote work contract for both employers and employees.",
    date: "April 3, 2025",
    tag: "Workplace Law",
    imageUrl: About,
    slug: "remote-work-agreements",
  },
  {
    title: "Starting a Nonprofit: Legal Steps and Structures",
    summary: "Forming a nonprofit? Here's your legal roadmap for structure, compliance, and success.",
    date: "March 30, 2025",
    tag: "Nonprofit",
    imageUrl: About,
    slug: "starting-a-nonprofit",
  },
  {
    title: "How to Read a Contract Like a Lawyer",
    summary: "Master the key terms and red flags in any agreement without needing a law degree.",
    date: "March 12, 2025",
    tag: "Contract Law",
    imageUrl: About,
    slug: "read-contract-like-lawyer",
  },
  {
    title: "What Makes a Legal Chatbot Trustworthy?",
    summary: "Not all bots are created equal. Here's what to look for in a reliable legal AI assistant.",
    date: "February 28, 2025",
    tag: "AI & Law",
    imageUrl: About,
    slug: "trustworthy-legal-chatbot",
  },
  {
    title: "Employee Rights During Probation Periods",
    summary: "What rights do you have as a probationary employee? Here's what the law says.",
    date: "March 18, 2025",
    tag: "Employee Law",
    imageUrl: About,
    slug: "employee-rights-probation",
  },
  {
    title: "Legal Draft vs. Legal Advice: Know the Difference",
    summary: "Understanding the boundary between DIY documents and when to seek real legal help.",
    date: "April 6, 2025",
    tag: "Legal Basics",
    imageUrl: About,
    slug: "legal-draft-vs-advice",
  },
  {
    title: "Smart Legal Tips for Buying Property in 2025",
    summary: "From due diligence to sale deeds, this guide keeps your next property purchase safe.",
    date: "February 14, 2025",
    tag: "Real Estate",
    imageUrl: About,
    slug: "legal-tips-buying-property",
  },
  {
    title: "Understanding Your Legal Rights in Social Media Disputes",
    summary: "Who owns your content? What if you're defamed online? Get your legal footing on social platforms.",
    date: "March 5, 2025",
    tag: "Internet Law",
    imageUrl: About,
    slug: "social-media-rights",
  },
  {
    title: "Top 5 Legal Tools Every Entrepreneur Should Know",
    summary: "Empower your hustle with legal tools designed to save time, money, and lawsuits.",
    date: "April 10, 2025",
    tag: "Business Tools",
    imageUrl: About,
    slug: "legal-tools-entrepreneurs",
  },
  {
    title: "How AI Is Transforming the Legal Landscape",
    summary: "From legal research to contract review — here's how AI is reshaping the justice system.",
    date: "April 18, 2025",
    tag: "AI & Law",
    imageUrl: About,
    slug: "ai-transforming-legal",
  },
]
