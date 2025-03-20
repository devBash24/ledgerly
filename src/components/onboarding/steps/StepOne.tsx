// src/components/onboarding/steps/StepOne.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AccountType, OnboardingData } from '@/lib/types/onboarding';
import { Building2, UserCircle, Users } from 'lucide-react';

interface StepOneProps {
  onNext: (data: Partial<OnboardingData>) => void;
}

export function StepOne({ onNext }: StepOneProps) {
  const handleSelect = (type: AccountType) => {
    onNext({ accountType: type });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <Button
          variant="outline"
          className="w-full h-auto p-6 hover:border-primary hover:bg-primary/5"
          onClick={() => handleSelect('personal')}
        >
          <div className="flex items-center gap-4">
            <UserCircle className="h-8 w-8 text-primary" />
            <div className="text-left">
              <h3 className="font-semibold text-lg">Personal Account</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create your own personal workspace
              </p>
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full h-auto p-6 hover:border-primary hover:bg-primary/5"
          onClick={() => handleSelect('join')}
        >
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-primary" />
            <div className="text-left">
              <h3 className="font-semibold text-lg">Join Organization</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Join an existing organization with a code
              </p>
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full h-auto p-6 hover:border-primary hover:bg-primary/5"
          onClick={() => handleSelect('create')}
        >
          <div className="flex items-center gap-4">
            <Building2 className="h-8 w-8 text-primary" />
            <div className="text-left">
              <h3 className="font-semibold text-lg">Create Organization</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create a new organization for your team
              </p>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
}