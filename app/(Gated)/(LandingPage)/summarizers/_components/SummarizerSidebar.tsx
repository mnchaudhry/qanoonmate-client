import React from 'react'
import { FileText, Gavel, ScrollText, BookOpenText, BarChart3 } from 'lucide-react'

const summarizerTypes = [
    { label: 'Act Summaries', value: 'act', icon: ScrollText },
    { label: 'Case Law Summaries', value: 'case', icon: Gavel },
    { label: 'Document Summaries', value: 'document', icon: FileText },
    { label: 'Topic Explanation', value: 'topic', icon: BookOpenText },
]

interface SummaryStats {
    total: number;
    completed: number;
    processing: number;
    failed: number;
    avgCompressionRatio: number;
    totalOriginalLength: number;
    totalSummaryLength: number;
}

interface SummarizerSidebarProps {
    selectedType: string
    onTypeChange: (type: string) => void
    stats?: SummaryStats | null
}

const SummarizerSidebar = ({ selectedType, onTypeChange, stats }: SummarizerSidebarProps) => {
    return (
        <aside className="sticky top-24 space-y-6 p-4 bg-card rounded-xl border shadow-sm">
            <h4 className="text-xl text-foreground font-semibold mb-4">Summary Types</h4>
            <ul className="space-y-2">
                {summarizerTypes.map((type) => (
                    <li
                        key={type.value}
                        className={`flex items-center gap-2 p-2.5 rounded-md cursor-pointer text-sm hover:bg-muted transition ${selectedType === type.value ? 'bg-muted font-semibold' : ''}`}
                        onClick={() => onTypeChange(type.value)}
                    >
                        <type.icon className="w-4 h-4" />
                        {type.label}
                    </li>
                ))}
            </ul>

            {/* Stats Section */}
            {stats && (
                <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        <h5 className="text-sm font-medium text-foreground">Your Summary Stats</h5>
                    </div>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Summaries:</span>
                            <span className="font-medium">{stats.total}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Completed:</span>
                            <span className="font-medium text-green-600">{stats.completed}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Processing:</span>
                            <span className="font-medium text-blue-600">{stats.processing}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Failed:</span>
                            <span className="font-medium text-red-600">{stats.failed}</span>
                        </div>
                        {stats.avgCompressionRatio > 0 && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg. Compression:</span>
                                <span className="font-medium">{(stats.avgCompressionRatio * 100).toFixed(1)}%</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="pt-4 border-t">
                <h5 className="text-sm font-medium text-foreground mb-2">How it works:</h5>
                <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Enter your query or upload a document</p>
                    <p>• Select the appropriate summary type</p>
                    <p>• Get AI-generated summaries instantly</p>
                    <p>• Download or save your summaries</p>
                </div>
            </div>
        </aside>
    )
}

export default SummarizerSidebar