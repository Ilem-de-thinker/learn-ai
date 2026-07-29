import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Github, Twitter, Linkedin, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#0D0D0E] border-t border-zinc-800 text-zinc-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C9A227] flex items-center justify-center text-black font-bold">
              <Sparkles className="w-4 h-4 fill-black" />
            </div>
            <span className="font-display text-xl font-bold text-white tracking-tight">
              AI BUILDERS ACADEMY
            </span>
          </div>
          <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
            Empowering developers, designers, and tech creators to build, deploy, and scale production-ready web applications leveraging generative AI.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a href="#" className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-[#C9A227] transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-[#C9A227] transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-[#C9A227] transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-widest text-[#C9A227] font-semibold">Quick Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={() => { navigate('/'); window.scrollTo(0,0); }} className="hover:text-white transition-colors">
                Home Overview
              </button>
            </li>
            <li>
              <button onClick={() => { navigate('/register'); window.scrollTo(0,0); }} className="hover:text-white transition-colors">
                Course Registration
              </button>
            </li>
            <li>
              <button onClick={() => { navigate('/admin'); window.scrollTo(0,0); }} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Lock className="w-3 h-3 text-[#C9A227]" />
                Admin Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => { navigate('/terms'); window.scrollTo(0,0); }} className="hover:text-white transition-colors">
                Terms & Conditions
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-widest text-[#C9A227] font-semibold">Upcoming Cohort</h4>
          <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 text-xs space-y-2">
            <div className="flex justify-between text-zinc-300">
              <span>Duration:</span>
              <strong className="text-white">1 Week Intensive</strong>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Format:</span>
              <strong className="text-white">Live Online + Recordings</strong>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Status:</span>
              <span className="text-emerald-400 font-semibold">Registration Open</span>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <p>© {new Date().getFullYear()} AI Builders Academy. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/terms')} className="hover:text-zinc-300">Privacy Policy</button>
          <button onClick={() => navigate('/terms')} className="hover:text-zinc-300">Terms of Service</button>
          <span className="text-zinc-600">Built for Vercel Deployment</span>
        </div>
      </div>
    </footer>
  );
};
