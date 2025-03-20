"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { AccountType, OnboardingStep, Role } from '@prisma/client'
import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import Cookies from 'js-cookie'
export interface OnboardingData {
  accountType?: AccountType
  businessDetails?: {
    businessName: string
    businessEmail: string
    currency: string
  }
  organizationSettings?: {
    notificationsEnabled: boolean
    emailNotifications: boolean
  }
  pendingInvites?: {
    email: string
    role: Role
  }[]
  skipInviteMembers?: boolean
}

interface OnboardingContextType {
  currentStep: OnboardingStep
  onboardingData: OnboardingData
  setStep: (step: OnboardingStep) => void
  updateData: (data: Partial<OnboardingData>) => void
  nextStep: () => void
  previousStep: () => void
  completeOnboarding: (data: OnboardingData) => Promise<void>
  isCompletingOnboarding: boolean
  isCompleted: boolean
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('ACCOUNT_TYPE_SELECTION')
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const steps: OnboardingStep[] = [
    'ACCOUNT_TYPE_SELECTION',
    'BUSINESS_DETAILS',
    'ORGANIZATION_SETUP',
    'INVITE_MEMBERS',
    'COMPLETED'
  ]

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const previousStep = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const updateData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }))
  }

  const {mutateAsync: completeOnboarding, isPending: isCompletingOnboarding} = useMutation({
    mutationFn: async (data: OnboardingData) => {
      try {
        const response = await api.post('/onboarding', {
          ...data,
        })
        setIsCompleted(true)
        return response.data
      } catch (error: any) {
        // Extract error message from API response or use fallback
        const errorMessage = error.response?.data?.error || 'Failed to complete onboarding'
        throw new Error(errorMessage)
      }
    },
    onSuccess: () => {
      toast.success('Onboarding completed successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
      throw error // Re-throw to be caught by the component
    },
  })

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        onboardingData,
        setStep: setCurrentStep,
        updateData,
        nextStep,
        previousStep,
        completeOnboarding,
        isCompletingOnboarding,
        isCompleted
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
