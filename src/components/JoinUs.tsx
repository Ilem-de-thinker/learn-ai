import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Users } from 'lucide-react';
import { motion } from 'motion/react';

export const JoinUs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-[#111111] py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#C9A227]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 border border-[#C9A227]/30 text-xs font-semibold text-[#C9A227] shadow-lg shadow-black/50">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Builders Academy • Live Cohort 2026</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
              Join Our Community
            </h1>
            <p className="text-lg text-zinc-300 max-w-lg mx-auto font-normal leading-relaxed">
              Get course updates, ask questions, and connect with fellow builders before the live cohort starts.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-4 flex flex-col gap-5"
          >
            <a
              href="https://chat.whatsapp.com/HsrZXo4d6zR6Tbl9v9xrpd"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-10 py-6 rounded-2xl font-bold text-lg bg-[#25D366] text-black hover:bg-[#3ee083] transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              <span>Join WhatsApp Group</span>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="pt-6 text-sm text-zinc-500"
          >
            Prefer to browse first?{' '}
            <button
              onClick={() => {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1 text-[#C9A227] hover:underline font-semibold"
            >
              Back to Home
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};
