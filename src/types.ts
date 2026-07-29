export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  occupation: string;
  experience: ExperienceLevel;
  source: string;
  referralCode?: string;
  createdAt: string;
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  occupation: string;
  experience: ExperienceLevel;
  source: string;
  referralCode?: string;
  agreeToTerms: boolean;
}
