import React from 'react';
import { ViewState } from '../types';
import { ArrowRight, Sparkles, Zap, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  setView: (view: ViewState) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ setView }) => {
  return (
    <div className="relative overflow-hidden bg-[#111111] pt-12 pb-24 border-b border-zinc-800">
      {/* Subtle Gold Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#C9A227]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 border border-[#C9A227]/30 text-xs font-semibold text-[#C9A227] shadow-lg shadow-black/50"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Limited Live Cohort • Next Session Starts August 2026</span>
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]"
          >
            Build Complete Websites <br />
            <span className="gold-gradient-text font-display">with AI</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Register now for the upcoming training. Learn how to design, engineer, and deploy modern production web applications using Next.js and Tailwind CSS.
          </motion.p>

          {/* One Large Gold Button */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => {
                setView('register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-lg bg-[#C9A227] text-black hover:bg-[#dbb431] transition-all transform hover:scale-[1.02] active:scale-95 gold-glow flex items-center justify-center gap-3 shadow-xl"
            >
              <span>Register Now</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
            <a
              href="https://chat.whatsapp.com/HsrZXo4d6zR6Tbl9v9xrpd"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-lg bg-zinc-900 text-zinc-100 hover:bg-zinc-800 transition-all border border-zinc-700 hover:border-[#C9A227]/50 flex items-center justify-center gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Join WhatsApp Group</span>
            </a>
          </motion.div>

          {/* Live Trust Metrics */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="pt-10 grid grid-cols-2 gap-4 max-w-sm mx-auto"
          >
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 text-center">
              <div className="flex items-center justify-center text-[#C9A227] mb-1">
                <Zap className="w-4 h-4 mr-1.5" />
                <span className="font-bold text-xl text-white">1 Week</span>
              </div>
              <p className="text-xs text-zinc-400">Live Intensive</p>
            </div>


          </motion.div>

        </div>
      </div>
    </div>
  );
};
