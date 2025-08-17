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
      <div className="relative h-40 w-full overflow-hidden">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/30 to-transparent" />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </span>
          <CardTitle className="text-lg">{category.title}</CardTitle>
        </div>
        <CardDescription className="mt-2">{category.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Link
            href={category.href}
            className="inline-flex items-center gap-1 text-primary hover:text-primary/90"
            aria-label={`Browse ${category.title}`}
          >
            Browse
            <ArrowRight className="h-4 w-4" />
        </Link>
          <Badge variant="outline">Updated</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-sm">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
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
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-secondary to-secondary/70 p-4 md:p-6">
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

            <Tabs value={active} onValueChange={setActive}>
              <div className="flex flex-col gap-4">
                <TabsList className="w-full justify-start rounded-lg bg-background/60 p-1.5 shadow-sm backdrop-blur">
                  <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All</TabsTrigger>
                  {CATEGORIES.map((c) => (
                    <TabsTrigger
                      key={c.key}
                      value={c.key}
                      className="whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {c.title}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <form onSubmit={onSearch} className="flex w-full items-center gap-3">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search acts, judgments, guides, drafts, terms…"
                      aria-label="Search knowledge base"
                      className="h-11 md:h-12 rounded-md pl-9"
                    />
                  </div>
                  <Button type="submit" className="h-11 md:h-12 px-5">Search</Button>
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
        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Stat label="Expert‑curated" value="Quality checked" icon={Lightbulb} />
          <Stat label="Categories" value={`${CATEGORIES.length}+ areas`} icon={BookOpenCheck} />
          <Stat label="AI‑ready summaries" value="Fast comprehension" icon={Search} />
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.key} category={cat} />
          ))}
        </div>

        {/* Callouts */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-primary/10">
            <CardHeader>
              <CardTitle>Not sure where to start?</CardTitle>
              <CardDescription>
                Explore everything in one place. Filter by category, topic, or query on the main knowledgebase page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="shadow-sm">
                <Link href="/knowledgebase" aria-label="Browse all knowledgebase">
                  Browse all
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4" /> Need help?
              </CardTitle>
              <CardDescription>Ask our AI assistant or consult a lawyer.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button asChild size="sm" variant="secondary">
                <Link href="/chatbot" aria-label="Open AI legal assistant">AI Assistant</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="shadow-sm">
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


