import { OnboardingStep } from "@/lib/types/onboarding";
import { OnboardingData } from "@/lib/types/onboarding";
import { useEffect, useState } from "react";
import {  useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from 'sonner';
import { parseError } from "@/lib/parseError";


export const useOnboarding = () => {
    const { user } = useUser();
    const [step, setStep] = useState<OnboardingStep>(1);
    const [data, setData] = useState<OnboardingData>({});
    const router = useRouter();

    const {mutate: submitOnboarding, isPending} = useMutation({
        mutationFn: async (data: OnboardingData) => {
            const response = await api.post('/onboarding', data);
            return response.data;
        },
        onSuccess: () => {
            setStep(3);
        },
        onError: (error) => {
            toast.error(parseError(error));
        }
    });

    useEffect(() => {
        if (user) {
            setData({ 
                ...data,
                fullName: user.fullName || '',
                businessEmail: user.primaryEmailAddress?.emailAddress || ''
            });
        }
    }, [user, data]);
  
    const handleNext = (newData: Partial<OnboardingData>) => {
        setData({ ...data, ...newData });
        setStep((prev) => (prev + 1) as OnboardingStep);
    };
  
    const handleBack = () => {
        setStep((prev) => (prev - 1) as OnboardingStep);
    };

    return { 
        step, 
        data, 
        handleNext, 
        handleBack, 
        submitOnboarding,
        isSubmitting: isPending 
    };
}
