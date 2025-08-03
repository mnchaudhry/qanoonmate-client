import React from 'react'
import { SendHorizonal } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ChatDemo = () => {
    return (
        <div className="relative bg-surface flex flex-col justify-between h-full py-6 px-4 sm:px-6 rounded-xl max-w-3xl mx-auto shadow-inner mb-20">

            <div className="flex flex-col gap-4 ">
                <h2 className="text-xl font-semibold text-center mb-8">
                    Preview a Typical Interaction
                </h2>

                <div className="space-y-4">
                    {/* Message 1 - User */}
                    <div className="flex items-start gap-2">
                        <div className="bg-muted rounded-full p-2">
                            <span className="text-xs font-medium">You</span>
                        </div>
                        <div className="bg-muted px-4 py-3 rounded-lg w-fit max-w-[80%]">
                            <p>What are my rights if I get fired without notice?</p>
                        </div>
                    </div>

                    {/* Message 2 - AI */}
                    <div className="flex items-start justify-end gap-2">
                        <div className="bg-primary/10 px-4 py-3 rounded-lg w-fit max-w-[80%]">
                            <p>
                                Under the <span className="font-semibold">Employment Act 2021</span>, an employer must provide valid notice or severance.
                                Please refer to <span className="underline">Section 17</span> of the Act.
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">Tone: Formal · Source: Employment Act</p>
                        </div>
                        <div className="bg-primary text-background rounded-full p-2 w-9 h-9 flex items-center justify-center">
                            <span className="text-xs font-medium">AI</span>
                        </div>
                    </div>

                    {/* Message 3 - User */}
                    <div className="flex items-start gap-2">
                        <div className="bg-muted rounded-full p-2">
                            <span className="text-xs font-medium">You</span>
                        </div>
                        <div className="bg-muted px-4 py-3 rounded-lg w-fit max-w-[80%]">
                            <p>Can I take any legal action against them?</p>
                        </div>
                    </div>

                    {/* Message 4 - AI */}
                    <div className="flex items-start justify-end gap-2">
                        <div className="bg-primary/10 px-4 py-3 rounded-lg w-fit max-w-[80%]">
                            <p>
                                Yes, you may file a complaint with the <span className="font-semibold">Labour Department</span> or pursue civil litigation if your rights were violated.
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">Quick Action: <span className="underline cursor-pointer">Book Consultation</span></p>
                        </div>
                        <div className="bg-primary text-background rounded-full p-2 w-9 h-9 flex items-center justify-center">
                            <span className="text-xs font-medium">AI</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input field (non-functional) */}
            <div className="mt-10">
                <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-4 py-2">
                    <input
                        type="text"
                        disabled
                        className="bg-transparent w-full outline-none placeholder:text-muted-foreground"
                        placeholder="Type your question here..."
                    />
                    <Button variant="ghost" size="icon" disabled>
                        <SendHorizonal className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </div>
                <p className="text-center text-muted-foreground text-sm mt-4">
                    This is a demo. Full chat experience is coming soon.
                </p>
            </div>
        </div>
    )
}

export default ChatDemo
