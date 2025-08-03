import React from 'react'
import { MessageSquareText, Sparkles, Languages, ShieldCheck, BookOpen, Bolt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const ChatFeatures = () => {

    const router = useRouter()

    return (
        <div>
            <h3 className="text-2xl text-foreground font-semibold mb-6 text-center md:text-left">Why Our Chatbot Stands Out</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Our chatbot isn’t just smart — it’s thoughtfully designed for real legal needs. Here’s why it’s your ideal assistant.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface border border-border p-6 rounded-xl hover:shadow-md transition">
                    <Sparkles className="w-6 h-6 text-primary mb-2" />
                    <h4 className="font-semibold mb-1">Contextual Replies</h4>
                    <p className="text-sm text-muted-foreground">Keeps history and understands follow-up questions.</p>
                </div>
                <div className="bg-surface border border-border p-6 rounded-xl hover:shadow-md transition">
                    <Languages className="w-6 h-6 text-primary mb-2" />
                    <h4 className="font-semibold mb-1">Bilingual Support</h4>
                    <p className="text-sm text-muted-foreground">Ask and get answers in English or Urdu.</p>
                </div>
                <div className="bg-surface border border-border p-6 rounded-xl hover:shadow-md transition">
                    <MessageSquareText className="w-6 h-6 text-primary mb-2" />
                    <h4 className="font-semibold mb-1">Tone Control</h4>
                    <p className="text-sm text-muted-foreground">Switch between formal, friendly, or beginner tone.</p>
                </div>
                <div className="bg-surface border border-border p-6 rounded-xl hover:shadow-md transition">
                    <ShieldCheck className="w-6 h-6 text-primary mb-2" />
                    <h4 className="font-semibold mb-1">Ethical AI</h4>
                    <p className="text-sm text-muted-foreground">Includes disclaimers and avoids legal misguidance.</p>
                </div>
                <div className="bg-surface border border-border p-6 rounded-xl hover:shadow-md transition">
                    <BookOpen className="w-6 h-6 text-primary mb-2" />
                    <h4 className="font-semibold mb-1">Cited Sources</h4>
                    <p className="text-sm text-muted-foreground">Mentions relevant laws and links to official documentation.</p>
                </div>
                <div className="bg-surface border border-border p-6 rounded-xl hover:shadow-md transition">
                    <Bolt className="w-6 h-6 text-primary mb-2" />
                    <h4 className="font-semibold mb-1">Quick Actions</h4>
                    <p className="text-sm text-muted-foreground">Offers options for booking consultations or legal services.</p>
                </div>
            </div>

            <div className='mt-4 ' >
                <Button onClick={()=> router.push('/chat-bot')} size="lg">
                    Open Chatbot
                </Button>
                <p className="text-muted-foreground text-sm mt-2">Available 24/7 – No signup required</p>
            </div>

        </div>
    )
}

export default ChatFeatures
