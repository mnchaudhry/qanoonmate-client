"use client";

import React, { useMemo, useState } from 'react';
import {
  FileText,
  BookOpen,
  MessageSquareText,
  ArchiveRestore,
  Sparkles,
  Wand2,
  FileOutput,
  ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Upload from '@/components/ui/upload';
import SectionHeading from './SectionHeading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type SummaryModeKey = 'act' | 'case' | 'document' | 'topic';

const MODES: Array<{
  key: SummaryModeKey;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>
  examples: string[];
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
  },
];

const LegalSummaries: React.FC = () => {
  const [active, setActive] = useState<SummaryModeKey>('act');
  const [query, setQuery] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const activeMode = useMemo(() => MODES.find(m => m.key === active)!, [active]);

  const handleExampleClick = (text: string) => {
    setQuery(text);
  };

  const handleSummarize = async () => {
    setLoading(true);
    // Placeholder action; wire to your API later
    await new Promise(res => setTimeout(res, 700));
    setResult(
      `Preview summary for “${query || 'Sample'}”.` +
        (active === 'document' && files.length ? ` Processed ${files.length} file(s).` : '')
    );
    setLoading(false);
  };

  const handleClear = () => {
    setQuery('');
    setFiles([]);
    setResult('');
  };

  return (
    <section className="bg-surface relative">
      <div className="container px-4 mx-auto max-w-7xl md:px-6">
        <SectionHeading
          title="AI-GENERATED LEGAL SUMMARIES"
          topTitle="Legal complexity simplified through smart summaries"
          description="Break down acts, case laws, legal documents, and broad legal topics into concise, readable insights. Start with an example or type your own prompt."
        />

        {/* Studio Shell */}
        <div className="bg-neutral rounded-xl border !border-border shadow-sm p-4 md:p-6">
          <Tabs value={active} onValueChange={(v) => setActive(v as SummaryModeKey)}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <TabsList>
                {MODES.map(({ key, title, icon: Icon }) => (
                  <TabsTrigger key={key} value={key} className="gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="hidden md:flex items-center gap-3 text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">Fast previews. No account needed.</span>
              </div>
            </div>

            {MODES.map((mode) => (
              <TabsContent key={mode.key} value={mode.key} className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left: Prompt + Examples + (Upload) */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{mode.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{mode.description}</p>
                    </div>

                    {/* Examples */}
                    <div className="flex flex-wrap gap-2">
                      {mode.examples.map((ex, i) => (
                        <button
                          key={i}
                          onClick={() => handleExampleClick(ex)}
                          className="text-xs px-3 py-1 rounded-md bg-muted text-foreground hover:opacity-90 transition"
                        >
                          {ex}
                        </button>
                      ))}
                    </div>

                    {/* Query */}
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Your prompt</label>
                      <Textarea
                        value={active === mode.key ? query : ''}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type your question or paste text to summarize..."
                        className="min-h-28"
                      />
                    </div>

                    {/* Upload only for Document Analysis */}
                    {mode.key === 'document' && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Upload document</label>
                        <Upload multiple value={files} onChange={setFiles} className="" />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-1">
                      <Button onClick={handleSummarize} disabled={loading || (!query && mode.key !== 'document')}>
                        <Wand2 className="h-4 w-4 mr-2" />
                        {loading ? 'Summarizing…' : 'Summarize'}
                      </Button>
                      <Button variant="ghost" onClick={handleClear} disabled={loading}>
                        Clear
                      </Button>
                      <Link href="../summarizers" className="ml-auto">
                        <Button variant="secondary">
                          <FileOutput className="h-4 w-4 mr-2" />
                          Open full tool
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Right: Preview */}
                  <div className="bg-background border rounded-lg p-4 md:p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium text-foreground">Preview</div>
                      <span className="text-xs text-muted-foreground">{activeMode.title}</span>
                    </div>
                    <div className="min-h-40">
                      {loading ? (
                        <div className="space-y-3 animate-pulse">
                          <div className="h-4 bg-muted rounded w-2/3" />
                          <div className="h-3 bg-muted rounded w-full" />
                          <div className="h-3 bg-muted rounded w-5/6" />
                          <div className="h-3 bg-muted rounded w-4/6" />
                        </div>
                      ) : result ? (
                        <div className="text-sm leading-6 text-foreground whitespace-pre-wrap">{result}</div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No summary yet. Pick an example or enter a prompt, then press Summarize.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <FeatureItem
            title="Download & Save"
            description="Save summaries to your profile or download as PDF for later use."
          />
          <FeatureItem
            title="Knowledge Integration"
            description="Trigger summaries contextually from the Legal Knowledge Base."
          />
          <FeatureItem
            title="Structured Outputs"
            description="Clear sections: overview, key points, citations, and actions."
          />
        </div>

        {/* Disclaimer */}
        <div className="mt-8">
          <Alert className="bg-muted">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Disclaimer</AlertTitle>
            <AlertDescription>
              AI summaries are not a replacement for professional legal consultation. Use with caution, especially for sensitive matters. Incorrect or misleading content can be reported for review.
            </AlertDescription>
          </Alert>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="../summarizers">
            <Button>Explore Legal Summaries</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LegalSummaries;

const FeatureItem = ({ title, description }: { title: string; description: string }) => (
  <div className="bg-neutral border rounded-lg p-5">
    <h4 className="font-semibold text-foreground mb-1">{title}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);
