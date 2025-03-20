'use client';
import { StepOne } from '@/components/onboarding/steps/StepOne';
import { StepTwo } from '@/components/onboarding/steps/StepTwo';
import { StepThree } from '@/components/onboarding/steps/StepThree';
import { useOnboarding } from '@/hooks/useOnboarding';
import OnboardingStepper from '@/components/onboarding/OnboardingStepper';

const STEPS = [
  {
    title: 'Account Type',
    description: 'Choose how to use Ledgerly'
  },
  {
    title: 'Details',
    description: 'Complete your profile'
  },
  {
    title: 'Finish',
    description: 'Ready to go'
  }
];

export default function OnboardingPage() {
  const { step, data, handleNext, handleBack } = useOnboarding();

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-5xl mx-auto px-4 py-16">
        <div className="space-y-8 text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Ledgerly</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Let&apos;s get you set up with your account. It&apos;ll only take a couple of minutes.
          </p>
        </div>
        
        <div className="max-w-xs mx-auto mb-12 sm:max-w-md md:max-w-2xl">
          <OnboardingStepper currentStep={step} steps={STEPS} />
        </div>

        <div className="mt-8 flex justify-center">
          {step === 1 && <StepOne onNext={handleNext} />}
          {step === 2 && (
            <StepTwo
              accountType={data.accountType!}
              data={data}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 3 && <StepThree accountType={data.accountType!} />}
        </div>
      </div>
    </main>
  );
}