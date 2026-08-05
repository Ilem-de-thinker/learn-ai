export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  occupation: string;
  experience: ExperienceLevel;
  source: string;
  createdAt: string;
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  occupation: string;
  experience: ExperienceLevel;
  source: string;
  agreeToTerms: boolean;
}
