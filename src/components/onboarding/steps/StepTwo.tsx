'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AccountType, OnboardingData } from '@/lib/types/onboarding';
import { ArrowLeft, Building2, Loader2, Mail, User, UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { parseError } from '@/lib/parseError';

interface StepTwoProps {
  accountType: AccountType;
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
}

export function StepTwo({ accountType, onNext, onBack, data }: StepTwoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: data.fullName || '',
    businessEmail: data.businessEmail || '',
    organizationCode: data.organizationCode || '',
    organizationName: data.organizationName || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/onboarding', {
        ...formData,
        accountType
      });
      onNext({
        ...formData,
        accountType
      });
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl">
          {accountType === 'join' ? 'Join Organization' : 'Complete Your Profile'}
        </CardTitle>
        <CardDescription>
          {accountType === 'join' 
            ? 'Enter your details and organization code to join'
            : 'Tell us a bit about yourself and your organization'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <div className="relative">
                <Input
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="pl-10"
                />
                <User className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              </div>
            </div>

            {accountType !== 'join' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Organization Name</label>
                  <div className="relative">
                    <Input
                      required
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      className="pl-10"
                    />
                    <Building2 className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Email</label>
                  <div className="relative">
                    <Input
                      type="email"
                      required
                      value={formData.businessEmail}
                      onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                      className="pl-10"
                    />
                    <Mail className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  </div>
                </div>
              </>
            )}
            
            {accountType === 'join' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Organization Code</label>
                <div className="relative">
                  <Input
                    required
                    value={formData.organizationCode}
                    onChange={(e) => setFormData({ ...formData, organizationCode: e.target.value })}
                    className="pl-10"
                  />
                  <UserCircle className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              disabled={isSubmitting}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {accountType === 'join' ? 'Joining...' : 'Creating...'}
                </>
              ) : (
                accountType === 'join' ? 'Join Organization' : 'Create Account'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}