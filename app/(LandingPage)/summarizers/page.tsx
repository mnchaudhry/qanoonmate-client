'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchUserSummaries, fetchSummaryStats, clearCurrentSummary } from '@/store/reducers/summarySlice'
import LandingPageHeader from '../_components/LandingPageHeader'
import SummarizerSidebar from './_components/SummarizerSidebar'
import Summary from './_components/Summary'
import Dropbox from './_components/Dropbox'
import EmptyState from './_components/EmptyState'
import ProfileButton from '@/components/profile-button'

const Summarizers = () => {

    /////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////
    const dispatch = useDispatch<AppDispatch>()
    const { stats, currentSummary } = useSelector((state: RootState) => state.summary)

    /////////////////////////////////////////////// STATES /////////////////////////////////////////////////////
    const [selectedType, setSelectedType] = useState('act')
    const [isGenerating, setIsGenerating] = useState(false)

    /////////////////////////////////////////////// USE EFFECTS //////////////////////////////////////////////////
    useEffect(() => {
        dispatch(fetchUserSummaries({}))
        dispatch(fetchSummaryStats())
    }, [dispatch])

    /////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////
    const handleTypeChange = (type: string) => {
        setSelectedType(type)
        dispatch(clearCurrentSummary())
    }

    /////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////
    return (
        <section className="relative bg-background antialiased min-h-screen pt-0">
            <LandingPageHeader
                title="Legal AI Summarizers"
                description="Discover our AI-powered summarizers that condense complex legal documents into concise, easy-to-understand summaries. Save time and enhance your understanding of legal texts."
            />
            <ProfileButton />

            <div className="container mx-auto">
                <div className="grid grid-cols-4 gap-6 px-6 py-8">
                    <div className="col-span-1">
                        <SummarizerSidebar
                            selectedType={selectedType}
                            onTypeChange={handleTypeChange}
                            stats={stats}
                        />
                    </div>

                    <div className="col-span-3 space-y-6">
                        <Dropbox
                            selectedType={selectedType}
                            isGenerating={isGenerating}
                            setIsGenerating={setIsGenerating}
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
