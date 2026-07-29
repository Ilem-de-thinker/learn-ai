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

export interface AdminStats {
  totalRegistrations: number;
  todayRegistrations: number;
  recentRegistrations: number;
  experienceBreakdown: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
}

export interface PaginatedRegistrations {
  items: Registration[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  stats: AdminStats;
}

export type ViewState = 'home' | 'register' | 'success' | 'admin' | 'terms';
