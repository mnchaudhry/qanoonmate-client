"use client";

import React, { useState } from 'react';
import { FileText, BookOpen, MessageSquareText, ArchiveRestore, Sparkles, Wand2, ShieldAlert, ArrowRight, Play, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SectionHeading from './SectionHeading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

type SummaryModeKey = 'act' | 'case' | 'document' | 'topic';

const MODES: Array<{
  key: SummaryModeKey;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>
  examples: string[];
  features: string[];
  color: string;
}> = [
    {
      key: 'act',
      title: 'Act & Section Summaries',
      description: 'Get structured, plain‑language summaries of Acts and their Sections with key points, penalties, and practical use.',
      icon: BookOpen,
      examples: [
        'Summarize Section 489‑F PPC with key penalties',
        'Outline the objectives of the Code of Civil Procedure',
        'What are exceptions in Section 97 of QSO?',
      ],
      features: [
        'Section-by-section breakdown',
        'Key penalties and punishments',
        'Practical application examples',
        'Cross-references to related laws'
      ],
      color: 'from-primary to-muted-foreground'
    },
    {
      key: 'case',
      title: 'Case Law Judgement Breakdown',
      description: 'Digest holdings, ratio decidendi, citations, and implications for litigation strategy.',
      icon: MessageSquareText,
      examples: [
        'Break down PLD 2020 SC 1 (key holdings)',
        'Summarize a 2021 IHC bail decision with reasoning',
        'List precedents cited in a 2019 LHC property dispute',
      ],
      features: [
        'Key legal principles extracted',
        'Precedent analysis',
        'Litigation strategy insights',
        'Citation management'
      ],
      color: 'from-foreground to-primary/70'
    },
    {
      key: 'document',
      title: 'Document Analysis',
      description: 'Upload a legal document and receive a concise summary with parties, issues, and action items.',
      icon: FileText,
      examples: [
        'Summarize this sale agreement into 5 bullet points',
        'Extract parties, dates, and obligations from this draft',
        'Is there any unusual clause I should know?',
      ],
      features: [
        'Document structure analysis',
        'Key clause identification',
        'Risk assessment',
        'Action item extraction'
      ],
      color: 'from-primary-dark to-primary/30'
    },
    {
      key: 'topic',
      title: 'Topic Explanations',
      description: 'Deep dives into topics like Succession, Property Transfer, Contracts, Evidence, and more.',
      icon: ArchiveRestore,
      examples: [
        'Explain the basics of Muslim inheritance shares',
        'How does specific performance work in Pakistan?',
        'What is the limitation for a recovery suit?',
      ],
      features: [
        'Comprehensive topic coverage',
        'Step-by-step procedures',
        'Common pitfalls and solutions',
        'Related legal concepts'
      ],
      color: 'from-primary/80 to-accent'
    },
  ];

const LegalSummaries: React.FC = () => {
  const [active, setActive] = useState<SummaryModeKey>('act');
  const router = useRouter();

  const handleNavigateToSummarizer = () => {
    // Navigate to the summarizer page with the current mode pre-selected
    const searchParams = new URLSearchParams();
    searchParams.set('mode', active);
    router.push(`/summarizers?${searchParams.toString()}`);
  };

  const handleTryExample = (example: string) => {
    // Navigate to summarizer with pre-filled example
    const searchParams = new URLSearchParams();
    searchParams.set('mode', active);
    searchParams.set('example', encodeURIComponent(example));
    router.push(`/summarizers?${searchParams.toString()}`);
  };

  return (
    <section className="bg-surface relative">
      <div className="container px-4 mx-auto max-w-7xl md:px-6">
        <SectionHeading
          title="AI-GENERATED LEGAL SUMMARIES"
          topTitle="Legal complexity simplified through smart summaries"
          description="Break down acts, case laws, legal documents, and broad legal topics into concise, readable insights. Experience the power of AI-driven legal analysis."
        />

        {/* Studio Shell */}
        <div className="bg-neutral rounded-xl border !border-border shadow-sm p-4 md:p-6">
          <Tabs value={active} onValueChange={(v) => setActive(v as SummaryModeKey)}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <TabsList className="grid w-full grid-cols-4">
                {MODES.map(({ key, title, icon: Icon }) => (
                  <TabsTrigger key={key} value={key} className="gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="hidden sm:inline">{title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="hidden md:flex items-center gap-3 text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">Click any example to try it live</span>
              </div>
            </div>

            {MODES.map((mode) => (
              <TabsContent key={mode.key} value={mode.key} className="mt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left: Description + Examples */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">{mode.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{mode.description}</p>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">What you&apos;ll get:</h4>
                      <div className="space-y-2">
                        {mode.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Examples */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Try these examples:</h4>
                      <div className="space-y-2">
                        {mode.examples.map((ex, i) => (
                          <button
                            key={i}
                            onClick={() => handleTryExample(ex)}
                            className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                                {ex}
                              </span>
                              <Play className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Preview Card */}
                  <div className="relative">
                    <Card className="h-full border-0 shadow-lg">
                      <CardHeader className={`bg-gradient-to-br ${mode.color} text-white rounded-t-lg`}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <mode.icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-white">{mode.title}</CardTitle>
                            <p className="text-white/80 text-sm">AI-Powered Analysis</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                              <Wand2 className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h4 className="font-medium text-foreground mb-2">Interactive Preview</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              Click any example above to see this tool in action
                            </p>
                            <Button
                              onClick={handleNavigateToSummarizer}
                              className="w-full"
                              variant="outline"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open Full Tool
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6 border-0 bg-background/50">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">AI-Powered</h4>
            <p className="text-sm text-muted-foreground">
              Advanced AI trained on Pakistani legal system for accurate, contextual summaries
            </p>
          </Card>

          <Card className="text-center p-6 border-0 bg-background/50">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Multiple Formats</h4>
            <p className="text-sm text-muted-foreground">
              Get summaries in bullet points, paragraphs, or structured formats based on your needs
            </p>
          </Card>

          <Card className="text-center p-6 border-0 bg-background/50">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Secure & Private</h4>
            <p className="text-sm text-muted-foreground">
              Your legal documents and queries are encrypted and never shared with third parties
            </p>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="mt-12">
          <Alert className="bg-muted">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Disclaimer</AlertTitle>
            <AlertDescription>
              AI summaries are not a replacement for professional legal consultation. Use with caution, especially for sensitive matters. Incorrect or misleading content can be reported for review.
            </AlertDescription>
          </Alert>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Transform Your Legal Research Today
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of legal professionals who trust our AI summarizer for quick, accurate, and reliable legal insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleNavigateToSummarizer}
                className="flex items-center gap-2 px-8 py-3"
              >
                <Wand2 className="h-5 w-5" />
                Start Using Summarizer
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Link href="/summarizers#pricing">
                <Button variant="outline" size="lg" className="px-8 py-3">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalSummaries;
