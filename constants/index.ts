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

export const dictionary = [
  { term: 'Abatement', definition: 'The reduction or elimination of a nuisance or harmful condition.' },
  { term: 'Abduction', definition: 'The unlawful taking away of a person.' },
  { term: 'Acquittal', definition: 'A legal judgment that officially and formally clears a defendant of criminal charges.' },
  { term: 'Adjudication', definition: 'A formal judgment on a disputed matter.' },
  { term: 'Affidavit', definition: 'A written statement confirmed by oath or affirmation.' },
  { term: 'Amicus Curiae', definition: 'An impartial adviser to a court of law in a particular case.' },
  { term: 'Arraignment', definition: 'A court proceeding where charges are formally presented.' },
  { term: 'Bail', definition: 'The temporary release of an accused person awaiting trial.' },
  { term: 'Bailiff', definition: 'A court officer who maintains order and assists the judge.' },
  { term: 'Bankruptcy', definition: 'A legal proceeding involving a person or business that is unable to repay debts.' },
  { term: 'Barrister', definition: 'A lawyer entitled to practice as an advocate in higher courts.' },
  { term: 'Breach', definition: 'The violation of a law, duty, or contractual obligation.' },
  { term: 'Burden of Proof', definition: 'The obligation to prove one\'s assertion.' },
  { term: 'Chambers', definition: 'The private office of a judge.' },
  { term: 'Citation', definition: 'A reference to a legal precedent or authority.' },
  { term: 'Contract', definition: 'A legally binding agreement between two or more parties.' },
  { term: 'Covenant', definition: 'A formal agreement or promise in a legal document.' },
  { term: 'Custody', definition: 'Protective care or guardianship of someone or something.' },
  { term: 'Default Judgment', definition: 'A ruling granted by a court when one party fails to take action.' },
  { term: 'Defendant', definition: 'An individual accused in a court of law.' },
  { term: 'Deposition', definition: 'Testimony of a witness recorded outside court.' },
  { term: 'Diligence', definition: 'Careful and persistent work or effort.' },
  { term: 'Docket', definition: 'A court\'s calendar or schedule of cases.' },
  { term: 'Emancipation', definition: 'Legal process by which a minor is released from control of their parents.' },
  { term: 'Enjoin', definition: 'To legally prohibit or command an action.' },
  { term: 'Equity', definition: 'The quality of being fair and impartial.' },
  { term: 'Estoppel', definition: 'A legal principle that prevents someone from arguing something contrary to a previous claim.' },
  { term: 'Evidence', definition: 'Information presented in a court to prove or disprove a fact.' },
  { term: 'Felony', definition: 'A serious crime, typically punishable by imprisonment.' },
  { term: 'Foreclosure', definition: 'A legal process in which a lender takes control of a property due to missed payments.' },
  { term: 'Foreman', definition: 'The head juror who speaks on behalf of the jury.' },
  { term: 'Forensic', definition: 'Relating to or denoting the application of scientific methods to solve crimes.' },
  { term: 'Fraud', definition: 'Wrongful or criminal deception intended to result in financial or personal gain.' },
  { term: 'Gag Order', definition: 'A court order restricting information or comment.' },
  { term: 'Garnishment', definition: 'A legal process to withhold a portion of a debtor\'s wages.' },
  { term: 'Grand Jury', definition: 'A jury that decides whether there is enough evidence for a trial.' },
  { term: 'Guardian ad Litem', definition: 'A person appointed to represent the best interests of a minor in court.' },
  { term: 'Guilty', definition: 'Having committed a crime or offense.' },
  { term: 'Habeas Corpus', definition: 'A legal order requiring a person to be brought before a judge.' },
  { term: 'Hearing', definition: 'A legal proceeding before a judge or other legal decision-maker.' },
  { term: 'Hearsay', definition: 'Information received from others that cannot be substantiated.' },
  { term: 'Homicide', definition: 'The killing of one person by another.' },
  { term: 'Immunity', definition: 'Legal protection from liability or prosecution.' },
  { term: 'Incarceration', definition: 'The state of being confined in prison.' },
  { term: 'Indemnity', definition: 'Security or protection against a loss or other financial burden.' },
  { term: 'Injunction', definition: 'A court order requiring a person to do or cease doing a specific action.' },
  { term: 'Interrogatories', definition: 'Written questions requiring written answers under oath.' },
  { term: 'Jeopardy', definition: 'The danger of conviction and punishment in a criminal trial.' },
  { term: 'Joint Venture', definition: 'A business arrangement in which two or more parties agree to pool their resources.' },
  { term: 'Judgment', definition: 'A court\'s official decision on the matters before it.' },
  { term: 'Jurisdiction', definition: 'The official power to make legal decisions and judgments.' },
  { term: 'Jurisprudence', definition: 'The theory or philosophy of law.' },
  { term: 'Just Cause', definition: 'A legally sufficient reason.' },
  { term: 'Kickback', definition: 'A payment made to someone in return for facilitating a transaction.' },
  { term: 'Larceny', definition: 'The unlawful taking of someone else\'s property.' },
  { term: 'Lease', definition: 'A contract for rental of property.' },
  { term: 'Liability', definition: 'Legal responsibility for one\'s actions or omissions.' },
  { term: 'Liens', definition: 'A legal right or interest that a lender has in the borrower\'s property.' },
  { term: 'Litigation', definition: 'The process of taking legal action.' },
  { term: 'Malfeasance', definition: 'Wrongdoing by a public official.' },
  { term: 'Mandate', definition: 'An official order to do something.' },
  { term: 'Mediation', definition: 'A method of resolving disputes by involving a neutral third party.' },
  { term: 'Mens Rea', definition: 'The intention or knowledge of wrongdoing.' },
  { term: 'Misdemeanor', definition: 'A minor wrongdoing or crime.' },
  { term: 'Negligence', definition: 'Failure to take proper care in doing something, leading to damage or injury.' },
  { term: 'Negotiation', definition: 'Discussion aimed at reaching an agreement.' },
  { term: 'No Contest', definition: 'A plea where the defendant neither admits nor disputes a charge.' },
  { term: 'Nolo Contendere', definition: 'A plea of no contest.' },
  { term: 'Nuisance', definition: 'An act that interferes with the use or enjoyment of property.' },
  { term: 'Oath', definition: 'A solemn promise, often invoking a divine witness, regarding one\'s future action or behavior.' },
  { term: 'Objection', definition: 'A formal protest raised in court.' },
  { term: 'Opinion', definition: 'A written explanation by a judge or group of judges.' },
  { term: 'Ordinance', definition: 'A local law or regulation.' },
  { term: 'Parole', definition: 'The conditional release of a prisoner before the full sentence is served.' },
  { term: 'Perjury', definition: 'The offense of lying under oath.' },
  { term: 'Plaintiff', definition: 'A person who brings a case against another in a court of law.' },
  { term: 'Precedent', definition: 'A legal decision serving as an example in future cases.' },
  { term: 'Probation', definition: 'A period of supervised release instead of prison.' },
  { term: 'Quarantine', definition: 'A period of isolation to prevent the spread of disease.' },
  { term: 'Quash', definition: 'To reject or void, especially by legal procedure.' },
  { term: 'Quid Pro Quo', definition: 'A favor or advantage granted in return for something.' },
  { term: 'Quorum', definition: 'Minimum number of members required to make proceedings valid.' },
  { term: 'Rebuttal', definition: 'A counter-argument or evidence presented to contradict a claim.' },
  { term: 'Recusal', definition: 'The act of a judge removing themselves from a case due to potential bias.' },
  { term: 'Remand', definition: 'To send a case back to a lower court for further action.' },
  { term: 'Rescission', definition: 'The revocation or cancellation of a contract.' },
  { term: 'Restitution', definition: 'Repayment for damage or loss.' },
  { term: 'Sanction', definition: 'A penalty for disobeying a rule or law.' },
  { term: 'Settlement', definition: 'An official agreement intended to resolve a dispute or conflict.' },
  { term: 'Statute', definition: 'A written law passed by a legislative body.' },
  { term: 'Subpoena', definition: 'A document ordering a person to attend a court proceeding.' },
  { term: 'Testament', definition: 'A person\'s will, especially the part relating to personal property.' },
  { term: 'Tort', definition: 'A wrongful act leading to civil legal liability.' },
  { term: 'Transcript', definition: 'A written record of spoken words in court.' },
  { term: 'Treason', definition: 'The crime of betraying one\'s country.' },
  { term: 'Unconstitutional', definition: 'Not in accordance with a political constitution.' },
  { term: 'Unlawful Detainer', definition: 'A legal action to evict someone from property.' },
  { term: 'Upheld', definition: 'To maintain or support a decision or ruling.' },
  { term: 'Usury', definition: 'The illegal action of lending money at unreasonably high rates of interest.' },
  { term: 'Venue', definition: 'The location where a trial is held.' },
  { term: 'Verdict', definition: 'A decision on a disputed issue in a civil or criminal case.' },
  { term: 'Vicarious Liability', definition: 'Legal responsibility assigned to one party for the actions of another.' },
  { term: 'Voir Dire', definition: 'Jury selection process involving questioning of potential jurors.' },
  { term: 'Waiver', definition: 'The voluntary relinquishment of a known right or privilege.' },
  { term: 'Warrant', definition: 'A legal document authorizing police to take a specific action.' },
  { term: 'Witness', definition: 'A person who sees an event, typically a crime or accident.' },
  { term: 'Writ', definition: 'A formal written order issued by a body with administrative or judicial jurisdiction.' },
  { term: 'Xenophobia', definition: 'Dislike of or prejudice against people from other countries.' },
  { term: 'Xerox', definition: 'To make a copy of a document using a photocopier.' },
  { term: 'Yield', definition: 'To give way to arguments, demands, or pressure.' },
  { term: 'Yielding', definition: 'Giving way to arguments, demands, or pressure.' },
  { term: 'Zealous', definition: 'Having or showing zeal; passionate.' },
  { term: 'Zoning', definition: 'The process of dividing land into zones for different uses.' },
  { term: 'Zoning Laws', definition: 'Regulations governing land use and development.' }
];

