'use client';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {
  currentStep: number;
  steps: { title: string; description: string }[];
}

export default function OnboardingStepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="relative">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-border">
        <div
          className="absolute h-full bg-primary transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>
      
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;

          return (
            <div
              key={step.title}
              className={cn(
                "flex flex-col items-center",
                (isActive || isCompleted) && "text-primary"
              )}
            >
              <div
                className={cn(
                  "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background transition-colors",
                  isActive && "border-primary",
                  isCompleted && "border-primary bg-primary",
                  !isActive && !isCompleted && "border-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 text-primary-foreground" />
                ) : (
                  <span className={cn(
                    "text-sm font-medium",
                    isCompleted && "text-primary-foreground",
                    !isActive && !isCompleted && "text-muted-foreground"
                  )}>
                    {stepNumber}
                  </span>
                )}
              </div>
              <div className="absolute mt-16 w-32 text-center">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}