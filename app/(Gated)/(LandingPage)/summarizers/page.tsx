'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import { AppDispatch, RootState } from '@/store/store'
import { fetchUserSummaries, fetchSummaryStats, clearCurrentSummary } from '@/store/reducers/summarySlice'
import LandingPageHeader from '../_components/LandingPageHeader'
import SummarizerSidebar from './_components/SummarizerSidebar'
import Summary from './_components/Summary'
import Dropbox from './_components/Dropbox'
import EmptyState from './_components/EmptyState'
import { ScrollText, Gavel, FileText, BookOpenText } from 'lucide-react'

const Summarizers = () => {

    /////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////
    const dispatch = useDispatch<AppDispatch>()
    const { stats, currentSummary } = useSelector((state: RootState) => state.summary)
    const searchParams = useSearchParams()

    /////////////////////////////////////////////// STATES /////////////////////////////////////////////////////
    const [selectedType, setSelectedType] = useState('act')
    const [isGenerating, setIsGenerating] = useState(false)
    const [initialExample, setInitialExample] = useState('')

    /////////////////////////////////////////////// USE EFFECTS //////////////////////////////////////////////////
    useEffect(() => {
        dispatch(fetchUserSummaries({}))
        dispatch(fetchSummaryStats())
    }, [dispatch])

    // Extract URL parameters on component mount
    useEffect(() => {
        const mode = searchParams.get('mode')
        const example = searchParams.get('example')
        
        if (mode && ['act', 'case', 'document', 'topic'].includes(mode)) {
            setSelectedType(mode)
        }
        
        if (example) {
            setInitialExample(decodeURIComponent(example))
        }
    }, [searchParams])

    /////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////
    const handleTypeChange = (type: string) => {
        setSelectedType(type)
        dispatch(clearCurrentSummary())
    }

    /////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////
    return (
        <section className="relative bg-background antialiased min-h-screen !pt-0">
            <LandingPageHeader
                title="Legal AI Summarizers"
                description="Discover our AI-powered summarizers that condense complex legal documents into concise, easy-to-understand summaries. Save time and enhance your understanding of legal texts."
            />

            <div className="container mx-auto">
                {/* Mobile type selector chips */}
                <div className="px-4 md:px-6 py-4 md:hidden">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <button onClick={() => handleTypeChange('act')} className={`flex items-center gap-2 px-2 py-1 rounded-lg border whitespace-nowrap ${selectedType==='act'?'bg-primary/10 border-primary text-primary':'border-border'}`}>
                      <ScrollText className="w-4 h-4" /> Act
                    </button>
                    <button onClick={() => handleTypeChange('case')} className={`flex items-center gap-2 px-2 py-1 rounded-lg border whitespace-nowrap ${selectedType==='case'?'bg-primary/10 border-primary text-primary':'border-border'}`}>
                      <Gavel className="w-4 h-4" /> Case
                    </button>
                    <button onClick={() => handleTypeChange('document')} className={`flex items-center gap-2 px-2 py-1 rounded-lg border whitespace-nowrap ${selectedType==='document'?'bg-primary/10 border-primary text-primary':'border-border'}`}>
                      <FileText className="w-4 h-4" /> Document
                    </button>
                    <button onClick={() => handleTypeChange('topic')} className={`flex items-center gap-2 px-2 py-1 rounded-lg border whitespace-nowrap ${selectedType==='topic'?'bg-primary/10 border-primary text-primary':'border-border'}`}>
                      <BookOpenText className="w-4 h-4" /> Topic
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 md:px-6 py-8">
                    <div className="hidden lg:block lg:col-span-1">
                        <SummarizerSidebar
                            selectedType={selectedType}
                            onTypeChange={handleTypeChange}
                            stats={stats}
                        />
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                        <Dropbox
                            selectedType={selectedType}
                            isGenerating={isGenerating}
                            setIsGenerating={setIsGenerating}
                            initialExample={initialExample}
                        />

                        {!currentSummary ? (
                            <EmptyState selectedType={selectedType} />
                        ) : (
                            <Summary selectedType={selectedType} />
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Summarizers
