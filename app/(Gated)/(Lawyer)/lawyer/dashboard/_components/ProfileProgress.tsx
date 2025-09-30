"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, AlertCircle, Shield } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { Lawyer } from "@/store/types/lawyer.types"

// Import edit modals
import { EditOverviewModal } from "@/app/(Gated)/(LandingPage)/lawyers/[username]/_components/edit/EditOverviewModal"
import { EditExpertiseModal } from "@/app/(Gated)/(LandingPage)/lawyers/[username]/_components/edit/EditExpertiseModal"
import { EditCredentialsModal } from "@/app/(Gated)/(LandingPage)/lawyers/[username]/_components/edit/EditCredentialsModal"
import { EditPortfolioModal } from "@/app/(Gated)/(LandingPage)/lawyers/[username]/_components/edit/EditPortfolioModal"
import { EditContactModal } from "@/app/(Gated)/(LandingPage)/lawyers/[username]/_components/edit/EditContactModal"
import { EditAvailabilityModal } from "@/app/(Gated)/(LandingPage)/lawyers/[username]/_components/edit/EditAvailabilityModal"
import { EditModalProvider } from "@/app/(Gated)/(LandingPage)/lawyers/[username]/_components/edit/EditModalContext"
import { getProgressSteps } from "@/lib/utils/profileCompletion"

interface ProgressStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  status: 'completed' | 'pending' | 'current'
  action?: {
    href?: string
    isExternal?: boolean
    modalId?: string
  }
}

export default function ProfileProgress() {
  const { user } = useSelector((state: RootState) => state.auth)
  const lawyer = user as Lawyer
  const [activeModal, setActiveModal] = useState<string | null>(null)

  if (!lawyer || lawyer.role !== 'lawyer') {
    return null
  }

  const openModal = (modalId: string) => {
    setActiveModal(modalId)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const getProgressStepsData = (): ProgressStep[] => {
    if (!lawyer) return []
    return getProgressSteps(lawyer)
  }

  const steps = getProgressStepsData()
  const completedSteps = steps.filter(step => step.status === 'completed').length
  const totalSteps = steps.length
  const progressPercentage = (completedSteps / totalSteps) * 100

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-primary" />
      case 'current':
        return <AlertCircle className="w-5 h-5 text-amber-600" />
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-primary'
      case 'current':
        return 'text-amber-600'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <EditModalProvider lawyer={lawyer}>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Profile Progress
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completion</span>
              <span className="font-medium">{completedSteps}/{totalSteps} steps</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {progressPercentage === 100 ? 'Profile complete!' :
                `${Math.round(progressPercentage)}% complete`}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {steps.map((step) => {
            return (
              <div key={step.id} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getStatusIcon(step.status)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-between w-full">
                      {
                        step.action && (step.status === 'current' || step.status === 'pending')
                          ?
                          <span onClick={() => {
                            if (step.action?.modalId) {
                              openModal(step.action.modalId)
                            }
                          }} className={`text-sm font-medium cursor-pointer hover:underline ${getStatusColor(step.status)}`}>
                            {step.title}
                          </span>
                          :
                          <span className={`text-sm font-medium ${getStatusColor(step.status)}`}>
                            {step.title}
                          </span>

                      }
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}

          {progressPercentage < 100 && (
            <div className="pt-3 border-t border-border">
              <div className="bg-muted/30 border border-border rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Complete your profile
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Finish setting up your profile to unlock all features and increase client trust.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {progressPercentage === 100 && (
            <div className="pt-3 border-t border-border">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Profile Complete!
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your profile is fully set up. You now have access to all platform features.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modals */}
      <EditOverviewModal isOpen={activeModal === 'overview'} onClose={closeModal} />
      <EditExpertiseModal isOpen={activeModal === 'expertise'} onClose={closeModal} />
      <EditCredentialsModal isOpen={activeModal === 'credentials'} onClose={closeModal} />
      <EditPortfolioModal isOpen={activeModal === 'portfolio'} onClose={closeModal} />
      <EditContactModal isOpen={activeModal === 'contact'} onClose={closeModal} />
      <EditAvailabilityModal isOpen={activeModal === 'availability'} onClose={closeModal} />
    </EditModalProvider>
  )
}
