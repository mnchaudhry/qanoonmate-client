'use client'

import React from 'react'
import { cn } from '@/lib/utils'

const summaryTypes = [
    {
        type: 'act',
        title: 'Act Summary',
        description: 'Get simplified breakdowns of acts with section-wise insights.',
    },
    {
        type: 'case',
        title: 'Case Law Summary',
        description: 'Summarize judgments, reasoning, and legal implications.',
    },
    {
        type: 'document',
        title: 'Document Summary',
        description: 'Upload legal docs and get AI-generated summaries.',
    },
    {
        type: 'topic',
        title: 'Legal Topic Explanation',
        description: 'Understand complex topics like Succession Law or Property Transfer.',
    },
]

const SummaryTypeSelector = ({
    selectedType,
    setSelectedType,
}: {
    selectedType: string | null
    setSelectedType: (type: string) => void
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {summaryTypes.map((item) => (
                <button
                    key={item.type}
                    onClick={() => setSelectedType(item.type)}
                    className={cn(
                        'text-left border rounded-xl p-5 transition shadow-sm hover:border-primary hover:shadow-md',
                        selectedType === item.type && 'border-primary bg-primary/5'
                    )}
                >
                    <h4 className="text-lg font-semibold">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                </button>
            ))}
        </div>
    )
}

export default SummaryTypeSelector
