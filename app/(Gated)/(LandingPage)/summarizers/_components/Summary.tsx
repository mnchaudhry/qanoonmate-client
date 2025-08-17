import { Button } from '@/components/ui/button'
import { RootState } from '@/store/store'
import { AlertCircle, Download, ThumbsDown, ThumbsUp, Copy, Check } from 'lucide-react'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'

interface SummaryProps {
    selectedType: string
}

const Summary = ({ selectedType }: SummaryProps) => {

    /////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////
    const { currentSummary, streamingSummary } = useSelector((state: RootState) => state.summary)

    /////////////////////////////////////////////// STATES ///////////////////////////////////////////////
    const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null)
    const [isCopied, setIsCopied] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)

    /////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////
    const handleFeedback = (type: 'helpful' | 'not-helpful') => {
        setFeedback(type)
        // In a real app, this would send feedback to the backend
    }

    const handleCopy = async () => {
        if (!currentSummary) return
        try {
            await navigator.clipboard.writeText(currentSummary?.summary || '')
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy text', err)
        }
    }

    const handleDownload = async () => {
        if (!currentSummary) return
        setIsDownloading(true)

        // Simulate download delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Create and download the file
        const blob = new Blob([currentSummary?.summary || ''], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${selectedType}_summary_${new Date().toISOString().split('T')[0]}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        setIsDownloading(false)
    }

    const getTypeIcon = () => {
        const icons = {
            act: '📋',
            case: '⚖️',
            document: '📄',
            topic: '📚'
        }
        return icons[selectedType as keyof typeof icons] || '📄'
    }

    /////////////////////////////////////////////// RENDER ///////////////////////////////////////////////
    return (
        <div className="bg-muted/20 border border-muted rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{getTypeIcon()}</span>
                <h4 className="text-lg font-semibold text-foreground">
                    {selectedType === 'act' && 'Act Summary'}
                    {selectedType === 'case' && 'Case Law Summary'}
                    {selectedType === 'document' && 'Document Summary'}
                    {selectedType === 'topic' && 'Legal Topic Explanation'}
                </h4>
            </div>

            <div className="bg-background border rounded-lg p-4 mb-4">
                <div className="chat-markdown prose prose-sm max-w-none text-muted-foreground font-sans leading-relaxed">
                    <ReactMarkdown>
                        {streamingSummary || currentSummary?.summary || currentSummary?.content || 'No summary available'}
                    </ReactMarkdown>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 justify-between">
                <div className="flex gap-3 items-center text-sm text-muted-foreground">
                    <span className="font-medium">Was this helpful?</span>
                    <div className="space-x-1">
                        <button
                            className={`p-2 rounded-full transition ${feedback === 'helpful' ? 'bg-green-100 text-green-600' : 'hover:bg-muted'}`}
                            onClick={() => handleFeedback('helpful')}
                            disabled={feedback !== null}
                        >
                            <ThumbsUp size={16} />
                        </button>
                        <button
                            className={`p-2 rounded-full transition ${feedback === 'not-helpful' ? 'bg-red-100 text-red-600' : 'hover:bg-muted'}`}
                            onClick={() => handleFeedback('not-helpful')}
                            disabled={feedback !== null}
                        >
                            <ThumbsDown size={16} />
                        </button>
                    </div>
                    {feedback && (
                        <span className="text-xs text-green-600">
                            ✓ Feedback recorded
                        </span>
                    )}
                    <Button variant="ghost" size="sm" className="text-red-500">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Report Issue
                    </Button>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="text-blue-600"
                    >
                        {isCopied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                        {isCopied ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="text-green-700"
                    >
                        <Download className="w-4 h-4 mr-1" />
                        {isDownloading ? 'Downloading...' : 'Download as TXT'}
                    </Button>
                    <Button size="sm" className="">
                        Save Summary (Login Required)
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Summary