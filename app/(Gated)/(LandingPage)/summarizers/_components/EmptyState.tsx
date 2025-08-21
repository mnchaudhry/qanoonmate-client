import React from 'react'
import { FileText, Sparkles } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { setCurrentSummary } from '@/store/reducers/summarySlice'

interface EmptyStateProps {
    selectedType: string
}

const EmptyState = ({ selectedType }: EmptyStateProps) => {

    /////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////
    const dispatch = useDispatch<AppDispatch>()
    const { summaries } = useSelector((state: RootState) => state.summary)

    const getEmptyStateMessage = () => {
        const messages = {
            act: {
                title: "No Act Summary Generated",
                description: "Enter an act name or details to get a comprehensive summary with key provisions, important sections, and practical implications."
            },
            case: {
                title: "No Case Law Summary Generated",
                description: "Enter case details to get a detailed summary including facts, legal issues, court decision, and key legal principles."
            },
            document: {
                title: "No Document Summary Generated",
                description: "Upload a legal document or enter a query to get an AI-generated analysis with key findings and recommendations."
            },
            topic: {
                title: "No Topic Explanation Generated",
                description: "Enter a legal topic to get a comprehensive explanation covering definitions, principles, applications, and expert insights."
            }
        }
        return messages[selectedType as keyof typeof messages] || messages.topic
    }

    return (
        <div className="bg-muted/20 border border-muted rounded-xl p-8 h-auto flex flex-col justify-center items-center text-center">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-primary" size={40} />
                <FileText className="text-muted-foreground" size={40} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
                {getEmptyStateMessage().title}
            </h3>
            <p className="text-muted-foreground text-sm max-w-md">
                {getEmptyStateMessage().description}
            </p>

            {/* Show recent summaries if available */}
            {summaries?.length > 0 && (
                <div className="mt-6 w-full max-w-md">
                    <h4 className="text-sm font-medium text-foreground mb-3">Recent Summaries</h4>
                    <div className="space-y-2">
                        {summaries?.slice(0, 3).map((summary, index) => (
                            <div
                                key={index}
                                className="p-3 bg-background rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => dispatch(setCurrentSummary(summary))}
                                onDoubleClick={() => dispatch(setCurrentSummary(summary))}
                            >
                                <h5 className="text-sm font-medium text-foreground truncate">
                                    {summary.title}
                                </h5>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(summary.createdAt).toLocaleDateString()} • {summary.type}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-4 p-3 bg-background rounded-lg border">
                <p className="text-xs text-muted-foreground">
                    💡 <strong>Tip:</strong> Try entering queries like:
                </p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                    {selectedType === 'act' && (
                        <>
                            <li>• {`"Right to Property Act of 1978"`}</li>
                            <li>• {`"Pakistan Penal Code"`}</li>
                            <li>• {`"Family Laws Ordinance"`}</li>
                        </>
                    )}
                    {selectedType === 'case' && (
                        <>
                            <li>• {`"Smith v. State regarding property rights"`}</li>
                            <li>• {`"Constitutional petition on fundamental rights"`}</li>
                            <li>• {`"Criminal appeal case summary"`}</li>
                        </>
                    )}
                    {selectedType === 'document' && (
                        <>
                            <li>• Upload a legal contract or agreement</li>
                            <li>• Upload court documents or judgments</li>
                            <li>• Upload legal notices or correspondence</li>
                        </>
                    )}
                    {selectedType === 'topic' && (
                        <>
                            <li>• {`"Property Transfer Law"`}</li>
                            <li>• {`"Succession Law in Pakistan"`}</li>
                            <li>• {`"Criminal Procedure Code"`}</li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default EmptyState