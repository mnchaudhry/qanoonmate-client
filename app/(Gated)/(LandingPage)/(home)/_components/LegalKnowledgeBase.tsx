"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import SectionHeading from './SectionHeading'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import {
  BookText,
  Scale,
  BookOpenCheck,
  FileText,
  Lightbulb,
  MessageSquare,
  Search,
  ArrowRight,
} from 'lucide-react'

type Category = {
  key: string
  title: string
  description: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  image?: string
}

const CATEGORIES: Category[] = [
  {
    key: 'acts',
    title: 'Acts & Statutes',
    description:
      'Categorized national laws and legislative acts with concise summaries and amendments.',
    href: '/knowledgebase/acts',
    icon: BookText,
    image: '/Pictures/instantlegalconsult.jpg',
  },
  {
    key: 'case-laws',
    title: 'Case Laws',
    description:
      'Landmark judgments and indexed decisions from High Courts and Supreme Court.',
    href: '/knowledgebase/case-laws',
    icon: Scale,
    image: '/Pictures/docanalysis.jpg',
  },
  {
    key: 'guides',
    title: 'Legal Guides',
    description:
      'Step‑by‑step explainers that simplify complex legal topics for quick grasp.',
    href: '/knowledgebase/guides',
    icon: Lightbulb,
    image: '/Pictures/aipow.jpg',
  },
  {
    key: 'dictionary',
    title: 'Dictionary',
    description:
      'Plain‑language definitions of legal terms with examples and related concepts.',
    href: '/knowledgebase/dictionary',
    icon: BookOpenCheck,
    image: '/Pictures/about.jpg',
  },
  {
    key: 'drafts',
    title: 'Draft Templates',
    description:
      'Ready‑to‑use petition, contract, and application templates with guidance.',
    href: '/knowledgebase/drafts',
    icon: FileText,
    image: '/Pictures/docanalysis.jpg',
  },
  {
    key: 'faqs',
    title: 'FAQs',
    description: 'Frequently asked questions distilled by topic and audience.',
    href: '/knowledgebase/faqs',
    icon: MessageSquare,
    image: '/Pictures/lawyerconnection.jpg',
  },
]

function CategoryCard({ category }: { category: Category }) {
  const Icon = category.icon
  return (
    <Card className="group overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/20">
      <div className="relative h-32 sm:h-40 w-full overflow-hidden">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/30 to-transparent" />
      </div>
      <CardHeader className="pb-3 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
          </span>
          <CardTitle className="text-base sm:text-lg leading-tight">{category.title}</CardTitle>
        </div>
        <CardDescription className="mt-2 text-sm leading-relaxed">{category.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="flex items-center justify-between">
          <Link
            href={category.href}
            className="inline-flex items-center gap-1 text-primary hover:text-primary/90 text-sm"
            aria-label={`Browse ${category.title}`}
          >
            Browse
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Link>
          <Badge variant="outline" className="text-xs">Updated</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card px-3 sm:px-4 py-3 shadow-sm">
      <span className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md bg-primary/10 text-primary flex-shrink-0">
        <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
        <div className="text-base sm:text-lg font-semibold truncate">{value}</div>
      </div>
    </div>
  )
}

const LegalKnowledgeBase: React.FC = () => {
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const [active, setActive] = React.useState<string>('all')

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = query.trim()
    const target = active === 'all' ? '/knowledgebase' : `/knowledgebase/${active}`
    const href = trimmed ? `${target}?q=${encodeURIComponent(trimmed)}` : target
    router.push(href)
  }

  return (
    <section className="bg-neutral">
      <div className="container px-4 mx-auto max-w-7xl md:px-6">
        <SectionHeading
          title="Legal Knowledge Base"
          topTitle="Your Legal Resource Hub — Simplified"
          description="Dive into curated acts, judgments, templates, guides, and definitions. Built for students, professionals, and the legally curious."
        />

        {/* Search + Category selector */}
        <div className="mb-8 sm:mb-12">
          <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-secondary to-secondary/70 p-4 md:p-6">
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

            <Tabs value={active} onValueChange={setActive}>
              <div className="flex flex-col gap-4">
                {/* Scrollable tabs on mobile */}
                <div className="relative">
                  <TabsList className="flex w-full overflow-x-auto no-scrollbar gap-1 sm:gap-2 rounded-lg bg-background/60 p-1.5 shadow-sm backdrop-blur">
                    <TabsTrigger 
                      value="all" 
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap flex-shrink-0 px-2 sm:px-3 py-1.5 text-sm"
                    >
                      All
                    </TabsTrigger>
                    {CATEGORIES.map((c) => (
                      <TabsTrigger
                        key={c.key}
                        value={c.key}
                        className="whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 px-2 sm:px-3 py-1.5 text-sm"
                      >
                        <span className="hidden sm:inline">{c.title}</span>
                        <span className="sm:hidden capitalize">{c.key}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {/* Overflow indicators for mobile */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-secondary to-transparent rounded-l-lg sm:hidden" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-secondary to-transparent rounded-r-lg sm:hidden" />
                </div>

                <form onSubmit={onSearch} className="flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search acts, judgments, guides, drafts, terms…"
                      aria-label="Search knowledge base"
                      className="h-11 md:h-12 rounded-md pl-9 pr-3"
                    />
                  </div>
                  <Button type="submit" className="h-11 md:h-12 px-4 sm:px-5 flex-shrink-0">
                    <span className="hidden sm:inline">Search</span>
                    <span className="sm:hidden">Go</span>
                  </Button>
                </form>
              </div>

              {/* We do not need tab-specific content here; the tab selection only filters navigation */}
              <TabsContent value="all" />
              {CATEGORIES.map((c) => (
                <TabsContent key={c.key} value={c.key} />
              ))}
            </Tabs>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 sm:mb-12 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
          <Stat label="Expert‑curated" value="Quality checked" icon={Lightbulb} />
          <Stat label="Categories" value={`${CATEGORIES.length}+ areas`} icon={BookOpenCheck} />
          <Stat label="AI‑ready summaries" value="Fast comprehension" icon={Search} />
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.key} category={cat} />
          ))}
        </div>

        {/* Callouts */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-primary/10">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">Not sure where to start?</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Explore everything in one place. Filter by category, topic, or query on the main knowledgebase page.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button asChild variant="outline" className="shadow-sm w-full sm:w-auto">
                <Link href="/knowledgebase" aria-label="Browse all knowledgebase">
                  Browse all
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <MessageSquare className="h-4 w-4" /> Need help?
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">Ask our AI assistant or consult a lawyer.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-2 pt-0">
              <Button asChild size="sm" variant="secondary" className="w-full sm:w-auto">
                <Link href="/chatbot" aria-label="Open AI legal assistant">AI Assistant</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="shadow-sm w-full sm:w-auto">
                <Link href="/lawyers" aria-label="Find a lawyer">Find a Lawyer</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default LegalKnowledgeBase


