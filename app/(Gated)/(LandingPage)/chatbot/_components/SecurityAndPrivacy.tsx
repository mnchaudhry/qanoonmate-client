import React from 'react'
import { ShieldCheck } from 'lucide-react'

const SecurityAndPrivacy = () => {
    return (
        <section className="mt-24 bg-gradient-to-r from-primary/5 via-white to-primary/5 py-16 px-6 rounded-2xl shadow-inner">
            <div className="max-w-3xl mx-auto text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-4 rounded-full">
                        <ShieldCheck className="w-8 h-8 text-primary-600" />
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-primary-900 mb-4">Security & Privacy</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                    We take your privacy seriously. All conversations with the chatbot are encrypted and confidential.
                    Your personal data is never stored, shared, or used without consent. You&apos;re in control — always.
                </p>
            </div>
        </section>
    )
}

export default SecurityAndPrivacy
