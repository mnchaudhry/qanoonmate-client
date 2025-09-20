import { Button } from '@/components/ui/button'
import { Check, Coins, Zap } from 'lucide-react'
import React, { useState } from 'react'
import { QCPackage } from '@/store/types/credits.types'
import QCPurchaseModal from './wallet/QCPurchaseModal'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import SignInModal from './auth/SignInModal'

const Plan = ({ plan }: { plan: QCPackage }) => {
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const { requireAuth, showSignInModal, modalConfig, handleSignInSuccess, handleSignInCancel } = useAuthGuard();

    const handlePurchase = () => {
        requireAuth(() => {
            setShowPurchaseModal(true);
        }, {
            customMessage: 'Please sign in to purchase Qanoon Credits',
            showBenefits: true
        });
    };

    const handleClosePurchaseModal = () => {
        setShowPurchaseModal(false);
    };

    return (
        <div className={`relative p-8 rounded-lg border shadow-sm hover:shadow-xl transition-all duration-300 ${plan.popular ? "bg-primary/5 border-primary shadow-md scale-105" : "bg-neutral !border-border"}`}>
            {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-neutral text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    POPULAR
                </div>
            )}
            {plan.savings && (
                <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg rounded-tl-lg">
                    {plan.savings}
                </div>
            )}
            
            <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                    <Coins className="h-6 w-6 text-primary mr-2" />
                    <h3 className="font-bold text-xl">{plan.name}</h3>
                </div>
                
                <div className="text-4xl font-bold mb-2 text-primary">
                    {plan.qcAmount} QC
                </div>
                
                <div className="text-2xl font-semibold mb-2">
                    ${plan.price}
                    <span className="text-lg text-muted-foreground"> one-time</span>
                </div>
                
                <p className="text-muted-foreground text-sm">{plan.description}</p>
            </div>
            
            <ul className="space-y-3 mb-6">
                {plan.features.map((feature: string, idx: number) => (
                    <li className="flex items-start" key={idx}>
                        <Check className="text-primary h-4 w-4 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                    </li>
                ))}
            </ul>
            
            <Button 
                className="w-full py-2.5" 
                onClick={handlePurchase}
                variant={plan.popular ? "default" : "outline"}
            >
                <Zap className="h-4 w-4 mr-2" />
                Purchase Credits
            </Button>

            {/* Purchase Modal */}
            <QCPurchaseModal
                isOpen={showPurchaseModal}
                onClose={handleClosePurchaseModal}
                package={plan}
            />

            {/* Sign In Modal */}
            <SignInModal
                isOpen={showSignInModal}
                onClose={handleSignInCancel}
                onSuccess={handleSignInSuccess}
                title={modalConfig.title}
                description={modalConfig.description}
                showBenefits={modalConfig.showBenefits}
            />
        </div>
    )
}

export default Plan