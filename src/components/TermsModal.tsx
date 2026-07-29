import React from 'react';
import { ViewState } from '../types';
import { Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface TermsModalProps {
  setView: (view: ViewState) => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ setView }) => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      <button
        onClick={() => {
          setView('register');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#C9A227] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Registration</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#161618] rounded-3xl border border-zinc-800 p-8 sm:p-12 shadow-2xl space-y-6 text-zinc-300 text-sm leading-relaxed"
      >
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Terms and Conditions</h1>
            <p className="text-xs text-zinc-400">AI Builders Academy Live Training Policy</p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
            1. Registration Eligibility
          </h2>
          <p className="text-xs text-zinc-400">
            By registering for the upcoming AI Web Development Training cohort, you agree to provide true, accurate, and current personal information. Duplicate registrations using automated scripts or multiple alias emails are prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
            2. Code of Conduct & Intellectual Property
          </h2>
          <p className="text-xs text-zinc-400">
            All course recordings, source code repositories, and educational materials provided during the cohort remain the property of AI Builders Academy. Attendees agree to maintain a respectful, constructive learning environment in live sessions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
            3. Privacy & Data Protection
          </h2>
          <p className="text-xs text-zinc-400">
            Your name, email, phone number, and location details are collected strictly for course communication, seat verification, and sending live access links. We do not sell or distribute candidate data to third-party advertisers.
          </p>
        </section>

        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={() => {
              setView('register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 rounded-xl font-bold text-xs bg-[#C9A227] text-black hover:bg-[#d8b132] transition-all"
          >
            I Understand & Agree
          </button>
        </div>
      </motion.div>
    </div>
  );
};
