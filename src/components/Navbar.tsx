import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Users, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md border-b border-[#222225]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <button
          onClick={() => handleNav('/')}
          className="flex items-center gap-3 group text-left transition-transform hover:scale-[1.02]"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A227] to-[#8C6D14] flex items-center justify-center text-black font-bold shadow-md shadow-[#C9A227]/20 group-hover:gold-glow transition-all">
            <Sparkles className="w-5 h-5 fill-black" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-white block leading-none">
              AI BUILDERS
            </span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-[#C9A227] block mt-1">
              Live Cohort 2026
            </span>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleNav('/')}
            className={`text-sm font-medium transition-colors ${
              isActive('/') ? 'text-[#C9A227] font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            Home
          </button>

          <a
            href="#curriculum"
            onClick={(e) => {
              if (!isActive('/')) {
                e.preventDefault();
                navigate('/');
                setTimeout(() => {
                  document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Curriculum
          </a>

          <a
            href="#why-join"
            onClick={(e) => {
              if (!isActive('/')) {
                e.preventDefault();
                navigate('/');
                setTimeout(() => {
                  document.getElementById('why-join')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Why Join
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => handleNav('/join')}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#C9A227] text-black hover:bg-[#d8b132] transition-all transform active:scale-95 shadow-md shadow-[#C9A227]/20 flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Join Us
          </button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#161618] border-b border-zinc-800 px-4 py-6 space-y-4">
          <button
            onClick={() => handleNav('/')}
            className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/') ? 'text-[#C9A227] bg-[#C9A227]/10' : 'text-gray-200'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('/join')}
            className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/join') ? 'text-[#C9A227] bg-[#C9A227]/10' : 'text-gray-200'
            }`}
          >
            Join Us
          </button>
          <button
            onClick={() => handleNav('/join')}
            className="w-full mt-2 py-3 rounded-xl font-bold bg-[#C9A227] text-black text-center"
          >
            Join Us
          </button>
        </div>
      )}
    </header>
  );
};
