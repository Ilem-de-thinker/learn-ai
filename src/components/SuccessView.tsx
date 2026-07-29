import React, { useEffect } from 'react';
import { Registration, ViewState } from '../types';
import { CheckCircle2, Home, Calendar, Mail, User, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

interface SuccessViewProps {
  registration: Registration | null;
  setView: (view: ViewState) => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ registration, setView }) => {
  useEffect(() => {
    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C9A227', '#FFFFFF', '#E2C262', '#111111'],
      });
    } catch (e) {
      console.log('Confetti effect unavailable:', e);
    }
  }, []);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center space-y-8">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#161618] rounded-3xl border border-zinc-800 p-8 sm:p-12 shadow-2xl space-y-8 relative overflow-hidden"
      >
        {/* Top Gold Halo Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#C9A227]/20 blur-3xl rounded-full pointer-events-none" />

        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-[#C9A227]/10 border-2 border-[#C9A227] flex items-center justify-center text-[#C9A227] mx-auto gold-glow">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-[#C9A227] px-3 py-1 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20">
            Registration Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Thank you for registering!
          </h1>
          <p className="text-zinc-300 text-base max-w-md mx-auto">
            Your registration has been received and your seat is reserved for the upcoming live training.
          </p>
        </div>

        {/* Registration Info Summary Card */}
        {registration && (
          <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 text-left space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Registration Reference</span>
              <span className="font-mono text-xs text-[#C9A227] bg-[#C9A227]/10 px-2.5 py-1 rounded-lg border border-[#C9A227]/20">
                {registration.id}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="flex items-center gap-2.5 text-zinc-300">
                <User className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span className="truncate">{registration.fullName}</span>
              </div>

              <div className="flex items-center gap-2.5 text-zinc-300">
                <Mail className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span className="truncate">{registration.email}</span>
              </div>

              <div className="flex items-center gap-2.5 text-zinc-300">
                <MapPin className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span className="truncate">{registration.country}, {registration.state}</span>
              </div>

              <div className="flex items-center gap-2.5 text-zinc-300">
                <Calendar className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span>Starts August 2026</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Button: Return Home */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              setView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base bg-[#C9A227] text-black hover:bg-[#d8b132] transition-all transform active:scale-95 gold-glow flex items-center justify-center gap-2 shadow-lg"
          >
            <Home className="w-5 h-5" />
            <span>Return Home</span>
          </button>
        </div>

      </motion.div>

    </div>
  );
};
