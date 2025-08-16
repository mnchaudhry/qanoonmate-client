import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { uploadDocument, createSummary, clearError } from '@/store/reducers/summarySlice'
import { useSocketContext } from '@/context/useSocketContext'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'

interface DropboxProps {
    selectedType: string
    isGenerating: boolean
    setIsGenerating: Dispatch<SetStateAction<boolean>>
}

const Dropbox = ({ selectedType, isGenerating, setIsGenerating }: DropboxProps) => {

    /////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////
    const dispatch = useDispatch<AppDispatch>()
    const { error, currentSummary, progress, streamingSummary } = useSelector((state: RootState) => state.summary)
    const { defaultSocket } = useSocketContext()

    /////////////////////////////////////////////// STATES /////////////////////////////////////////////////////
    const [input, setInput] = useState('')
    const [file, setFile] = useState<File | null>(null)

    /////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////////
    // Handle real-time summary updates
    useEffect(() => {
        if (currentSummary) {
            if (currentSummary.status === 'completed') {
                setIsGenerating(false)
                toast.success('Summary generated successfully!')
            } else if (currentSummary.status === 'failed') {
                setIsGenerating(false)
                toast.error(currentSummary.error || 'Failed to generate summary')
            }
        }
    }, [currentSummary, setIsGenerating])

    // Handle errors
    useEffect(() => {
        if (error) {
            toast.error(error)
            dispatch(clearError())
        }
    }, [error, dispatch])

    /////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////
    const handleFileUpload = async () => {
        if (!file) {
            toast.error('Please select a file to upload')
            return
        }

        setIsGenerating(true)

        try {
            const formData = new FormData()
            formData.append('document', file)
            formData.append('title', file.name)
            formData.append('language', 'en')
            formData.append('settings', JSON.stringify({
                format: 'structured',
                includeKeywords: true,
                includeTopics: true
            }))

            await dispatch(uploadDocument(formData))
            toast.success('Document uploaded successfully! Processing started...')
        } catch (error) {
            console.error('Upload error:', error)
            setIsGenerating(false)
        }
    }

    const handleTextSummary = async () => {
        if (!input.trim()) {
            toast.error('Please enter some text to summarize')
            return
        }

        setIsGenerating(true)

        try {
            const summaryData = {
                type: 'text',
                title: `Summary of ${input.substring(0, 50)}...`,
                content: input,
                language: 'en',
                settings: {
                    format: 'structured',
                    includeKeywords: true,
                    includeTopics: true
                }
            }

            await dispatch(createSummary(summaryData)).unwrap()
            toast.success('Summary creation started!')
        } catch (error) {
            console.error('Summary creation error:', error)
            setIsGenerating(false)
        }
    }

    const handleGenerate = async () => {
        if (!input.trim() && !file) {
            toast.error('Please enter a query or upload a file')
            return
        }

        if (file) {
            await handleFileUpload()
        } else {
            await handleTextSummary()
        }
    }

    const getPlaceholder = () => {
        const placeholders = {
            act: "e.g. Summarize the Right to Property Act of 1978...",
            case: "e.g. Summarize the case of Smith v. State regarding property rights...",
            document: "e.g. Upload a legal document for AI analysis...",
            topic: "e.g. Explain the concept of Property Transfer Law..."
        }
        return placeholders[selectedType as keyof typeof placeholders] || placeholders.topic
    }

    /////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////
    return (
        <div className="bg-card p-6 rounded-xl border shadow-sm mx-auto space-y-6">
            <h4 className="text-lg font-semibold text-foreground">
                {selectedType === 'act' && 'Enter Act Details'}
                {selectedType === 'case' && 'Enter Case Information'}
                {selectedType === 'document' && 'Upload Document or Enter Query'}
                {selectedType === 'topic' && 'Enter Legal Topic'}
            </h4>

            <div className="space-y-4">
                {/* Progress Bar */}
                {progress > 0 && progress < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div className="bg-green-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                )}
                {/* Streaming Spinner */}
                {streamingSummary && progress < 100 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span className="animate-spin h-4 w-4 border-b-2 border-green-500 rounded-full"></span>
                        Generating summary...
                    </div>
                )}
                {/* Input field for query */}
                <Textarea
                    placeholder={getPlaceholder()}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[120px] p-4 text-sm placeholder:text-muted-foreground border border-muted/50 focus:ring-2 focus:ring-primary focus:outline-none"
                    disabled={isGenerating || file ? true : false}
                />

                {/* File upload */}
                <div className="flex flex-col gap-4">
                    <Input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="border border-muted/50 text-sm text-muted-foreground file:border-0 file:bg-muted file:text-foreground focus:ring-2 focus:ring-primary"
                        disabled={isGenerating}
                        accept=".pdf,.doc,.docx,.txt"
                    />

                    {/* Socket connection status */}
                    <div className="flex items-center gap-2 text-xs">
                        <div className={`w-2 h-2 rounded-full ${defaultSocket.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-muted-foreground">
                            {defaultSocket.isConnected
                                ? defaultSocket.isAuthenticated
                                    ? 'Real-time updates connected and authenticated'
                                    : 'Connecting to real-time updates...'
                                : 'Connecting to real-time updates...'
                            }
                        </span>
                    </div>

                    {/* Generate button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || (!input.trim() && !file)}
                        className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-6 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Generating Summary...
                            </div>
                        ) : (
                            'Generate Summary'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Dropbox
