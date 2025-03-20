'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AccountType } from '@/lib/types/onboarding';
import { useUser } from '@clerk/nextjs';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StepThreeProps {
  accountType: AccountType;
}

export function StepThree({ accountType }: StepThreeProps) {
  const router = useRouter();
  const user = useUser();

  const handleComplete =  () => {
    user.user?.reload();
    if (accountType === 'join') {
      router.push('/');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-6">
          {accountType === 'join' ? (
            <div className="rounded-full bg-yellow-500/10 p-3">
              <Clock className="h-12 w-12 text-yellow-500" />
            </div>
          ) : (
            <div className="rounded-full bg-primary/10 p-3">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
          )}
        </div>
        <CardTitle className="text-2xl">
          {accountType === 'join' ? 'Request Sent' : 'Setup Complete'}
        </CardTitle>
        <CardDescription className="mt-2 text-base max-w-sm mx-auto">
          {accountType === 'join'
            ? "Your request to join has been sent. We'll notify you once it's approved."
            : "Your account has been set up successfully. You're ready to get started!"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pt-6">
        <Button 
          onClick={handleComplete}
          className="gap-2"
          size="lg"
        >
          {accountType === 'join' ? 'Return Home' : 'Go to Dashboard'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}