import { About } from "./images";

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
}

export const pricingPlans = [
  {
    name: "Free Plan",
    price: 0,
    description:
      "Test QanoonMate: get a taste of our AI, guides, and core legal resources.",
    features: [
      "Basic AI chatbot support (up to 5 queries/day)",
      "Unlimited Legal Guides & Dictionary",
      "Download-only access to all Pakistani Acts",
      "Read-only access to legal blogs & news",
      "Download-only legal drafts",
      "Up to 5 AI‑generated summaries/day",
      "Bilingual interface (Urdu & English)"
    ],
    popular: false
  },
  {
    name: "Student Plan",
    price: 1000,
    description:
      "Everything a law student needs: deeper AI access, editing drafts, and saving work.",
    features: [
      "Unlimited AI chatbot queries",
      "Source citations in every response",
      "Download & edit legal drafts (3/month)",
      "Up to 20 AI‑generated summaries/day",
      "Save & export summaries as PDF",
      "Custom legal alerts on topics you follow",
      "Unlimited Legal Guides & Dictionary",
      "Bilingual interface (Urdu & English)"
    ],
    popular: false
  },
  {
    name: "Individual Plan",
    price: 5000,
    description:
      "For professionals: full AI power, draft building, case law access, and document uploads.",
    features: [
      "Unlimited chatbot + tone control modes",
      "Read‑only access to Case Laws & Judgements",
      "AI‑assisted draft builder (limited)",
      "Download & edit all legal drafts",
      "Unlimited AI‑generated summaries",
      "Upload your own documents for summarization",
      "Save & export summaries as PDF",
      "Custom legal alerts & updates"
    ],
    popular: true
  },
  // {
  //   name: "Organization Plan",
  //   price: 20000,
  //   description:
  //     "Everything in Individual, plus team seats, collaboration, and smart enterprise search.",
  //   features: [
  //     "All Individual Plan features",
  //     "5 user seats (expandable)",
  //     "Team dashboard with roles & permissions",
  //     "AI draft builder (team‑wide access)",
  //     "Smart, semantic search across all content",
  //     "Shared saved summaries & tags",
  //     "Monthly usage insights & alerts",
  //     "Priority support"
  //   ],
  //   popular: false
  // }
];


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
