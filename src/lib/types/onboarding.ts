export type AccountType = 'personal' | 'join' | 'create';
export type OnboardingStep = 1 | 2 | 3;

export interface OnboardingData {
  accountType?: AccountType;
  fullName?: string;
  businessEmail?: string;
  organizationCode?: string;
  organizationName?: string;
}