export const drafts = [
  {
    title: "Rental Agreement",
    description: "A standard rental agreement between landlord and tenant.",
    category: "Real Estate",
    link: "/drafts/rental-agreement"
  },
  {
    title: "Power of Attorney",
    description: "Document granting legal authority to act on someone's behalf.",
    category: "Personal",
    link: "/drafts/power-of-attorney"
  },
  {
    title: "Business Partnership Deed",
    description: "Outlines partnership terms and conditions for business.",
    category: "Business",
    link: "/drafts/partnership-deed"
  },
  {
    title: "Employment Contract",
    description: "A standard employment agreement between employer and employee.",
    category: "Business",
    link: "/drafts/employment-contract"
  },
  {
    title: "Sale Deed",
    description: "A legal document for the sale and transfer of property ownership.",
    category: "Real Estate",
    link: "/drafts/sale-deed"
  },
  {
    title: "Gift Deed",
    description: "Transfer of ownership of movable or immovable property as a gift.",
    category: "Personal",
    link: "/drafts/gift-deed"
  },
  {
    title: "Affidavit",
    description: "A sworn statement of facts, used in legal proceedings.",
    category: "Civil",
    link: "/drafts/affidavit"
  },
  {
    title: "Non-Disclosure Agreement (NDA)",
    description: "Protects confidential business information shared between parties.",
    category: "Business",
    link: "/drafts/nda"
  },
  {
    title: "Will",
    description: "Outlines how a person's assets should be distributed after death.",
    category: "Personal",
    link: "/drafts/will"
  },
  {
    title: "Tenancy Termination Notice",
    description: "Notice for ending a tenancy agreement by landlord or tenant.",
    category: "Real Estate",
    link: "/drafts/tenancy-termination"
  },
  {
    title: "Divorce Petition",
    description: "Legal draft to initiate the process of divorce in court.",
    category: "Family",
    link: "/drafts/divorce-petition"
  },
  {
    title: "Child Custody Agreement",
    description: "Outlines custody arrangements post-divorce or separation.",
    category: "Family",
    link: "/drafts/child-custody"
  },
  {
    title: "Maintenance Agreement",
    description: "Agreement for monthly maintenance or alimony payments.",
    category: "Family",
    link: "/drafts/maintenance-agreement"
  },
  {
    title: "Vehicle Sale Agreement",
    description: "Legal document for sale and purchase of a vehicle.",
    category: "Personal",
    link: "/drafts/vehicle-sale"
  },
  {
    title: "Internship Agreement",
    description: "Outlines rights and responsibilities for internships.",
    category: "Business",
    link: "/drafts/internship-agreement"
  },
  {
    title: "Consultancy Agreement",
    description: "Outlines the scope and terms of consultancy services.",
    category: "Business",
    link: "/drafts/consultancy-agreement"
  },
  {
    title: "Freelancer Agreement",
    description: "Protects terms between freelancers and clients.",
    category: "Business",
    link: "/drafts/freelancer-agreement"
  },
  {
    title: "Loan Agreement",
    description: "Agreement outlining terms of a personal or business loan.",
    category: "Finance",
    link: "/drafts/loan-agreement"
  },
  {
    title: "Part-Time Employment Contract",
    description: "Terms and responsibilities for part-time workers.",
    category: "Business",
    link: "/drafts/parttime-employment"
  },
  {
    title: "Complaint to Police",
    description: "Basic format for registering a police complaint (FIR application).",
    category: "Criminal",
    link: "/drafts/police-complaint"
  },
  {
    title: "Mutual Consent Divorce Deed",
    description: "Deed for mutually agreed divorce under Muslim Family Law.",
    category: "Family",
    link: "/drafts/mutual-divorce"
  },
  {
    title: "Property Lease Agreement",
    description: "Outlines lease terms for commercial or residential properties.",
    category: "Real Estate",
    link: "/drafts/property-lease"
  },
  {
    title: "Cease and Desist Notice",
    description: "Legal notice to stop illegal or harmful activities.",
    category: "Civil",
    link: "/drafts/cease-and-desist"
  },
  {
    title: "Service Level Agreement (SLA)",
    description: "Defines service expectations and obligations for clients.",
    category: "Business",
    link: "/drafts/sla"
  }
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
