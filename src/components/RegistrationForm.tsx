import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Registration, RegistrationFormData } from '../types';
import { insertRegistration } from '../db';
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Share2, 
  Tag, 
  CheckSquare, 
  Square, 
  ArrowRight, 
  AlertCircle, 
  Loader2,
  Sparkles,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface RegistrationFormProps {
  onSuccess: (registration: Registration) => void;
}

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'India',
  'Nigeria',
  'Brazil',
  'France',
  'Japan',
  'Singapore',
  'South Africa',
  'Spain',
  'Netherlands',
  'Other',
];

const OCCUPATIONS = [
  'Student / Academic',
  'Software Engineer / Developer',
  'Freelancer / Consultant',
  'Entrepreneur / Founder',
  'UI/UX Designer',
  'Data Scientist / AI Engineer',
  'Product Manager',
  'Other Professional',
];

const SOURCES = [
  'Social Media (Twitter/X, LinkedIn, IG)',
  'Google Search',
  'YouTube Video',
  'Friend / Colleague Referral',
  'Email Newsletter / Tech Blog',
  'Online Community / Discord',
  'Other',
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    email: '',
    phone: '',
    country: 'United States',
    state: '',
    occupation: 'Software Engineer / Developer',
    experience: 'Intermediate',
    source: 'Social Media (Twitter/X, LinkedIn, IG)',
    referralCode: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationFormData, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RegistrationFormData, string>> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full Name is required (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 5) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State / Province is required.';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms and Conditions to register.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    const registration: Registration & { agreeToTerms: boolean } = {
      id: 'reg_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      state: formData.state,
      occupation: formData.occupation,
      experience: formData.experience,
      source: formData.source,
      referralCode: formData.referralCode || undefined,
      createdAt: new Date().toISOString(),
      agreeToTerms: true,
    };

    try {
      await insertRegistration(registration);
      setIsSubmitting(false);
      onSuccess(registration);
    } catch (err: any) {
      console.error('Registration error:', err);
      setIsSubmitting(false);
      const msg = err?.message || '';
      if (msg.includes('duplicate key') || msg.includes('already registered')) {
        setServerError('This email is already registered.');
      } else {
        setServerError(msg || 'Failed to register. Please check your connection and try again.');
      }
    }
  };

  const handleChange = (field: keyof RegistrationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (serverError) setServerError(null);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      
      {/* Centered Single Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#161618] rounded-3xl border border-zinc-800 p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden"
      >
        {/* Subtle Accent Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A227]/5 blur-3xl rounded-full pointer-events-none" />

        {/* Card Header */}
        <div className="text-center space-y-3 pb-4 border-b border-zinc-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/10 text-[#C9A227] text-xs font-semibold border border-[#C9A227]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Course Registration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Reserve Your Seat
          </h1>
          <p className="text-sm text-zinc-400">
            Fill out the form below to register for the upcoming AI web development cohort.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Registration Failed</strong>
              <span>{serverError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-[#C9A227]" />
              Full Name <span className="text-[#C9A227]">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              className={`w-full px-4 py-3.5 rounded-xl bg-zinc-900 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all ${
                errors.fullName ? 'border-rose-500' : 'border-zinc-800'
              }`}
            />
            {errors.fullName && <p className="text-xs text-rose-400">{errors.fullName}</p>}
          </div>

          {/* Email Address & Phone Number Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C9A227]" />
                Email Address <span className="text-[#C9A227]">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="sarah@example.com"
                className={`w-full px-4 py-3.5 rounded-xl bg-zinc-900 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all ${
                  errors.email ? 'border-rose-500' : 'border-zinc-800'
                }`}
              />
              {errors.email && <p className="text-xs text-rose-400">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
                Phone Number <span className="text-[#C9A227]">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 (555) 019-2834"
                className={`w-full px-4 py-3.5 rounded-xl bg-zinc-900 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all ${
                  errors.phone ? 'border-rose-500' : 'border-zinc-800'
                }`}
              />
              {errors.phone && <p className="text-xs text-rose-400">{errors.phone}</p>}
            </div>

          </div>

          {/* Country & State Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Country */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#C9A227]" />
                Country <span className="text-[#C9A227]">*</span>
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c} className="bg-zinc-900 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                State / Province <span className="text-[#C9A227]">*</span>
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="e.g. California / Ontario"
                className={`w-full px-4 py-3.5 rounded-xl bg-zinc-900 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all ${
                  errors.state ? 'border-rose-500' : 'border-zinc-800'
                }`}
              />
              {errors.state && <p className="text-xs text-rose-400">{errors.state}</p>}
            </div>

          </div>

          {/* Occupation */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-[#C9A227]" />
              Occupation <span className="text-[#C9A227]">*</span>
            </label>
            <select
              value={formData.occupation}
              onChange={(e) => handleChange('occupation', e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all"
            >
              {OCCUPATIONS.map((o) => (
                <option key={o} value={o} className="bg-zinc-900 text-white">
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level Radios */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-[#C9A227]" />
              Experience Level <span className="text-[#C9A227]">*</span>
            </label>
            
            <div className="grid grid-cols-3 gap-3">
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => {
                const isSelected = formData.experience === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleChange('experience', level)}
                    className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                      isSelected
                        ? 'border-[#C9A227] bg-[#C9A227]/10 text-[#C9A227] shadow-md shadow-[#C9A227]/10'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Source (How did you hear about us) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Share2 className="w-3.5 h-3.5 text-[#C9A227]" />
              How did you hear about us? <span className="text-[#C9A227]">*</span>
            </label>
            <select
              value={formData.source}
              onChange={(e) => handleChange('source', e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all"
            >
              {SOURCES.map((s) => (
                <option key={s} value={s} className="bg-zinc-900 text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Referral Code */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-[#C9A227]" />
              Referral Code <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.referralCode}
              onChange={(e) => handleChange('referralCode', e.target.value)}
              placeholder="e.g. VIP_GUEST_2026"
              className="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all"
            />
          </div>

          {/* Agree to Terms Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <button
                type="button"
                onClick={() => handleChange('agreeToTerms', !formData.agreeToTerms)}
                className="mt-0.5 text-[#C9A227] shrink-0"
              >
                {formData.agreeToTerms ? (
                  <CheckSquare className="w-5 h-5 fill-[#C9A227] text-black" />
                ) : (
                  <Square className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300" />
                )}
              </button>
              <span className="text-xs text-zinc-400 leading-relaxed">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/terms');
                  }}
                  className="text-[#C9A227] hover:underline font-semibold"
                >
                  Terms and Conditions
                </button>{' '}
                and confirm that my registration details are accurate.
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-xs text-rose-400 mt-1.5">{errors.agreeToTerms}</p>
            )}
          </div>

          {/* Large Gold Register Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 rounded-2xl font-bold text-lg bg-[#C9A227] text-black hover:bg-[#d8b132] transition-all active:scale-[0.99] gold-glow flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Processing Registration...</span>
                </>
              ) : (
                <>
                  <span>Register Now</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>

        </form>

        <div className="text-center pt-2 border-t border-zinc-800/80 space-y-3">
          <p className="text-xs text-zinc-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Your information is encrypted and protected.
          </p>
          <a
            href="https://chat.whatsapp.com/HsrZXo4d6zR6Tbl9v9xrpd"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-[#C9A227] hover:underline font-semibold"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Join our Academy WhatsApp group</span>
          </a>
        </div>

      </motion.div>

    </div>
  );
};
